"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SORT_OPTIONS } from "@/lib/shop-filters";
import type { ShopRouteTarget } from "@/lib/shop-route";

export default function SortSelect({ route }: { route: ShopRouteTarget }) {
  const t = useTranslations("Shop");
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("tri") ?? "";

  const labels: Record<(typeof SORT_OPTIONS)[number], string> = {
    nouveautes: t("sortRelevance"),
    "prix-asc": t("sortPriceAsc"),
    "prix-desc": t("sortPriceDesc"),
    populaires: t("sortPopular"),
  };

  function handleChange(value: string) {
    const query = Object.fromEntries(searchParams.entries());
    if (value) query.tri = value;
    else delete query.tri;
    delete query.nb;
    if ("params" in route) {
      router.replace({ pathname: route.pathname, params: route.params, query });
    } else {
      router.replace({ pathname: route.pathname, query });
    }
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      aria-label={t("sortLabel")}
      className="border border-os-gray bg-white px-3 py-2 text-xs focus:border-os-black focus:outline-none"
    >
      <option value="">{t("sortRelevance")}</option>
      {SORT_OPTIONS.filter((option) => option !== "nouveautes").map((option) => (
        <option key={option} value={option}>
          {labels[option]}
        </option>
      ))}
    </select>
  );
}
