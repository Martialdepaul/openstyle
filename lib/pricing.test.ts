import { describe, expect, it } from "vitest";
import { effectiveTier, tierForQuantity, unitPrice, TIER_THRESHOLDS, type TieredProduct } from "@/lib/pricing";

describe("tierForQuantity (RG-02)", () => {
  it("retourne RETAIL en dessous du seuil semi-gros", () => {
    expect(tierForQuantity(0)).toBe("RETAIL");
    expect(tierForQuantity(TIER_THRESHOLDS.semiWholesale - 1)).toBe("RETAIL");
  });

  it("retourne SEMI_WHOLESALE à partir du seuil semi-gros", () => {
    expect(tierForQuantity(TIER_THRESHOLDS.semiWholesale)).toBe("SEMI_WHOLESALE");
    expect(tierForQuantity(TIER_THRESHOLDS.wholesale - 1)).toBe("SEMI_WHOLESALE");
  });

  it("retourne WHOLESALE à partir du seuil gros", () => {
    expect(tierForQuantity(TIER_THRESHOLDS.wholesale)).toBe("WHOLESALE");
    expect(tierForQuantity(1000)).toBe("WHOLESALE");
  });

  it("utilise des seuils personnalisés (F22) au lieu des valeurs par défaut", () => {
    const thresholds = { semiWholesale: 5, wholesale: 8 };
    expect(tierForQuantity(4, thresholds)).toBe("RETAIL");
    expect(tierForQuantity(5, thresholds)).toBe("SEMI_WHOLESALE");
    expect(tierForQuantity(8, thresholds)).toBe("WHOLESALE");
  });
});

describe("effectiveTier (RG-03)", () => {
  it("garde toujours le prix de détail pour un compte non pro validé", () => {
    expect(effectiveTier("WHOLESALE", false)).toBe("RETAIL");
    expect(effectiveTier("SEMI_WHOLESALE", false)).toBe("RETAIL");
  });

  it("applique le palier du panier pour un compte pro validé", () => {
    expect(effectiveTier("WHOLESALE", true)).toBe("WHOLESALE");
    expect(effectiveTier("RETAIL", true)).toBe("RETAIL");
  });
});

describe("unitPrice (RG-01, RG-04, RG-05)", () => {
  const product: TieredProduct = { priceRetail: 10000, pricePromo: null, priceSemi: 8000, priceWholesale: 6000 };

  it("applique le prix de détail au palier RETAIL", () => {
    expect(unitPrice(product, "RETAIL")).toBe(10000);
  });

  it("applique le prix du palier atteint", () => {
    expect(unitPrice(product, "SEMI_WHOLESALE")).toBe(8000);
    expect(unitPrice(product, "WHOLESALE")).toBe(6000);
  });

  it("retombe sur le palier inférieur si le prix du palier atteint est absent (RG-04)", () => {
    const withoutWholesale: TieredProduct = { ...product, priceWholesale: null };
    expect(unitPrice(withoutWholesale, "WHOLESALE")).toBe(8000);

    const withoutAnyTier: TieredProduct = { ...product, priceSemi: null, priceWholesale: null };
    expect(unitPrice(withoutAnyTier, "WHOLESALE")).toBe(10000);
  });

  it("applique le prix le plus bas entre le palier et la promo (RG-05)", () => {
    const withPromo: TieredProduct = { ...product, pricePromo: 7000 };
    // Promo (7000) plus basse que le prix de détail (10000) : le client paie la promo.
    expect(unitPrice(withPromo, "RETAIL")).toBe(7000);
    // Palier semi-gros (8000) plus haut que la promo (7000) : le client paie quand même la promo.
    expect(unitPrice(withPromo, "SEMI_WHOLESALE")).toBe(7000);
    // Palier gros (6000) plus bas que la promo (7000) : le client paie le palier.
    expect(unitPrice(withPromo, "WHOLESALE")).toBe(6000);
  });
});
