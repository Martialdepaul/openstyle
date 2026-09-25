"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { ShopRouteTarget } from "@/lib/shop-route";

export default function LoadMoreButton({ route, nextCount }: { route: ShopRouteTarget; nextCount: number }) {
  const t = useTranslations("Shop");
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick() {
    const query = Object.fromEntries(searchParams.entries());
    query.nb = String(nextCount);
    if ("params" in route) {
      router.push({ pathname: route.pathname, params: route.params, query });
    } else {
      router.push({ pathname: route.pathname, query });
    }
  }

  return (
    <button
      onClick={handleClick}
      className="btn-press border border-os-black px-8 py-3 text-sm font-semibold uppercase tracking-widest transition hover:bg-os-black hover:text-white"
    >
      {t("loadMore")}
    </button>
  );
}
