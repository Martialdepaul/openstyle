import type { OrderStatus } from "@/generated/prisma/client";

/**
 * Règles pures (transitions de statut, validation de téléphone) — sans
 * dépendance à Prisma, pour rester testable en isolation
 * (`lib/orders.test.ts`). La génération du numéro de commande, qui a besoin
 * de la base, vit dans `lib/order-number.ts`.
 */

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

/** F06 : téléphone camerounais — 9 chiffres commençant par 6 ou 2, préfixe +237 accepté. */
export function normalizeCameroonPhone(raw: string): string {
  return raw.replace(/[\s.-]/g, "").replace(/^\+?237/, "");
}

export function isValidCameroonPhone(raw: string): boolean {
  return /^[62]\d{8}$/.test(normalizeCameroonPhone(raw));
}
