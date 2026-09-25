"use client";

import { useState, useTransition } from "react";
import { changeOrderStatus } from "@/lib/actions/order-status";
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
 * F18 : boutons de transition de statut (RG-09). CONFIRMED décompte le stock
 * (RG-10) et peut être refusé. `nextStatuses` vient du serveur
 * (`lib/orders.ts`, seule source des transitions autorisées) : ce composant
 * client ne peut pas importer ce module, qui charge Prisma.
 */
export default function OrderStatusActions({
  orderId,
  nextStatuses,
}: {
  orderId: string;
  nextStatuses: OrderStatus[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function apply(next: OrderStatus) {
    setError(null);
    startTransition(async () => {
      const result = await changeOrderStatus(orderId, next);
      if (result.error) setError(result.error);
    });
  }

  if (nextStatuses.length === 0) {
    return <p className="text-xs text-os-muted">Statut final, aucune transition possible.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((next) => (
          <button
            key={next}
            disabled={isPending}
            onClick={() => apply(next)}
            className={`border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition disabled:opacity-50 ${
              next === "CANCELLED" ? "border-red-700 text-red-700 hover:bg-red-700 hover:text-white" : "border-os-black hover:bg-os-black hover:text-white"
            }`}
          >
            {STATUS_LABELS[next]}
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
