"use client";

import { useTransition } from "react";
import { archiveProduct, publishProduct, unpublishToDraft } from "@/lib/actions/product";
import type { ProductStatus } from "@/generated/prisma/client";

export default function ProductQuickActions({ productId, status }: { productId: string; status: ProductStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {status !== "PUBLISHED" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => publishProduct(productId))}
          className="text-os-muted hover:text-os-black disabled:opacity-50"
        >
          Publier
        </button>
      )}
      {status === "PUBLISHED" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => unpublishToDraft(productId))}
          className="text-os-muted hover:text-os-black disabled:opacity-50"
        >
          Repasser en brouillon
        </button>
      )}
      {status !== "ARCHIVED" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => archiveProduct(productId))}
          className="text-os-muted hover:text-red-700 disabled:opacity-50"
        >
          Archiver
        </button>
      )}
    </div>
  );
}
