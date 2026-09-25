"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

/**
 * F17 : modification du stock directement dans la ligne. Chaque changement
 * crée un StockMovement (raison MANUAL) et met à jour Product.inStock
 * (RG-26, dénormalisé). Le stock ne peut jamais être négatif.
 */
export async function updateVariantStock(variantId: string, newStock: number) {
  const session = await requireRole("OWNER", "MANAGER");

  if (!Number.isInteger(newStock) || newStock < 0) {
    throw new Error("Le stock doit être un entier positif ou nul.");
  }

  await prisma.$transaction(async (tx) => {
    const variant = await tx.variant.findUniqueOrThrow({ where: { id: variantId } });
    const delta = newStock - variant.stock;
    if (delta === 0) return;

    await tx.variant.update({ where: { id: variantId }, data: { stock: newStock } });
    await tx.stockMovement.create({
      data: {
        variantId,
        delta,
        reason: "MANUAL",
        userId: session.user.id,
      },
    });

    const productVariants = await tx.variant.findMany({
      where: { productId: variant.productId, isActive: true },
      select: { stock: true },
    });
    const inStock = productVariants.some((v) => v.stock > 0);
    await tx.product.update({ where: { id: variant.productId }, data: { inStock } });
  });

  revalidatePath("/admin/stocks");
  revalidatePath("/admin");
  revalidatePath("/admin/produits");
}
