"use client";

import { useTransition } from "react";
import { recordContactAttempt } from "@/lib/actions/order-status";

/** RG-13 : enregistre une tentative de contact (compteur et date). */
export default function ContactAttemptButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => recordContactAttempt(orderId))}
      className="border border-os-gray px-4 py-2 text-xs uppercase tracking-wide hover:border-os-black disabled:opacity-50"
    >
      Enregistrer une tentative de contact
    </button>
  );
}
