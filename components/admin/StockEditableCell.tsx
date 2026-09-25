"use client";

import { useState, useTransition } from "react";
import { updateVariantStock } from "@/lib/actions/stock";

export default function StockEditableCell({ variantId, initialStock }: { variantId: string; initialStock: number }) {
  const [value, setValue] = useState(String(initialStock));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleBlur() {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
      setError("Entier ≥ 0 requis");
      setValue(String(initialStock));
      return;
    }
    setError(null);
    if (parsed === initialStock) return;

    startTransition(async () => {
      try {
        await updateVariantStock(variantId, parsed);
      } catch {
        setError("Erreur, réessayez");
        setValue(String(initialStock));
      }
    });
  }

  return (
    <div>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        disabled={isPending}
        className="w-20 border border-os-gray px-2 py-1 text-sm focus:border-os-black focus:outline-none disabled:opacity-50"
      />
      {error && <p className="mt-1 text-[10px] text-red-700">{error}</p>}
    </div>
  );
}
