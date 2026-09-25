"use server";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { CartLine } from "@/lib/cart-store";
import { effectiveTier, getTierThresholds, tierForQuantity, unitPrice } from "@/lib/pricing";
import { availableDeliveryMethods, deliveryFee, findZoneForCity } from "@/lib/delivery";
import { generateOrderNumber, isValidCameroonPhone, normalizeCameroonPhone } from "@/lib/orders";
import type { DeliveryMethod } from "@/generated/prisma/client";

export type CheckoutState = { error: string | null; problemSlugs?: string[] };

/**
 * RG-15 (anti-abus) : limite de débit par IP. Compteur en mémoire, propre à
 * cette instance de serveur — suffisant en développement, à remplacer par un
 * magasin partagé (Upstash/Redis) avant une mise en ligne multi-instance.
 */
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

export async function createOrder(_prevState: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";

  // RG-15 : champ piège invisible — un bot qui le remplit reçoit une erreur générique.
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) {
    return { error: "Une erreur est survenue. Merci de réessayer." };
  }

  if (!checkRateLimit(ip)) {
    return { error: "Trop de tentatives. Merci de réessayer dans quelques minutes." };
  }

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim();
  const deliveryMethod = String(formData.get("deliveryMethod") ?? "") as DeliveryMethod;
  const address = String(formData.get("address") ?? "").trim() || null;
  const relayPointId = String(formData.get("relayPointId") ?? "").trim() || null;
  const agencyNote = String(formData.get("agencyNote") ?? "").trim() || null;
  const customerNote = String(formData.get("customerNote") ?? "").trim() || null;
  const acceptTerms = formData.get("acceptTerms") === "on";
  const locale = String(formData.get("locale") ?? "fr");
  const cartLinesRaw = String(formData.get("cartLines") ?? "[]");

  if (!firstName || !lastName || !city) {
    return { error: "Merci de renseigner le prénom, le nom et la ville." };
  }
  // RG-07 : coordonnées obligatoires ; F06 : format camerounais (9 chiffres commençant par 6 ou 2).
  if (!isValidCameroonPhone(phoneRaw)) {
    return { error: "Le numéro de téléphone doit être un numéro camerounais valide (9 chiffres commençant par 6 ou 2)." };
  }
  if (!acceptTerms) {
    return { error: "Merci d'accepter les conditions de vente." };
  }

  const validMethods = availableDeliveryMethods(city);
  if (!validMethods.includes(deliveryMethod)) {
    return { error: "Le mode de livraison choisi n'est pas disponible pour cette ville." };
  }
  if (deliveryMethod === "SHIPPING" && !address) {
    return { error: "Merci de préciser une adresse pour l'expédition." };
  }
  if (deliveryMethod === "RELAY" && !relayPointId) {
    return { error: "Merci de choisir un point relais." };
  }

  const phone = normalizeCameroonPhone(phoneRaw);

  // RG-15 : pas plus de 3 commandes NEW simultanées pour un même numéro.
  const pendingCount = await prisma.order.count({ where: { phone, status: "NEW" } });
  if (pendingCount >= 3) {
    return {
      error: "Vous avez déjà 3 commandes en attente avec ce numéro. La boutique va vous contacter pour les finaliser.",
    };
  }

  let cartLines: CartLine[];
  try {
    cartLines = JSON.parse(cartLinesRaw);
  } catch {
    cartLines = [];
  }
  if (!Array.isArray(cartLines) || cartLines.length === 0) {
    return { error: "Votre panier est vide." };
  }

  // RG-08 : le serveur relit produit/variante et recalcule tout — jamais de prix venant du client.
  const slugs = Array.from(new Set(cartLines.map((line) => line.productSlug)));
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, status: "PUBLISHED" },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, variants: true },
  });

  const problemSlugs: string[] = [];
  const resolvedLines = cartLines.map((line) => {
    const product = products.find((p) => p.slug === line.productSlug);
    const variant = product?.variants.find(
      (v) => (v.size ?? undefined) === line.size && (v.color ?? undefined) === line.color && (v.scent ?? undefined) === line.scent,
    );
    const ok = !!product && !!variant && variant.stock >= line.quantity && product.inStock;
    if (!ok) problemSlugs.push(line.productSlug);
    return { line, product, variant };
  });

  if (problemSlugs.length > 0) {
    return {
      error: "Certains articles ne sont plus disponibles dans la quantité demandée. Retournez au panier pour les ajuster.",
      problemSlugs,
    };
  }

  // F08/F09 : si le client est connecté, la commande lui est rattachée (F08) et son statut
  // pro validé (F09) ouvre droit aux paliers (RG-03) ; sinon, palier toujours détail.
  const session = await auth();
  const isCustomerLoggedIn = session?.user.role === "CUSTOMER";
  const customer = isCustomerLoggedIn ? await prisma.user.findUnique({ where: { id: session!.user.id } }) : null;

  const totalQuantity = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const tier = effectiveTier(tierForQuantity(totalQuantity, await getTierThresholds()), customer?.proStatus === "APPROVED");

  const items = resolvedLines.map(({ line, product, variant }) => {
    const price = unitPrice(product!, tier);
    return {
      productId: product!.id,
      variantId: variant!.id,
      name: product!.nameFr,
      reference: product!.reference,
      size: variant!.size,
      color: variant!.color,
      scent: variant!.scent,
      imageUrl: product!.images[0]?.urlThumb ?? null,
      unitPrice: price,
      quantity: line.quantity,
      lineTotal: price * line.quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const zone = deliveryMethod === "PICKUP" ? null : await findZoneForCity(city);
  const fee = deliveryFee(deliveryMethod, zone, tier);
  const total = subtotal + fee;
  const number = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      number,
      userId: customer?.id ?? null,
      firstName,
      lastName,
      phone,
      email,
      locale,
      deliveryMethod,
      city,
      zoneId: zone?.id ?? null,
      relayPointId: deliveryMethod === "RELAY" ? relayPointId : null,
      address: deliveryMethod === "SHIPPING" ? address : null,
      agencyNote: deliveryMethod === "SHIPPING" ? agencyNote : null,
      customerNote,
      tier,
      subtotal,
      deliveryFee: fee,
      total,
      items: { create: items },
      events: { create: [{ type: "STATUS_CHANGE", toStatus: "NEW", note: "Commande créée" }] },
    },
  });

  // E1 (confirmation par e-mail) nécessite Resend, non branché à ce stade — voir docs/decisions.md.

  return redirect({
    href: { pathname: "/commande/confirmation/[numero]", params: { numero: order.number } },
    locale: locale === "en" ? "en" : "fr",
  });
}
