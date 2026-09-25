/**
 * Calcul du décompte de stock (RG-10, RG-12, RG-26) — fonctions pures,
 * seul endroit qui décide si une ligne est en rupture ou si un produit est
 * "en stock". `lib/actions/order-status.ts`, `lib/actions/stock.ts` et
 * `lib/actions/product-create.ts` appellent ces fonctions plutôt que de
 * recalculer la règle chacun de leur côté.
 */

export type StockLine = { quantity: number; stock: number };

/** RG-10 : lignes où la quantité demandée dépasse le stock disponible — bloque la confirmation. */
export function findStockShortages<T extends StockLine>(items: T[]): T[] {
  return items.filter((item) => item.quantity > item.stock);
}

/** RG-26 : un produit est "en stock" si au moins une variante active a un stock strictement positif. */
export function computeProductInStock(variantStocks: number[]): boolean {
  return variantStocks.some((stock) => stock > 0);
}
