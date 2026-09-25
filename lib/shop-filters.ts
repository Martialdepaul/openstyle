/**
 * Tri et pagination partagés par toutes les listes de la boutique (F03) :
 * /boutique, /boutique/[categorie], /promotions, /nouveautes, recherche.
 * Le filtrage WHERE se fait en base (lib/products.ts, Prisma) ; ce fichier
 * ne fait que trier et paginer le résultat déjà filtré — même esprit que
 * lib/pricing.ts, lib/delivery.ts, lib/orders.ts (section 3) : un seul
 * endroit pour cette logique.
 */

export const PAGE_SIZE = 24;
export const SORT_OPTIONS = ["nouveautes", "prix-asc", "prix-desc", "populaires"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export function isSortOption(value: string | undefined): value is SortOption {
  return !!value && (SORT_OPTIONS as readonly string[]).includes(value);
}

export type ShopSearchParams = {
  taille?: string;
  couleur?: string;
  disponibilite?: string;
  badge?: string;
  prix_min?: string;
  prix_max?: string;
  tri?: string;
  q?: string;
  nb?: string;
};

export type SortableProduct = {
  inStock: boolean;
  isNew: boolean;
  isPopular: boolean;
  priceRetail: number;
  pricePromo: number | null;
};

export function effectivePrice(product: { priceRetail: number; pricePromo: number | null }): number {
  return product.pricePromo ?? product.priceRetail;
}

/** RG-23 : un produit épuisé (toutes variantes à 0) s'affiche en fin de liste, quel que soit le tri. */
export function sortProducts<T extends SortableProduct>(products: T[], sort: string | undefined): T[] {
  const compare = (a: T, b: T) => {
    switch (sort) {
      case "prix-asc":
        return effectivePrice(a) - effectivePrice(b);
      case "prix-desc":
        return effectivePrice(b) - effectivePrice(a);
      case "populaires":
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      case "nouveautes":
      default:
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    }
  };

  const available = products.filter((p) => p.inStock).sort(compare);
  const soldOut = products.filter((p) => !p.inStock).sort(compare);
  return [...available, ...soldOut];
}

export function paginate<T>(items: T[], nb: string | undefined) {
  const shown = nb ? Number(nb) : PAGE_SIZE;
  const visibleCount = Number.isFinite(shown) && shown > 0 ? shown : PAGE_SIZE;

  return {
    total: items.length,
    items: items.slice(0, visibleCount),
    hasMore: items.length > visibleCount,
    nextCount: visibleCount + PAGE_SIZE,
  };
}
