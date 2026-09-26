"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { canTransition } from "@/lib/orders";
import { computeProductInStock, findStockShortages } from "@/lib/stock";
import { sendOrderEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import { maybeSendLowStockAlert } from "@/lib/low-stock-alert";
import OrderStatusEmail, { type OrderEmailVariant } from "@/emails/OrderStatusEmail";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";

export type ChangeStatusState = { error: string | null };

async function recomputeInStock(tx: Prisma.TransactionClient, productIds: Iterable<string>) {
  for (const productId of productIds) {
    const variants = await tx.variant.findMany({ where: { productId, isActive: true }, select: { stock: true } });
    const inStock = computeProductInStock(variants.map((v) => v.stock));
    await tx.product.update({ where: { id: productId }, data: { inStock } });
  }
}

const STATUS_TO_EMAIL_VARIANT: Partial<Record<OrderStatus, OrderEmailVariant>> = {
  CONFIRMED: "confirmed",
  READY: "ready",
  SHIPPED: "shipped",
  CANCELLED: "cancelled",
};

const STATUS_EMAIL_CODE: Record<OrderEmailVariant, string> = {
  received: "E1",
  confirmed: "E3",
  ready: "E4",
  shipped: "E4",
  cancelled: "E5",
};

const STATUS_EMAIL_SUBJECT: Record<OrderEmailVariant, { fr: (n: string) => string; en: (n: string) => string }> = {
  received: { fr: (n) => `Commande ${n} reçue`, en: (n) => `Order ${n} received` },
  confirmed: { fr: (n) => `Commande ${n} confirmée`, en: (n) => `Order ${n} confirmed` },
  ready: { fr: (n) => `Commande ${n} prête`, en: (n) => `Order ${n} ready` },
  shipped: { fr: (n) => `Commande ${n} expédiée`, en: (n) => `Order ${n} shipped` },
  cancelled: { fr: (n) => `Commande ${n} annulée`, en: (n) => `Order ${n} cancelled` },
};

/** F24 (E3/E4/E5) : n'envoie que si le client a laissé un e-mail (RG-07). Jamais appelé dans la transaction (appel réseau). */
async function sendStatusEmail(order: Prisma.OrderGetPayload<{ include: { items: true } }>, newStatus: OrderStatus): Promise<void> {
  if (!order.email) return;
  const variant = STATUS_TO_EMAIL_VARIANT[newStatus];
  if (!variant) return;

  const locale = order.locale === "en" ? "en" : "fr";
  await sendOrderEmail({
    orderId: order.id,
    to: order.email,
    code: STATUS_EMAIL_CODE[variant],
    subject: STATUS_EMAIL_SUBJECT[variant][locale](order.number),
    react: <OrderStatusEmail locale={locale} variant={variant} firstName={order.firstName} order={order} siteUrl={getSiteUrl()} />,
  });
}

/**
 * F18 : changement de statut d'une commande. RG-09 (transitions autorisées),
 * RG-10 (décompte du stock à la confirmation, dans une transaction, refusé
 * si le stock est insuffisant), RG-12 (une annulation après confirmation
 * remet les quantités en stock). Chaque changement crée un `OrderEvent`
 * (historique jamais modifiable ni supprimable). F24 : e-mail de suivi et
 * alerte de stock bas envoyés après la transaction (jamais dans celle-ci —
 * un appel réseau ne doit pas tenir la transaction ouverte).
 */
export async function changeOrderStatus(orderId: string, newStatus: OrderStatus): Promise<ChangeStatusState> {
  const session = await requireRole("OWNER");

  let emailOrder: Prisma.OrderGetPayload<{ include: { items: true } }> | null = null;
  const lowStockChecks: Array<{ variantId: string; previousStock: number; newStock: number; threshold: number }> = [];

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: { items: { include: { variant: true } } },
      });

      if (!canTransition(order.status, newStatus)) {
        throw new Error(`Transition non autorisée : ${order.status} → ${newStatus}.`);
      }

      if (newStatus === "CONFIRMED") {
        const shortages = findStockShortages(order.items.map((item) => ({ ...item, stock: item.variant.stock })));
        if (shortages.length > 0) {
          throw new Error(
            `Stock insuffisant : ${shortages
              .map((i) => `${i.name}${[i.size, i.color, i.scent].filter(Boolean).length ? ` (${[i.size, i.color, i.scent].filter(Boolean).join(" · ")})` : ""} — ${i.quantity} demandé(s), ${i.variant.stock} en stock`)
              .join(" ; ")}.`,
          );
        }
        for (const item of order.items) {
          await tx.variant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
          await tx.stockMovement.create({
            data: {
              variantId: item.variantId,
              delta: -item.quantity,
              reason: "ORDER_CONFIRMED",
              orderId: order.id,
              userId: session.user.id,
            },
          });
          lowStockChecks.push({
            variantId: item.variantId,
            previousStock: item.variant.stock,
            newStock: item.variant.stock - item.quantity,
            threshold: item.variant.lowStockThreshold,
          });
        }
        await tx.order.update({ where: { id: order.id }, data: { status: "CONFIRMED", confirmedAt: new Date() } });
        await recomputeInStock(tx, new Set(order.items.map((i) => i.productId)));
      } else if (newStatus === "CANCELLED" && order.status !== "NEW") {
        for (const item of order.items) {
          await tx.variant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } });
          await tx.stockMovement.create({
            data: {
              variantId: item.variantId,
              delta: item.quantity,
              reason: "ORDER_CANCELLED",
              orderId: order.id,
              userId: session.user.id,
            },
          });
        }
        await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
        await recomputeInStock(tx, new Set(order.items.map((i) => i.productId)));
      } else {
        await tx.order.update({ where: { id: order.id }, data: { status: newStatus } });
      }

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          type: "STATUS_CHANGE",
          fromStatus: order.status,
          toStatus: newStatus,
          userId: session.user.id,
        },
      });

      emailOrder = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } });
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erreur inconnue." };
  }

  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/commandes");
  revalidatePath("/admin");
  revalidatePath("/admin/produits");
  revalidatePath("/admin/stocks");

  if (emailOrder) await sendStatusEmail(emailOrder, newStatus);
  for (const check of lowStockChecks) {
    await maybeSendLowStockAlert(check.variantId, check.previousStock, check.newStock, check.threshold);
  }

  return { error: null };
}

