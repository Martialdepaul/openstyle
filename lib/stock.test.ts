import { describe, expect, it } from "vitest";
import { computeProductInStock, findStockShortages } from "@/lib/stock";

describe("findStockShortages (RG-10)", () => {
  it("signale une ligne dont la quantité demandée dépasse le stock", () => {
    const shortages = findStockShortages([{ quantity: 5, stock: 2 }]);
    expect(shortages).toHaveLength(1);
  });

  it("n'est pas en rupture quand la quantité demandée est exactement égale au stock", () => {
    expect(findStockShortages([{ quantity: 5, stock: 5 }])).toHaveLength(0);
  });

  it("n'est pas en rupture quand le stock est supérieur à la quantité demandée", () => {
    expect(findStockShortages([{ quantity: 2, stock: 5 }])).toHaveLength(0);
  });

  it("ne remonte que les lignes réellement en rupture parmi plusieurs", () => {
    const items = [
      { quantity: 1, stock: 0 },
      { quantity: 2, stock: 10 },
      { quantity: 3, stock: 3 },
      { quantity: 4, stock: 1 },
    ];
    const shortages = findStockShortages(items);
    expect(shortages).toEqual([items[0], items[3]]);
  });

  it("conserve les autres champs de la ligne (garde le lien produit/variante utile aux messages d'erreur)", () => {
    const items = [{ quantity: 5, stock: 1, name: "Robe midi" }];
    expect(findStockShortages(items)).toEqual([{ quantity: 5, stock: 1, name: "Robe midi" }]);
  });
});

describe("computeProductInStock (RG-26)", () => {
  it("est en stock si au moins une variante a un stock positif", () => {
    expect(computeProductInStock([0, 0, 3])).toBe(true);
  });

  it("n'est pas en stock si toutes les variantes sont à zéro", () => {
    expect(computeProductInStock([0, 0, 0])).toBe(false);
  });

  it("n'est pas en stock si aucune variante active n'existe", () => {
    expect(computeProductInStock([])).toBe(false);
  });
});
