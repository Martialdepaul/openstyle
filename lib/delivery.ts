import type { DeliveryMethod, PriceTier } from "@/generated/prisma/client";

/**
 * Calcul pur des frais de livraison (RG-18, RG-19) — sans dépendance à
 * Prisma, pour rester testable en isolation (`lib/delivery.test.ts`). La
 * recherche de zone en base (`findZoneForCity`) vit dans
 * `lib/delivery-zones.ts`.
 */
function isYaounde(city: string): boolean {
  const normalized = city.trim().toLowerCase();
  return normalized === "yaoundé" || normalized === "yaounde";
}

/** RG-18 : retrait gratuit partout, point relais réservé à Yaoundé, expédition pour les autres villes. */
export function availableDeliveryMethods(city: string): DeliveryMethod[] {
  return isYaounde(city) ? ["PICKUP", "RELAY"] : ["PICKUP", "SHIPPING"];
}

export type ZoneMatch = { id: string; feeRetail: number; feeWholesale: number } | null;

/** RG-18, RG-19 : frais de livraison pour un mode et une zone donnés. Le retrait est toujours gratuit. */
export function deliveryFee(method: DeliveryMethod, zone: ZoneMatch, tier: PriceTier): number {
  if (method === "PICKUP" || !zone) return 0;
  return tier === "RETAIL" ? zone.feeRetail : zone.feeWholesale;
}
