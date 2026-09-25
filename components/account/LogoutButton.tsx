"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { logoutCustomer } from "@/lib/actions/customer-auth";

export default function LogoutButton({ label }: { label: string }) {
  const locale = useLocale() as "fr" | "en";
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => logoutCustomer(locale))}
      className="flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm text-red-600 transition hover:text-red-800 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
