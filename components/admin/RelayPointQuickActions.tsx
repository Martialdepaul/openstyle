"use client";

import { useTransition } from "react";
import { toggleRelayPointActive } from "@/lib/actions/delivery-admin";

export default function RelayPointQuickActions({ relayPointId, isActive }: { relayPointId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleRelayPointActive(relayPointId))}
      className="text-xs text-os-muted hover:text-os-black disabled:opacity-50"
    >
      {isActive ? "Désactiver" : "Activer"}
    </button>
  );
}
