"use client";

import { useState, useTransition } from "react";
import { updateOrderDeliveryMethod } from "@/lib/actions/order-items";
import type { DeliveryMethod } from "@/generated/prisma/client";

const LABELS: Record<DeliveryMethod, string> = { PICKUP: "Retrait en boutique", RELAY: "Point relais", SHIPPING: "Expédition" };

/** RG-11 : changer le mode de livraison tant que la commande est NEW. */
export default function OrderDeliveryMethodEditor({
  orderId,
  currentMethod,
  availableMethods,
  relayPoints,
  currentRelayPointId,
  currentAddress,
}: {
  orderId: string;
  currentMethod: DeliveryMethod;
  availableMethods: DeliveryMethod[];
  relayPoints: Array<{ id: string; name: string; city: string }>;
  currentRelayPointId: string | null;
  currentAddress: string | null;
}) {
  const [method, setMethod] = useState<DeliveryMethod>(currentMethod);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderDeliveryMethod(orderId, formData);
      if (result.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="mt-3 flex flex-col gap-3 border-t border-os-cream pt-3">
      <select
        name="deliveryMethod"
        value={method}
        onChange={(event) => setMethod(event.target.value as DeliveryMethod)}
        disabled={isPending}
        className="w-full border border-os-gray px-3 py-2 text-xs focus:border-os-black focus:outline-none"
      >
        {availableMethods.map((value) => (
          <option key={value} value={value}>
            {LABELS[value]}
          </option>
        ))}
      </select>

      {method === "RELAY" && (
        <select
          name="relayPointId"
          defaultValue={currentRelayPointId ?? ""}
          disabled={isPending}
          className="w-full border border-os-gray px-3 py-2 text-xs focus:border-os-black focus:outline-none"
        >
          <option value="">Choisir un point relais…</option>
          {relayPoints.map((point) => (
            <option key={point.id} value={point.id}>
              {point.name} — {point.city}
            </option>
          ))}
        </select>
      )}

      {method === "SHIPPING" && (
        <input
          name="address"
          defaultValue={currentAddress ?? ""}
          placeholder="Adresse d'expédition"
          disabled={isPending}
          className="w-full border border-os-gray px-3 py-2 text-xs focus:border-os-black focus:outline-none"
        />
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit border border-os-black px-4 py-2 text-xs uppercase tracking-wide transition hover:bg-os-black hover:text-white disabled:opacity-50"
      >
        Enregistrer
      </button>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </form>
  );
}
