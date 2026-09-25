"use client";

import { useTransition } from "react";
import { deleteTestimonial, moveTestimonial, toggleTestimonialActive } from "@/lib/actions/testimonial";

export default function TestimonialQuickActions({
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
      <button disabled={isPending || !canMoveUp} onClick={() => startTransition(() => moveTestimonial(id, "up"))} className="text-os-muted hover:text-os-black disabled:opacity-30" aria-label="Monter">
        ↑
      </button>
      <button disabled={isPending || !canMoveDown} onClick={() => startTransition(() => moveTestimonial(id, "down"))} className="text-os-muted hover:text-os-black disabled:opacity-30" aria-label="Descendre">
        ↓
      </button>
      <button disabled={isPending} onClick={() => startTransition(() => toggleTestimonialActive(id))} className="text-os-muted hover:text-os-black disabled:opacity-50">
        {isActive ? "Désactiver" : "Activer"}
      </button>
      <button disabled={isPending} onClick={() => startTransition(() => deleteTestimonial(id))} className="text-os-muted hover:text-red-700 disabled:opacity-50">
        Supprimer
      </button>
    </div>
  );
}
