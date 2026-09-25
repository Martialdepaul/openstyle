import { prisma } from "@/lib/db";

/**
 * RG-14 : numéro de commande OS-000123. Devrait venir d'une vraie séquence
 * Postgres (atomique) ; ce compteur par comptage n'est pas à l'abri d'une
 * collision entre deux commandes créées au même instant — voir
 * docs/decisions.md.
 */
export async function generateOrderNumber(): Promise<string> {
  const count = await prisma.order.count();
  return `OS-${String(count + 1).padStart(6, "0")}`;
}
