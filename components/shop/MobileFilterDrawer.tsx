"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ShopFilterPanel from "./ShopFilterPanel";
import type { ShopRouteTarget } from "@/lib/shop-route";

export default function MobileFilterDrawer({
  route,
  categories,
  currentCategorySlug,
  sizes,
  colors,
  showBadgeFilter,
  resultCount,
}: {
  route: ShopRouteTarget;
  categories: { slug: string; nameFr: string; nameEn: string | null }[];
  currentCategorySlug?: string;
  sizes: string[];
  colors: string[];
  showBadgeFilter?: boolean;
  resultCount: number;
}) {
  const t = useTranslations("Shop");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border border-os-gray px-4 py-2 text-xs uppercase tracking-wide lg:hidden"
      >
        {t("filtersButton")}
      </button>

      {open && (
        <div className="fixed inset-0 z-200 flex lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
          <div className="flex h-full w-72 flex-col overflow-y-auto bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold">{t("filtersButton")}</h3>
              <button onClick={() => setOpen(false)} aria-label={t("closeFilters")} className="text-xl leading-none">
                ✕
              </button>
            </div>
            <ShopFilterPanel
              route={route}
              categories={categories}
              currentCategorySlug={currentCategorySlug}
              sizes={sizes}
              colors={colors}
              showBadgeFilter={showBadgeFilter}
            />
            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full bg-os-black py-3 text-sm font-semibold text-white"
            >
              {t("showResults", { count: resultCount })}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
