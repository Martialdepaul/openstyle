import { prisma } from "@/lib/db";
import type { DeliveryMethod, PriceTier } from "@/generated/prisma/client";

function isYaounde(city: string): boolean {
  const normalized = city.trim().toLowerCase();
  return normalized === "yaoundé" || normalized === "yaounde";
}

/** RG-18 : retrait gratuit partout, point relais réservé à Yaoundé, expédition pour les autres villes. */
export function availableDeliveryMethods(city: string): DeliveryMethod[] {
  return isYaounde(city) ? ["PICKUP", "RELAY"] : ["PICKUP", "SHIPPING"];
}

export type ZoneMatch = { id: string; feeRetail: number; feeWholesale: number } | null;

/** RG-19 : zone de la ville choisie, ou la dernière zone (« Autres villes ») en repli. */
export async function findZoneForCity(city: string): Promise<ZoneMatch> {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { position: "asc" } });
  if (zones.length === 0) return null;

  const normalized = city.trim().toLowerCase();
  const match = zones.find((zone) => zone.cities.map((c) => c.trim().toLowerCase()).includes(normalized));
  return match ?? zones[zones.length - 1];
}

/** RG-18, RG-19 : frais de livraison pour un mode et une zone donnés. Le retrait est toujours gratuit. */
export function deliveryFee(method: DeliveryMethod, zone: ZoneMatch, tier: PriceTier): number {
  if (method === "PICKUP" || !zone) return 0;
  return tier === "RETAIL" ? zone.feeRetail : zone.feeWholesale;
}
