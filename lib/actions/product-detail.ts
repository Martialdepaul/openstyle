"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function updateProductInfo(productId: string, formData: FormData) {
  await requireRole("OWNER", "MANAGER");

  const nameFr = String(formData.get("nameFr") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim() || null;
  const descriptionFr = String(formData.get("descriptionFr") ?? "").trim();
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim() || null;
  const priceRetail = Number(formData.get("priceRetail"));
  const pricePromoRaw = String(formData.get("pricePromo") ?? "").trim();
  const pricePromo = pricePromoRaw ? Number(pricePromoRaw) : null;

  if (!nameFr) throw new Error("Le nom est obligatoire.");
  if (!Number.isInteger(priceRetail) || priceRetail <= 0) throw new Error("Prix de détail invalide.");
  if (pricePromo !== null && (!Number.isInteger(pricePromo) || pricePromo <= 0)) {
    throw new Error("Prix promo invalide.");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { nameFr, nameEn, descriptionFr, descriptionEn, priceRetail, pricePromo },
  });

  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/admin/produits");
  revalidatePath("/boutique");
}
