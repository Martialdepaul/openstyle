"use server";

import { availableDeliveryMethods, deliveryFee } from "@/lib/delivery";
import { findZoneForCity } from "@/lib/delivery-zones";
import { effectiveTier, tierForQuantity } from "@/lib/pricing";
import { getTierThresholds } from "@/lib/tier-thresholds";
import type { DeliveryMethod } from "@/generated/prisma/client";

export type DeliveryEstimate = { methods: DeliveryMethod[]; fee: number };

/**
 * F06 : estimation affichée avant validation (RG-18/19), via le même calcul
 * que la création de commande (lib/delivery.ts) — jamais dupliqué côté
 * client, qui ne peut pas importer Prisma directement.
 */
export async function estimateDelivery(city: string, method: DeliveryMethod, totalQuantity: number): Promise<DeliveryEstimate> {
  const methods = availableDeliveryMethods(city);
  if (!methods.includes(method)) return { methods, fee: 0 };

  const tier = effectiveTier(tierForQuantity(totalQuantity, await getTierThresholds()), false);
  const zone = method === "PICKUP" ? null : await findZoneForCity(city);
  return { methods, fee: deliveryFee(method, zone, tier) };
}
