import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ShopFilterPanel from "@/components/shop/ShopFilterPanel";
import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";
import SortSelect from "@/components/shop/SortSelect";
import ProductGrid from "@/components/shop/ProductGrid";
import { getCategories, getShopResults } from "@/lib/products";
import { localizedText } from "@/lib/i18n-helpers";
import type { ShopRouteTarget } from "@/lib/shop-route";
import { toShopSearchParams, type RawSearchParams } from "@/lib/shop-search-params";

const route: ShopRouteTarget = { pathname: "/boutique" };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  // F03 : canonical sans le paramètre de tri, pour ne pas indexer de doublons.
  const canonical = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "tri" || value === undefined) continue;
    canonical.set(key, Array.isArray(value) ? value[0] : value);
  }
  const qs = canonical.toString();
  return { alternates: { canonical: qs ? `/boutique?${qs}` : "/boutique" } };
}

export default async function BoutiquePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Shop");
  const shopParams = toShopSearchParams(await searchParams);

  const [{ products, total, hasMore, nextCount, sizes, colors }, categories] = await Promise.all([
    getShopResults(shopParams),
    getCategories(),
  ]);

  const categoryLabel = (slug: string) => {
    const category = categories.find((c) => c.slug === slug);
    return category ? localizedText(locale, category.nameFr, category.nameEn) : slug;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">
          {shopParams.q ? t("searchTitle", { query: shopParams.q }) : t("title")}
        </h1>
        {!shopParams.q && <p className="mt-2 text-sm text-os-muted">{t("subtitle")}</p>}
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <div className="sticky top-28">
            <ShopFilterPanel route={route} categories={categories} sizes={sizes} colors={colors} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <MobileFilterDrawer
              route={route}
              categories={categories}
              sizes={sizes}
              colors={colors}
              resultCount={total}
            />
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-os-muted">{t("resultsCount", { count: total })}</span>
              <SortSelect route={route} />
            </div>
          </div>
          <ProductGrid
            products={products}
            categories={categories}
            categoryLabel={categoryLabel}
            hasMore={hasMore}
            nextCount={nextCount}
            route={route}
          />
        </div>
      </div>
    </div>
  );
}
