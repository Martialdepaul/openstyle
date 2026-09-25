import { prisma } from "@/lib/db";
import type { ZoneMatch } from "@/lib/delivery";

/** RG-19 : zone de la ville choisie, ou la dernière zone (« Autres villes ») en repli. */
export async function findZoneForCity(city: string): Promise<ZoneMatch> {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { position: "asc" } });
  if (zones.length === 0) return null;

  const normalized = city.trim().toLowerCase();
  const match = zones.find((zone) => zone.cities.map((c) => c.trim().toLowerCase()).includes(normalized));
  return match ?? zones[zones.length - 1];
}
