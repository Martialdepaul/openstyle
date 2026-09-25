"use client";

import { useTransition } from "react";
import { deleteFaqItem, moveFaqItem } from "@/lib/actions/faq";

export default function FaqQuickActions({ id, canMoveUp, canMoveDown }: { id: string; canMoveUp: boolean; canMoveDown: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 text-xs">
      <button disabled={isPending || !canMoveUp} onClick={() => startTransition(() => moveFaqItem(id, "up"))} className="text-os-muted hover:text-os-black disabled:opacity-30" aria-label="Monter">
        ↑
      </button>
      <button disabled={isPending || !canMoveDown} onClick={() => startTransition(() => moveFaqItem(id, "down"))} className="text-os-muted hover:text-os-black disabled:opacity-30" aria-label="Descendre">
        ↓
      </button>
      <button disabled={isPending} onClick={() => startTransition(() => deleteFaqItem(id))} className="text-os-muted hover:text-red-700 disabled:opacity-50">
        Supprimer
      </button>
    </div>
  );
}
