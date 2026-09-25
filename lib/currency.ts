/** Section 3 : montants entiers en FCFA, affichés avec un espace insécable. */
export function formatPriceFcfa(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}
