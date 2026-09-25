import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ShopFilterPanel from "@/components/shop/ShopFilterPanel";
import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";
import SortSelect from "@/components/shop/SortSelect";
import ProductGrid from "@/components/shop/ProductGrid";
import { getCategories, getCategoryBySlug, getShopResults } from "@/lib/products";
import { localizedText } from "@/lib/i18n-helpers";
import type { ShopRouteTarget } from "@/lib/shop-route";
import { toShopSearchParams, type RawSearchParams } from "@/lib/shop-search-params";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ categorie: category.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; categorie: string }>;
  searchParams: Promise<RawSearchParams>;
}): Promise<Metadata> {
  const { locale, categorie } = await params;
  const category = await getCategoryBySlug(categorie);
  if (!category) return {};

  const raw = await searchParams;
  const canonical = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (key === "tri" || value === undefined) continue;
    canonical.set(key, Array.isArray(value) ? value[0] : value);
  }
  const qs = canonical.toString();
  const path = `/boutique/${categorie}`;

  return {
    title: localizedText(locale, category.nameFr, category.nameEn),
    alternates: { canonical: qs ? `${path}?${qs}` : path },
  };
}

export default async function BoutiqueCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; categorie: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { locale, categorie } = await params;
  setRequestLocale(locale);

  const category = await getCategoryBySlug(categorie);
  if (!category) notFound();

  const t = await getTranslations("Shop");
  const shopParams = toShopSearchParams(await searchParams);
  const route: ShopRouteTarget = { pathname: "/boutique/[categorie]", params: { categorie } };

  const [{ products, total, hasMore, nextCount, sizes, colors }, categories] = await Promise.all([
    getShopResults(shopParams, categorie),
    getCategories(),
  ]);

  const categoryLabel = (slug: string) => {
    const c = categories.find((item) => item.slug === slug);
    return c ? localizedText(locale, c.nameFr, c.nameEn) : slug;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">{localizedText(locale, category.nameFr, category.nameEn)}</h1>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          <div className="sticky top-28">
            <ShopFilterPanel route={route} categories={categories} currentCategorySlug={categorie} sizes={sizes} colors={colors} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <MobileFilterDrawer
              route={route}
              categories={categories}
              currentCategorySlug={categorie}
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