/** RG-13 : la gérante enregistre chaque tentative de contact (compteur et date). */
export async function recordContactAttempt(orderId: string): Promise<void> {
  const session = await requireRole("OWNER");

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { contactAttempts: { increment: 1 }, lastContactAt: new Date() },
    }),
    prisma.orderEvent.create({
      data: { orderId, type: "CONTACT_ATTEMPT", userId: session.user.id },
    }),
  ]);

  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/commandes");
}

/** RG-16 : la gérante marque le paiement encaissé (ou non) et peut noter les modalités. */
export async function updatePaymentStatus(orderId: string, formData: FormData): Promise<void> {
  const session = await requireRole("OWNER");
  const collected = formData.get("collected") === "on";
  const paymentNote = String(formData.get("paymentNote") ?? "").trim() || null;

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: collected ? "COLLECTED" : "TO_COLLECT", paymentNote },
  });
  await prisma.orderEvent.create({
    data: { orderId, type: "NOTE", note: `Paiement : ${collected ? "encaissé" : "à percevoir"}`, userId: session.user.id },
  });

  revalidatePath(`/admin/commandes/${orderId}`);
}

/** F18 : note interne, jamais visible du client (contrairement à `customerNote`). */
export async function updateInternalNote(orderId: string, formData: FormData): Promise<void> {
  await requireRole("OWNER");
  const internalNote = String(formData.get("internalNote") ?? "").trim() || null;

  await prisma.order.update({ where: { id: orderId }, data: { internalNote } });
  revalidatePath(`/admin/commandes/${orderId}`);
}
