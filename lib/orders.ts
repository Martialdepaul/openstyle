import { prisma } from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma/client";

/** RG-09 : transitions de statut autorisées. Toute autre transition est refusée côté serveur. */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["READY", "SHIPPED", "CANCELLED"],
  READY: ["DELIVERED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_STATUS_TRANSITIONS[from].includes(to);
}

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

/** F06 : téléphone camerounais — 9 chiffres commençant par 6 ou 2, préfixe +237 accepté. */
export function normalizeCameroonPhone(raw: string): string {
  return raw.replace(/[\s.-]/g, "").replace(/^\+?237/, "");
}

export function isValidCameroonPhone(raw: string): boolean {
  return /^[62]\d{8}$/.test(normalizeCameroonPhone(raw));
}
