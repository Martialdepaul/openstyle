import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RevealObserver from "@/components/RevealObserver";
import ProductCard from "@/components/ProductCard";
import { Link } from "@/i18n/navigation";
import { localizedText } from "@/lib/i18n-helpers";
import { getCategoryProductCount, getHomeData } from "@/lib/products";

/** F11 : la page d'accueil garde le titre par défaut (OPENSTYLE) et fixe sa description + ses variantes de langue. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: { absolute: "OPENSTYLE" },
    description: t("heroSubtitle"),
    alternates: { canonical: `/${locale}`, languages: { fr: "/fr", en: "/en" } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const { banners, categories, newProducts, popularProducts, promoProducts, testimonials } = await getHomeData();
  const banner = banners[0];
  const categoryCounts = await Promise.all(categories.map((c) => getCategoryProductCount(c.slug)));

  const categoryLabel = (slug: string) => {
    const category = categories.find((c) => c.slug === slug);
    return category ? localizedText(locale, category.nameFr, category.nameEn) : slug;
  };

  return (
    <div className="page-enter">
      <RevealObserver />

      {/* Bannière (F02) */}
      {banner && (
        <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-os-cream">
          <div className="hero-img absolute inset-0">
            <Image src={banner.imageUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8">
            <div className="max-w-xl">
              <p className="hero-label mb-5 text-xs uppercase tracking-[0.35em] text-os-muted">{t("heroKicker")}</p>
              <h1 className="hero-title mb-5 font-serif text-5xl font-bold leading-tight text-os-black lg:text-7xl">
                {t("heroTitleLine1")}
                <br />
                <em className="font-normal">{t("heroTitleLine2")}</em>
              </h1>
              <p className="hero-sub mb-8 max-w-md text-base leading-relaxed text-os-muted">{t("heroSubtitle")}</p>
              <div className="hero-cta flex flex-wrap gap-3">
                <Link
                  href="/boutique"
                  className="btn-press bg-os-black px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-os-black2"
                >
                  {t("heroCtaShop")}
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-cta absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-os-muted">{t("scrollHint")}</span>
            <div className="h-8 w-px animate-bounce bg-os-muted" />
          </div>
        </section>
      )}

      {/* Catégories (F02) */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="reveal mb-8">
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-os-muted">{t("categoriesKicker")}</p>
            <h2 className="font-serif text-3xl font-bold lg:text-4xl">{t("categoriesTitle")}</h2>
          </div>
          <div className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={{ pathname: "/boutique/[categorie]", params: { categorie: category.slug } }}
                className="reveal group relative aspect-3/4 overflow-hidden bg-os-cream"
              >
                {category.imageUrl && (
                  <Image
                    src={category.imageUrl}
                    alt={localizedText(locale, category.nameFr, category.nameEn)}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-serif text-xl font-semibold">
                    {localizedText(locale, category.nameFr, category.nameEn)}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/70">{t("productsCount", { count: categoryCounts[index] })}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Nouveautés (F02) */}
      {newProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div className="reveal">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-os-muted">{t("newArrivalsKicker")}</p>
              <h2 className="font-serif text-3xl font-bold lg:text-4xl">{t("newArrivalsTitle")}</h2>
            </div>
          </div>
          <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {newProducts.map((product) => (
              <div key={product.slug} className="reveal">
                <ProductCard product={product} categoryLabel={categoryLabel(product.category.slug)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Les plus demandés (F02) */}
      {popularProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div className="reveal">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-os-muted">{t("popularKicker")}</p>
              <h2 className="font-serif text-3xl font-bold lg:text-4xl">{t("popularTitle")}</h2>
            </div>
          </div>
          <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {popularProducts.map((product) => (
              <div key={product.slug} className="reveal">
                <ProductCard product={product} categoryLabel={categoryLabel(product.category.slug)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotions (F02) */}
      {promoProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div className="reveal">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-os-muted">{t("promotionsKicker")}</p>
              <h2 className="font-serif text-3xl font-bold lg:text-4xl">{t("promotionsTitle")}</h2>
            </div>
          </div>
          <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {promoProducts.map((product) => (
              <div key={product.slug} className="reveal">
                <ProductCard product={product} categoryLabel={categoryLabel(product.category.slug)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Témoignages (F02, alimentés par Testimonial) */}
      {testimonials.length > 0 && (
        <section className="bg-os-black px-4 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="reveal mb-10 text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">{t("testimonialsKicker")}</p>
              <h2 className="font-serif text-3xl font-bold">{t("testimonialsTitle")}</h2>
            </div>
            <div className="stagger grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="reveal border border-white/10 p-7 transition-colors duration-300 hover:border-white/30"
                >
                  <p className="mb-5 text-sm italic leading-relaxed text-white/75">
                    &ldquo;{localizedText(locale, testimonial.textFr, testimonial.textEn)}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.author}</p>
                    {testimonial.city && <p className="text-xs text-white/40">{testimonial.city}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bandeau de réassurance (F02 : qualité, échange, contact WhatsApp) */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="reveal grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {[t("reassuranceQuality"), t("reassuranceExchange"), t("reassuranceContact")].map((label) => (
            <div key={label} className="border border-os-gray p-6">
              <p className="text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
