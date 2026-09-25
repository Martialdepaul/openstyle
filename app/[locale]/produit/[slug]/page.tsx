import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ProductCard from "@/components/ProductCard";
import ProductDetailInteractive from "@/components/product/ProductDetailInteractive";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import { localizedText } from "@/lib/i18n-helpers";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: localizedText(locale, product.nameFr, product.nameEn),
    description: localizedText(locale, product.descriptionFr, product.descriptionEn),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations("Product");
  const name = localizedText(locale, product.nameFr, product.nameEn);
  const description = localizedText(locale, product.descriptionFr, product.descriptionEn);
  const price = product.pricePromo ?? product.priceRetail;
  const isPromo = product.pricePromo != null;
  const categoryLabel = localizedText(locale, product.category.nameFr, product.category.nameEn);
  const image = product.images[0];

  const related = await getRelatedProducts(product.category.slug, product.slug, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: product.reference,
    image: image ? [image.urlFull] : [],
    offers: {
      "@type": "Offer",
      priceCurrency: "XAF",
      price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* eslint-disable-next-line react/no-danger -- données structurées Product (F04/section 11), contenu généré ici, pas d'entrée utilisateur */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-8 flex gap-2 text-xs text-os-muted">
        <Link href="/" className="hover:text-os-black">
          {t("breadcrumbHome")}
        </Link>
        <span>/</span>
        <Link href="/boutique" className="hover:text-os-black">
          {t("breadcrumbShop")}
        </Link>
        <span>/</span>
        <Link
          href={{ pathname: "/boutique/[categorie]", params: { categorie: product.category.slug } }}
          className="hover:text-os-black"
        >
          {categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-os-black">{name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-3/4 overflow-hidden bg-os-cream">
          {image && (
            <Image
              src={image.urlFull}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>

        <div>
          {isPromo ? (
            <span className="mb-4 inline-block bg-os-black px-2.5 py-1 text-xs font-semibold tracking-widest text-white">
              {t("saleBadge")}
            </span>
          ) : product.isNew ? (
            <span className="mb-4 inline-block border border-os-black px-2.5 py-1 text-xs font-semibold tracking-widest text-os-black">
              {t("newBadge")}
            </span>
          ) : null}

          <p className="mb-1 text-xs uppercase tracking-widest text-os-muted">{categoryLabel}</p>
          <h1 className="mb-2 font-serif text-3xl font-bold lg:text-4xl">{name}</h1>
          <p className="mb-4 text-xs text-os-muted">
            {t("referenceLabel")} {product.reference}
          </p>

          <div className="mb-5 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPriceFcfa(price)}</span>
            {product.pricePromo && (
              <span className="text-base text-os-muted line-through">{formatPriceFcfa(product.priceRetail)}</span>
            )}
          </div>

          {/* RG-06 : pas de montants de gros visibles pour un visiteur/client détail */}
          <p className="mb-5 text-xs text-os-muted">{t("wholesaleMention")}</p>

          {!product.inStock && (
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-os-muted">{t("soldOut")}</p>
          )}

          <p className="mb-6 text-sm leading-relaxed text-os-muted">{description}</p>

          <ProductDetailInteractive product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold">{t("relatedTitle")}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} categoryLabel={categoryLabel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
