import type { ShopSearchParams } from "./shop-filters";

export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Next.js donne parfois un tableau pour un paramètre répété ; on ne garde que la première valeur. */
export function toShopSearchParams(raw: RawSearchParams): ShopSearchParams {
  const get = (key: string): string | undefined => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    taille: get("taille"),
    couleur: get("couleur"),
    disponibilite: get("disponibilite"),
    badge: get("badge"),
    prix_min: get("prix_min"),
    prix_max: get("prix_max"),
    tri: get("tri"),
    q: get("q"),
    nb: get("nb"),
  };
}
