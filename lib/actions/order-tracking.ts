"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { normalizeCameroonPhone } from "@/lib/orders";

export type TrackedOrder = {
  number: string;
  status: string;
  createdAt: Date;
  deliveryMethod: string;
  city: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  receiptRequested: boolean;
  items: { name: string; size: string | null; color: string | null; scent: string | null; quantity: number; lineTotal: number }[];
  history: { toStatus: string | null; createdAt: Date }[];
};

export type TrackingState = { error: string | null; order: TrackedOrder | null };

/**
 * F07 : limite de débit par IP, même mécanisme que le formulaire de commande
 * (lib/actions/order.ts) — compteur en mémoire, propre à l'instance de
 * serveur. Ici la fenêtre est plus courte car la page est une cible
 * d'énumération (numéro de commande + téléphone).
 */
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

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

const GENERIC_ERROR = "Aucune commande ne correspond à ces informations.";

/**
 * F07 : le numéro et le téléphone doivent correspondre, sinon message
 * générique (pas d'indication sur ce qui est faux). L'historique renvoyé ne
 * contient jamais les notes internes ni les événements internes (contact,
 * paiement) — seulement les changements de statut.
 */
export async function trackOrder(_prevState: TrackingState, formData: FormData): Promise<TrackingState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return { error: "Trop de tentatives. Merci de réessayer dans quelques minutes.", order: null };
  }

  const number = String(formData.get("number") ?? "").trim().toUpperCase();
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  if (!number || !phoneRaw) {
    return { error: GENERIC_ERROR, order: null };
  }
  const phone = normalizeCameroonPhone(phoneRaw);

  const order = await prisma.order.findUnique({
    where: { number },
    include: {
      items: true,
      events: { where: { type: "STATUS_CHANGE" }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!order || order.phone !== phone) {
    return { error: GENERIC_ERROR, order: null };
  }

  return {
    error: null,
    order: {
      number: order.number,
      status: order.status,
      createdAt: order.createdAt,
      deliveryMethod: order.deliveryMethod,
      city: order.city,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      receiptRequested: order.receiptRequested,
      items: order.items.map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        scent: item.scent,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      history: order.events.map((event) => ({ toStatus: event.toStatus, createdAt: event.createdAt })),
    },
  };
}

/** F07 : bouton "Demander un reçu" — positionne `receiptRequested`, visible par la gérante dans la liste des commandes. */
export async function requestReceipt(number: string, phoneRaw: string): Promise<void> {
  const phone = normalizeCameroonPhone(phoneRaw);
  const order = await prisma.order.findUnique({ where: { number } });
  if (!order || order.phone !== phone) return;

  await prisma.order.update({ where: { id: order.id }, data: { receiptRequested: true } });
  revalidatePath("/admin/commandes");
}
