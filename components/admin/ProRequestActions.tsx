"use client";

import { useTransition } from "react";
import { approveProRequest, rejectProRequest, revertToRetail } from "@/lib/actions/customer-admin";
import type { ProStatus } from "@/generated/prisma/client";

export default function ProRequestActions({ userId, proStatus }: { userId: string; proStatus: ProStatus }) {
  const [isPending, startTransition] = useTransition();

  if (proStatus === "PENDING") {
    return (
      <div className="flex gap-2">
        <button
          disabled={isPending}
          onClick={() => startTransition(() => approveProRequest(userId))}
          className="border border-os-black px-4 py-2 text-xs uppercase tracking-wide transition hover:bg-os-black hover:text-white disabled:opacity-50"
        >
          Valider
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => rejectProRequest(userId))}
          className="border border-red-700 px-4 py-2 text-xs uppercase tracking-wide text-red-700 transition hover:bg-red-700 hover:text-white disabled:opacity-50"
        >
          Refuser
        </button>
      </div>
    );
  }

  if (proStatus === "APPROVED") {
    return (
      <button
        disabled={isPending}
        onClick={() => startTransition(() => revertToRetail(userId))}
        className="border border-os-gray px-4 py-2 text-xs uppercase tracking-wide transition hover:border-os-black disabled:opacity-50"
      >
        Repasser en client détail
      </button>
    );
  }

  return null;
}
