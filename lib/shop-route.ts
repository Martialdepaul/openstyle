/**
 * Les pages boutique partagent des contrôles clients (filtres, tri,
 * pagination) entre deux routes différentes : `/boutique` (statique) et
 * `/boutique/[categorie]` (dynamique). `usePathname()` de next-intl renvoie
 * le gabarit ("/boutique/[categorie]") et non l'URL résolue, donc un
 * `router.push` générique casserait le paramètre dynamique. Chaque page sert
 * explicitement sa cible de route à ces composants au lieu de la redériver.
 */
export type ShopRouteTarget =
  | { pathname: "/boutique" }
  | { pathname: "/boutique/[categorie]"; params: { categorie: string } }
  | { pathname: "/promotions" }
  | { pathname: "/nouveautes" };
