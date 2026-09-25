import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProductWithRelations } from "@/lib/products";
import { formatPriceFcfa } from "@/lib/currency";
import { localizedText } from "@/lib/i18n-helpers";

export default function ProductCard({
  product,
  categoryLabel,
}: {
  product: ProductWithRelations;
  categoryLabel: string;
}) {
  const locale = useLocale();
  const t = useTranslations("Product");
  const name = localizedText(locale, product.nameFr, product.nameEn);
  const isPromo = product.pricePromo != null;
  const image = product.images[0];

  return (
    <Link
      href={{ pathname: "/produit/[slug]", params: { slug: product.slug } }}
      className="group relative block bg-os-white"
    >
      <div className="img-zoom relative aspect-3/4 overflow-hidden bg-os-cream">
        {image && (
          <Image src={image.urlCard} alt={name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
        )}
        {isPromo ? (
          <span className="absolute left-3 top-3 bg-os-black px-2.5 py-1 text-xs font-semibold tracking-wider text-white">
            {t("saleBadge")}
          </span>
        ) : product.isNew ? (
          <span className="absolute left-3 top-3 border border-os-black bg-os-white px-2.5 py-1 text-xs font-semibold tracking-wider text-os-black">
            {t("newBadge")}
          </span>
        ) : null}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="text-sm font-semibold uppercase tracking-widest text-os-muted">{t("soldOut")}</span>
          </div>
        )}
      </div>
      <div className="pb-1 pt-3">
        <p className="mb-1 text-[10px] uppercase tracking-widest text-os-muted">{categoryLabel}</p>
        <p className="block text-sm font-medium leading-tight">{name}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPriceFcfa(product.pricePromo ?? product.priceRetail)}</span>
          {product.pricePromo && (
            <span className="text-xs text-os-muted line-through">{formatPriceFcfa(product.priceRetail)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
