import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  pathnames: {
    "/": "/",
    "/boutique": {
      fr: "/boutique",
      en: "/shop",
    },
    "/boutique/[categorie]": {
      fr: "/boutique/[categorie]",
      en: "/shop/[categorie]",
    },
    "/produit/[slug]": {
      fr: "/produit/[slug]",
      en: "/product/[slug]",
    },
    "/promotions": "/promotions",
    "/nouveautes": {
      fr: "/nouveautes",
      en: "/new-arrivals",
    },
    "/panier": {
      fr: "/panier",
      en: "/cart",
    },
    "/commande": {
      fr: "/commande",
      en: "/checkout",
    },
    "/commande/confirmation/[numero]": {
      fr: "/commande/confirmation/[numero]",
      en: "/checkout/confirmation/[numero]",
    },
    "/suivi": {
      fr: "/suivi",
      en: "/tracking",
    },
    "/inscription": {
      fr: "/inscription",
      en: "/register",
    },
    "/connexion": {
      fr: "/connexion",
      en: "/login",
    },
    "/mot-de-passe-oublie": {
      fr: "/mot-de-passe-oublie",
      en: "/forgot-password",
    },
    "/reinitialiser-mot-de-passe/[token]": {
      fr: "/reinitialiser-mot-de-passe/[token]",
      en: "/reset-password/[token]",
    },
    "/compte": {
      fr: "/compte",
      en: "/account",
    },
    "/compte/commandes/[numero]": {
      fr: "/compte/commandes/[numero]",
      en: "/account/orders/[numero]",
    },
  },
});
