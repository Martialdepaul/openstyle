"use client";

import { useState, useTransition } from "react";
import { deleteCategory, moveCategory, toggleCategoryActive } from "@/lib/actions/category";

export default function CategoryQuickActions({
  categoryId,
  isActive,
  canMoveUp,
  canMoveDown,
}: {
  categoryId: string;
  isActive: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <button
          disabled={isPending || !canMoveUp}
          onClick={() => startTransition(() => moveCategory(categoryId, "up"))}
          className="text-os-muted hover:text-os-black disabled:opacity-30"
          aria-label="Monter"
        >
          ↑
        </button>
        <button
          disabled={isPending || !canMoveDown}
          onClick={() => startTransition(() => moveCategory(categoryId, "down"))}
          className="text-os-muted hover:text-os-black disabled:opacity-30"
          aria-label="Descendre"
        >
          ↓
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => toggleCategoryActive(categoryId))}
          className="text-os-muted hover:text-os-black disabled:opacity-50"
        >
          {isActive ? "Désactiver" : "Activer"}
        </button>
        <button disabled={isPending} onClick={handleDelete} className="text-os-muted hover:text-red-700 disabled:opacity-50">
          Supprimer
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
