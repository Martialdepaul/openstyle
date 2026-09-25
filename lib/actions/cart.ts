"use server";

import { prisma } from "@/lib/db";
import type { CartLine } from "@/lib/cart-store";

export type ResolvedCartLine = {
  line: CartLine;
  product: {
    slug: string;
    nameFr: string;
    nameEn: string | null;
    imageUrl: string | null;
  } | null;
  price: number | null;
  available: boolean;
};

/**
 * F05 : le panier ne stocke que productSlug + options + quantité. Le prix et
 * la disponibilité affichés viennent toujours d'une relecture serveur ici
 * (jamais d'une valeur mise en cache côté client), pour que le total soit
 * identique à celui recalculé au moment de la commande.
 */
export async function resolveCartLines(lines: CartLine[]): Promise<ResolvedCartLine[]> {
  const slugs = Array.from(new Set(lines.map((l) => l.productSlug)));
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, status: "PUBLISHED" },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, variants: true },
  });

  return lines.map((line) => {
    const product = products.find((p) => p.slug === line.productSlug);
    if (!product) {
      return { line, product: null, price: null, available: false };
    }

    const variant = product.variants.find(
      (v) =>
        (v.size ?? undefined) === line.size &&
        (v.color ?? undefined) === line.color &&
        (v.scent ?? undefined) === line.scent,
    );

    return {
      line,
      product: {
        slug: product.slug,
        nameFr: product.nameFr,
        nameEn: product.nameEn,
        imageUrl: product.images[0]?.urlThumb ?? null,
      },
      price: product.pricePromo ?? product.priceRetail,
      available: !!variant && variant.stock > 0 && product.inStock,
    };
  });
}
