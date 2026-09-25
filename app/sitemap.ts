import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site-url";
import { routing } from "@/i18n/routing";

// Rendu à la demande : sans ça, Next.js prérendrait ce plan au build et il
// ne refléterait plus les produits/catégories publiés depuis — même
// raisonnement que pour /boutique et /produit/[slug] (docs/decisions.md).
export const dynamic = "force-dynamic";

/** Chemins statiques déclarés dans i18n/routing.ts, sans paramètre dynamique. */
const STATIC_PATHS: Array<{ fr: string; en: string }> = [
  { fr: "", en: "" },
  { fr: "boutique", en: "shop" },
  { fr: "promotions", en: "promotions" },
  { fr: "nouveautes", en: "new-arrivals" },
  { fr: "a-propos", en: "about" },
  { fr: "contact", en: "contact" },
  { fr: "faq", en: "faq" },
  { fr: "livraison-retrait", en: "delivery" },
  { fr: "conditions-vente", en: "terms" },
  { fr: "confidentialite", en: "privacy" },
  { fr: "mentions-legales", en: "legal" },
];

/** F11 : plan du site, régénéré à chaque requête (catalogue produit changeant via l'admin). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const locales = routing.locales;

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
    locales.map((locale) => ({ url: `${siteUrl}/${locale}${path[locale] ? `/${path[locale]}` : ""}` })),
  );

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((category) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}/${locale === "fr" ? "boutique" : "shop"}/${category.slug}`,
    })),
  );

  const productEntries: MetadataRoute.Sitemap = products.flatMap((product) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}/${locale === "fr" ? "produit" : "product"}/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  );

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
