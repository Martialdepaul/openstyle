"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** F14 : référence générée automatiquement si vide, format OS-P00001. */
async function generateReference() {
  const count = await prisma.product.count();
  return `OS-P${String(count + 1).padStart(5, "0")}`;
}

/** F14 : le slug est généré à partir du nom et reste unique. */
async function generateUniqueSlug(base: string) {
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

export async function createProduct(formData: FormData) {
  await requireRole("OWNER", "MANAGER");

  const nameFr = String(formData.get("nameFr") ?? "").trim();
  if (!nameFr) throw new Error("Le nom est obligatoire.");

  const nameEn = String(formData.get("nameEn") ?? "").trim() || null;
  const descriptionFr = String(formData.get("descriptionFr") ?? "").trim();
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim() || null;
  const categoryId = String(formData.get("categoryId") ?? "");
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const priceRetail = Number(formData.get("priceRetail"));
  const pricePromoRaw = String(formData.get("pricePromo") ?? "").trim();
  const priceSemiRaw = String(formData.get("priceSemi") ?? "").trim();
  const priceWholesaleRaw = String(formData.get("priceWholesale") ?? "").trim();
  const isNew = formData.get("isNew") === "on";
  const isPopular = formData.get("isPopular") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const referenceRaw = String(formData.get("reference") ?? "").trim();

  if (!categoryId) throw new Error("La catégorie est obligatoire.");
  if (!Number.isInteger(priceRetail) || priceRetail <= 0) throw new Error("Prix de détail invalide (RG-01).");

  const reference = referenceRaw || (await generateReference());
  const slug = await generateUniqueSlug(nameFr);

  const sizes = formData.getAll("variantSize") as string[];
  const colors = formData.getAll("variantColor") as string[];
  const scents = formData.getAll("variantScent") as string[];
  const stocks = formData.getAll("variantStock") as string[];

  const variantRows = sizes
    .map((_, i) => ({
      size: sizes[i]?.trim() || null,
      color: colors[i]?.trim() || null,
      scent: scents[i]?.trim() || null,
      stock: Math.max(0, Math.trunc(Number(stocks[i]) || 0)),
    }))
    .filter((row) => row.size || row.color || row.scent || row.stock > 0);

  // RG-22 : un produit sans taille ni couleur a une seule variante « par défaut ».
  const finalVariants = variantRows.length > 0 ? variantRows : [{ size: null, color: null, scent: null, stock: 0 }];

  const product = await prisma.product.create({
    data: {
      nameFr,
      nameEn,
      descriptionFr,
      descriptionEn,
      categoryId,
      brand,
      priceRetail,
      pricePromo: pricePromoRaw ? Number(pricePromoRaw) : null,
      priceSemi: priceSemiRaw ? Number(priceSemiRaw) : null,
      priceWholesale: priceWholesaleRaw ? Number(priceWholesaleRaw) : null,
      isNew,
      isPopular,
      isFeatured,
      reference,
      slug,
      status: "DRAFT",
      inStock: finalVariants.some((v) => v.stock > 0),
      variants: {
        create: finalVariants.map((v, i) => ({
          sku: `${reference}-${i + 1}`,
          size: v.size,
          color: v.color,
          scent: v.scent,
          stock: v.stock,
        })),
      },
    },
  });

  revalidatePath("/admin/produits");
  redirect(`/admin/produits/${product.id}`);
}
