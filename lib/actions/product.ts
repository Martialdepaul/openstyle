"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

/** F14 : un produit sans photo peut rester en brouillon mais ne peut pas être publié. */
export async function publishProduct(productId: string) {
  await requireRole("OWNER", "MANAGER");
  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId }, include: { images: true } });
  if (product.images.length === 0) {
    throw new Error("Un produit sans photo ne peut pas être publié.");
  }
  await prisma.product.update({
    where: { id: productId },
    data: { status: "PUBLISHED", publishedAt: product.publishedAt ?? new Date() },
  });
  revalidatePath("/admin/produits");
  revalidatePath("/boutique");
}

export async function unpublishToDraft(productId: string) {
  await requireRole("OWNER", "MANAGER");
  await prisma.product.update({ where: { id: productId }, data: { status: "DRAFT" } });
  revalidatePath("/admin/produits");
  revalidatePath("/boutique");
}

/** RG-30 : un produit référencé par une commande ne se supprime jamais, on l'archive. */
export async function archiveProduct(productId: string) {
  await requireRole("OWNER", "MANAGER");
  await prisma.product.update({ where: { id: productId }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/produits");
  revalidatePath("/boutique");
}
