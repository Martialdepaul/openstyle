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

async function generateUniqueSlug(base: string) {
  const root = slugify(base) || "categorie";
  let slug = root;
  let suffix = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${root}-${suffix}`;
  }
  return slug;
}

function readCategoryFields(formData: FormData) {
  const nameFr = String(formData.get("nameFr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim() || null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const parentId = String(formData.get("parentId") ?? "").trim() || null;
  return { nameFr, nameEn, imageUrl, parentId };
}

/** F16 : deux niveaux maximum — une catégorie choisie comme parent ne doit pas déjà avoir de parent. */
async function assertValidParent(parentId: string | null, selfId?: string) {
  if (!parentId) return;
  if (parentId === selfId) throw new Error("Une catégorie ne peut pas être son propre parent.");
  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) throw new Error("Catégorie parente introuvable.");
  if (parent.parentId) throw new Error("Deux niveaux maximum : cette catégorie a déjà un parent.");
}

export async function createCategory(formData: FormData) {
  await requireRole("OWNER", "MANAGER");

  const { nameFr, nameEn, imageUrl, parentId } = readCategoryFields(formData);
  if (!nameFr) throw new Error("Le nom est obligatoire.");
  await assertValidParent(parentId);

  const slug = await generateUniqueSlug(nameFr);
  const maxPosition = await prisma.category.aggregate({ where: { parentId }, _max: { position: true } });

  await prisma.category.create({
    data: {
      nameFr,
      nameEn,
      slug,
      imageUrl,
      parentId,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  await requireRole("OWNER", "MANAGER");

  const { nameFr, nameEn, imageUrl, parentId } = readCategoryFields(formData);
  if (!nameFr) throw new Error("Le nom est obligatoire.");
  await assertValidParent(parentId, categoryId);

  await prisma.category.update({
    where: { id: categoryId },
    data: { nameFr, nameEn, imageUrl, parentId },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function toggleCategoryActive(categoryId: string): Promise<void> {
  await requireRole("OWNER", "MANAGER");

  const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });
  await prisma.category.update({ where: { id: categoryId }, data: { isActive: !category.isActive } });

  revalidatePath("/admin/categories");
}

/** F16 : une catégorie qui contient des produits ne se supprime pas, elle se désactive. */
export async function deleteCategory(categoryId: string): Promise<{ error: string | null }> {
  await requireRole("OWNER", "MANAGER");

  const [productCount, childCount] = await Promise.all([
    prisma.product.count({ where: { categoryId } }),
    prisma.category.count({ where: { parentId: categoryId } }),
  ]);
  if (productCount > 0) {
    return { error: "Cette catégorie contient des produits : désactivez-la plutôt que de la supprimer." };
  }
  if (childCount > 0) {
    return { error: "Cette catégorie a des sous-catégories : supprimez-les d'abord." };
  }

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  return { error: null };
}

/** F16 : réordonnancement — échange la position avec la catégorie voisine du même niveau. */
export async function moveCategory(categoryId: string, direction: "up" | "down"): Promise<void> {
  await requireRole("OWNER", "MANAGER");

  const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });
  const siblings = await prisma.category.findMany({
    where: { parentId: category.parentId },
    orderBy: { position: "asc" },
  });
  const index = siblings.findIndex((s) => s.id === categoryId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;

  const neighbor = siblings[swapIndex];
  await prisma.$transaction([
    prisma.category.update({ where: { id: category.id }, data: { position: neighbor.position } }),
    prisma.category.update({ where: { id: neighbor.id }, data: { position: category.position } }),
  ]);

  revalidatePath("/admin/categories");
}
