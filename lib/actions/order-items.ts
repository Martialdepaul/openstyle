"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { effectiveTier, tierForQuantity, unitPrice } from "@/lib/pricing";
import { getTierThresholds } from "@/lib/tier-thresholds";
import { availableDeliveryMethods, deliveryFee } from "@/lib/delivery";
import { findZoneForCity } from "@/lib/delivery-zones";
import type { DeliveryMethod, Prisma } from "@/generated/prisma/client";

export type OrderItemsActionState = { error?: string };

/**
 * RG-11 : recalcule tier/prix des lignes/frais de livraison/totaux avec les
 * mêmes règles qu'à la création de la commande (lib/actions/order.ts) —
 * jamais un autre calcul. Appelée après chaque modification de lignes ou de
 * mode de livraison, dans la même transaction.
 */
async function recalculateOrderTotals(tx: Prisma.TransactionClient, orderId: string): Promise<void> {
  const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true, user: true } });

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isApprovedPro = order.user?.proStatus === "APPROVED";
  const tier = effectiveTier(tierForQuantity(totalQuantity, await getTierThresholds()), isApprovedPro);

  for (const item of order.items) {
    const product = await tx.product.findUniqueOrThrow({ where: { id: item.productId } });
    const price = unitPrice(product, tier);
    await tx.orderItem.update({ where: { id: item.id }, data: { unitPrice: price, lineTotal: price * item.quantity } });
  }

  const updatedItems = await tx.orderItem.findMany({ where: { orderId } });
  const subtotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const zone = order.deliveryMethod === "PICKUP" ? null : await findZoneForCity(order.city);
  const fee = deliveryFee(order.deliveryMethod, zone, tier);

  await tx.order.update({
    where: { id: orderId },
    data: { tier, subtotal, deliveryFee: fee, total: subtotal + fee, zoneId: zone?.id ?? null },
  });
}

function assertNew(status: string): void {
  if (status !== "NEW") {
    throw new Error("Cette commande n'est plus modifiable (RG-11 : uniquement tant qu'elle est Nouvelle).");
  }
}

/** RG-11 : modifier la quantité d'une ligne. */
export async function updateOrderLineQuantity(orderId: string, itemId: string, formData: FormData): Promise<OrderItemsActionState> {
  const session = await requireRole("OWNER");

  const quantity = Math.trunc(Number(formData.get("quantity")));
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { error: "La quantité doit être un entier d'au moins 1." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
      assertNew(order.status);

      const item = await tx.orderItem.findUniqueOrThrow({ where: { id: itemId } });
      await tx.orderItem.update({ where: { id: itemId }, data: { quantity } });
      await recalculateOrderTotals(tx, orderId);
      await tx.orderEvent.create({
        data: {
          orderId,
          type: "ITEMS_EDITED",
          note: `Quantité de « ${item.name} » modifiée : ${item.quantity} → ${quantity}`,
          userId: session.user.id,
        },
      });
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erreur inconnue." };
  }

  revalidatePath(`/admin/commandes/${orderId}`);
  return {};
}

/** RG-11 : retirer une ligne (une commande garde toujours au moins une ligne). */
export async function removeOrderLine(orderId: string, itemId: string): Promise<OrderItemsActionState> {
  const session = await requireRole("OWNER");

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
      assertNew(order.status);

      const remainingCount = await tx.orderItem.count({ where: { orderId } });
      if (remainingCount <= 1) {
        throw new Error("Impossible de retirer la dernière ligne d'une commande.");
      }

      const item = await tx.orderItem.findUniqueOrThrow({ where: { id: itemId } });
      await tx.orderItem.delete({ where: { id: itemId } });
      await recalculateOrderTotals(tx, orderId);
      await tx.orderEvent.create({
        data: { orderId, type: "ITEMS_EDITED", note: `Ligne retirée : « ${item.name} »`, userId: session.user.id },
      });
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erreur inconnue." };
  }

  revalidatePath(`/admin/commandes/${orderId}`);
  return {};
}

/** RG-11 : changer le mode de livraison. */
export async function updateOrderDeliveryMethod(orderId: string, formData: FormData): Promise<OrderItemsActionState> {
  const session = await requireRole("OWNER");

  const deliveryMethod = String(formData.get("deliveryMethod") ?? "") as DeliveryMethod;
  const relayPointId = String(formData.get("relayPointId") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
      assertNew(order.status);

      const validMethods = availableDeliveryMethods(order.city);
      if (!validMethods.includes(deliveryMethod)) {
        throw new Error("Ce mode de livraison n'est pas disponible pour la ville de cette commande.");
      }
      if (deliveryMethod === "RELAY" && !relayPointId) {
        throw new Error("Merci de choisir un point relais.");
      }
      if (deliveryMethod === "SHIPPING" && !address) {
        throw new Error("Merci de préciser une adresse pour l'expédition.");
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          deliveryMethod,
          relayPointId: deliveryMethod === "RELAY" ? relayPointId : null,
          address: deliveryMethod === "SHIPPING" ? address : null,
        },
      });
      await recalculateOrderTotals(tx, orderId);
      await tx.orderEvent.create({
        data: {
          orderId,
          type: "ITEMS_EDITED",
          note: `Mode de livraison modifié : ${order.deliveryMethod} → ${deliveryMethod}`,
          userId: session.user.id,
        },
      });
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erreur inconnue." };
  }

  revalidatePath(`/admin/commandes/${orderId}`);
  return {};
}
