"use client";

import { useTransition } from "react";
import { deleteBanner, moveBanner, toggleBannerActive } from "@/lib/actions/banner";

export default function BannerQuickActions({
  id,
  isActive,
  canMoveUp,
  canMoveDown,
}: {
  id: string;
  isActive: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 text-xs">
      <button disabled={isPending || !canMoveUp} onClick={() => startTransition(() => moveBanner(id, "up"))} className="text-os-muted hover:text-os-black disabled:opacity-30" aria-label="Monter">
        ↑
      </button>
      <button disabled={isPending || !canMoveDown} onClick={() => startTransition(() => moveBanner(id, "down"))} className="text-os-muted hover:text-os-black disabled:opacity-30" aria-label="Descendre">
        ↓
      </button>
      <button disabled={isPending} onClick={() => startTransition(() => toggleBannerActive(id))} className="text-os-muted hover:text-os-black disabled:opacity-50">
        {isActive ? "Désactiver" : "Activer"}
      </button>
      <button disabled={isPending} onClick={() => startTransition(() => deleteBanner(id))} className="text-os-muted hover:text-red-700 disabled:opacity-50">
        Supprimer
      </button>
    </div>
  );
}
