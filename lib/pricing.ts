import type { PriceTier } from "@/generated/prisma/client";

/** RG-02 : seuils par défaut. Deviendront des réglages `Setting` avec F22. */
export const TIER_THRESHOLDS = { semiWholesale: 10, wholesale: 20 } as const;

export type TieredProduct = {
  priceRetail: number;
  pricePromo: number | null;
  priceSemi: number | null;
  priceWholesale: number | null;
};

/** RG-02 : le palier dépend du nombre total de pièces du panier, tous produits confondus. */
export function tierForQuantity(totalQuantity: number): PriceTier {
  if (totalQuantity >= TIER_THRESHOLDS.wholesale) return "WHOLESALE";
  if (totalQuantity >= TIER_THRESHOLDS.semiWholesale) return "SEMI_WHOLESALE";
  return "RETAIL";
}

/** RG-03 : les paliers semi-gros et gros ne s'appliquent qu'aux comptes pro validés. */
export function effectiveTier(cartTier: PriceTier, isApprovedPro: boolean): PriceTier {
  return isApprovedPro ? cartTier : "RETAIL";
}

/**
 * RG-01, RG-04, RG-05 : prix unitaire effectif d'un produit pour un palier
 * donné. RG-04 : si le produit n'a pas de prix pour le palier atteint, on
 * retombe sur le palier inférieur. RG-05 : le prix promo remplace le prix de
 * détail ; le client paie le plus bas entre le prix du palier et le promo.
 */
export function unitPrice(product: TieredProduct, tier: PriceTier): number {
  let tiered: number;
  if (tier === "WHOLESALE") {
    tiered = product.priceWholesale ?? product.priceSemi ?? product.priceRetail;
  } else if (tier === "SEMI_WHOLESALE") {
    tiered = product.priceSemi ?? product.priceRetail;
  } else {
    tiered = product.priceRetail;
  }
  return product.pricePromo != null ? Math.min(tiered, product.pricePromo) : tiered;
}
