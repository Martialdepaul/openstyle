import type { OrderStatus } from "@/generated/prisma/client";

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

/**
 * F18 : badges de statut en niveaux de gris, un seul accent réservé à
 * « À relancer » (RG-13). Jamais de couleurs vives par statut.
 */
export default function StatusBadge({ status, toFollowUp }: { status: OrderStatus; toFollowUp?: boolean }) {
  if (toFollowUp) {
    return (
      <span className="inline-block rounded-full bg-os-black px-2.5 py-0.5 text-xs font-medium text-white">
        À relancer
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full bg-os-gray px-2.5 py-0.5 text-xs font-medium text-os-black">
      {STATUS_LABELS[status]}
    </span>
  );
}
