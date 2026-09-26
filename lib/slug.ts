import { prisma } from "@/lib/db";

/**
 * Partagé entre `lib/actions/product-create.ts` et `lib/actions/product-import.ts`
 * (F15) — un fichier séparé (pas un "use server") parce qu'un fichier
 * "use server" ne peut exporter que des fonctions async, or `slugify` est
 * synchrone.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** F14 : le slug est généré à partir du nom et reste unique. */
export async function generateUniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "produit";
  let slug = root;
  let suffix = 1;
  // Le jeu de produits reste petit : une boucle simple suffit, pas besoin de requête d'unicité optimisée.
  while (await prisma.product.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${root}-${suffix}`;
  }
  return slug;
}
