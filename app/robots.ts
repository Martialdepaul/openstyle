import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

/** F11 : autorise l'indexation de la vitrine, bloque l'admin et les pages privées (panier/commande/compte). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/fr/panier",
        "/en/cart",
        "/fr/commande",
        "/en/checkout",
        "/fr/compte",
        "/en/account",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
