import { prisma } from "@/lib/db";

/**
 * RG-14 : numéro de commande OS-000123, tiré de la séquence Postgres
 * `order_number_seq` (migration `add_order_number_sequence`) — atomique
 * sous accès concurrent, contrairement à un simple comptage de lignes.
 */
export async function generateOrderNumber(): Promise<string> {
  const rows = await prisma.$queryRaw<Array<{ nextval: bigint | string }>>`SELECT nextval('order_number_seq')`;
  return `OS-${String(rows[0].nextval).padStart(6, "0")}`;
}
