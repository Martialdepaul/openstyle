"use client";

import { useState, useTransition } from "react";
import { removeOrderLine, updateOrderLineQuantity } from "@/lib/actions/order-items";

/** RG-11 : modifier la quantité ou retirer une ligne, tant que la commande est NEW. */
export default function OrderLineEditor({ orderId, itemId, quantity }: { orderId: string; itemId: string; quantity: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleQuantitySubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderLineQuantity(orderId, itemId, formData);
      if (result.error) setError(result.error);
    });
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      const result = await removeOrderLine(orderId, itemId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <form action={handleQuantitySubmit} className="flex items-center gap-2">
          <input
            type="number"
            name="quantity"
            min={1}
            defaultValue={quantity}
            disabled={isPending}
            className="w-16 border border-os-gray px-2 py-1 text-xs focus:border-os-black focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="border border-os-black px-2 py-1 text-xs uppercase tracking-wide transition hover:bg-os-black hover:text-white disabled:opacity-50"
          >
            Modifier
          </button>
        </form>
        <button disabled={isPending} onClick={handleRemove} className="text-xs text-os-muted transition hover:text-red-700 disabled:opacity-50">
          Retirer
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
