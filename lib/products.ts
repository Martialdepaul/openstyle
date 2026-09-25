import { prisma } from "./db";
import type { Prisma } from "@/generated/prisma/client";
import { paginate, sortProducts, type ShopSearchParams } from "./shop-filters";

const productWithRelations = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
  category: true,
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productWithRelations }>;

export async function getCategories() {
  return prisma.category.findMany({ where: { isActive: true }, orderBy: { position: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getCategoryProductCount(categorySlug: string): Promise<number> {
  return prisma.product.count({ where: { status: "PUBLISHED", category: { slug: categorySlug } } });
}

function buildWhere(params: ShopSearchParams, categorySlug?: string): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { status: "PUBLISHED" };
  const and: Prisma.ProductWhereInput[] = [];

  if (categorySlug) where.category = { slug: categorySlug };
  if (params.taille) and.push({ variants: { some: { size: params.taille } } });
  if (params.couleur) and.push({ variants: { some: { color: params.couleur } } });
  if (params.disponibilite === "oui") where.inStock = true;
  if (params.badge === "nouveau") where.isNew = true;
  // RG-05 : un produit "en promo" est un produit dont le prix promo remplace le prix de détail.
  if (params.badge === "promo") where.pricePromo = { not: null };

  const min = params.prix_min ? Number(params.prix_min) : undefined;
  const max = params.prix_max ? Number(params.prix_max) : undefined;
  if (min !== undefined && !Number.isNaN(min)) {
    and.push({ OR: [{ pricePromo: { gte: min } }, { AND: [{ pricePromo: null }, { priceRetail: { gte: min } }] }] });
  }
  if (max !== undefined && !Number.isNaN(max)) {
    and.push({ OR: [{ pricePromo: { lte: max } }, { AND: [{ pricePromo: null }, { priceRetail: { lte: max } }] }] });
  }

  if (params.q) {
    const q = params.q.trim();
    if (q) {
      and.push({
        OR: [{ nameFr: { contains: q } }, { nameEn: { contains: q } }, { reference: { contains: q } }],
      });
    }
  }

  if (and.length > 0) where.AND = and;
  return where;
}

export async function getShopResults(params: ShopSearchParams, categorySlug?: string) {
  const where = buildWhere(params, categorySlug);

  const [products, scopedVariants] = await Promise.all([
    prisma.product.findMany({ where, include: productWithRelations }),
    prisma.variant.findMany({
      where: { product: categorySlug ? { status: "PUBLISHED", category: { slug: categorySlug } } : { status: "PUBLISHED" } },
      select: { size: true, color: true },
    }),
  ]);

  const sorted = sortProducts(products, params.tri);
  const { total, items, hasMore, nextCount } = paginate(sorted, params.nb);

  return {
    total,
    products: items,
    hasMore,
    nextCount,
    sizes: Array.from(new Set(scopedVariants.map((v) => v.size).filter((v): v is string => !!v))).sort(),
    colors: Array.from(new Set(scopedVariants.map((v) => v.color).filter((v): v is string => !!v))).sort(),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: productWithRelations,
  });
}

export async function getRelatedProducts(categorySlug: string, excludeSlug: string, take = 4) {
  return prisma.product.findMany({
    where: { status: "PUBLISHED", category: { slug: categorySlug }, slug: { not: excludeSlug } },
    include: productWithRelations,
    take,
  });
}

export async function getHomeData() {
  const [banners, categories, newProducts, popularProducts, promoProducts, testimonials] = await Promise.all([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
    getCategories(),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isNew: true },
      include: productWithRelations,
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isPopular: true },
      include: productWithRelations,
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", pricePromo: { not: null } },
      include: productWithRelations,
      take: 8,
    }),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
  ]);

  return { banners, categories, newProducts, popularProducts, promoProducts, testimonials };
}

export function effectivePrice(product: { priceRetail: number; pricePromo: number | null }): number {
  return product.pricePromo ?? product.priceRetail;
}
