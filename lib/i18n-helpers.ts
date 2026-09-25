/**
 * RG-28 : les champs anglais des produits/catégories/pages/FAQ sont
 * facultatifs. Si vide, la version française s'affiche.
 */
export function localizedText(locale: string, textFr: string, textEn?: string | null): string {
  if (locale === "en" && textEn) return textEn;
  return textFr;
}
