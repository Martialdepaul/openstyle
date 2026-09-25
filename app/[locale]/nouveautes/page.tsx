import { getTranslations, setRequestLocale } from "next-intl/server";
import ProductGrid from "@/components/shop/ProductGrid";
import { getCategories, getShopResults } from "@/lib/products";
import { localizedText } from "@/lib/i18n-helpers";
import type { ShopRouteTarget } from "@/lib/shop-route";
import { toShopSearchParams, type RawSearchParams } from "@/lib/shop-search-params";

const route: ShopRouteTarget = { pathname: "/nouveautes" };

export default async function NouveautesPage({
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

  // F03 : liste prédéfinie (badge nouveau), pas de filtres/tri.
  const [{ products, hasMore, nextCount }, categories] = await Promise.all([
    getShopResults({ ...shopParams, badge: "nouveau" }),
    getCategories(),
  ]);
  const categoryLabel = (slug: string) => {
    const c = categories.find((item) => item.slug === slug);
    return c ? localizedText(locale, c.nameFr, c.nameEn) : slug;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">{t("newArrivalsTitle")}</h1>
        <p className="mt-2 text-sm text-os-muted">{t("newArrivalsSubtitle")}</p>
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
  );
}
