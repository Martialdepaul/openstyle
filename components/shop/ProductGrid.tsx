import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProductCard from "@/components/ProductCard";
import LoadMoreButton from "./LoadMoreButton";
import type { ProductWithRelations } from "@/lib/products";
import type { ShopRouteTarget } from "@/lib/shop-route";

export default function ProductGrid({
  products,
  categories,
  categoryLabel,
  hasMore,
  nextCount,
  route,
}: {
  products: ProductWithRelations[];
  categories: { slug: string }[];
  categoryLabel: (categorySlug: string) => string;
  hasMore: boolean;
  nextCount: number;
  route: ShopRouteTarget;
}) {
  const t = useTranslations("Shop");

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-2 text-lg font-medium">{t("emptyTitle")}</p>
        <p className="mb-8 text-sm text-os-muted">{t("emptySubtitle")}</p>
        <div className="mx-auto flex max-w-md flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={{ pathname: "/boutique/[categorie]", params: { categorie: category.slug } }}
              className="border border-os-gray px-4 py-2 text-xs uppercase tracking-wide transition hover:border-os-black"
            >
              {categoryLabel(category.slug)}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} categoryLabel={categoryLabel(product.category.slug)} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <LoadMoreButton route={route} nextCount={nextCount} />
        </div>
      )}
    </>
  );
}
