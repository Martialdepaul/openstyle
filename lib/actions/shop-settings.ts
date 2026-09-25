"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { setSetting } from "@/lib/settings";
import { getShopSettings, type ShopSettings } from "@/lib/shop-settings";

/** F22 : réservé à l'OWNER (section 4). */
export async function updateShopSettings(formData: FormData): Promise<void> {
  await requireRole("OWNER");

  const current = await getShopSettings();

  const shopName = String(formData.get("shopName") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const orderNotificationEmail = String(formData.get("orderNotificationEmail") ?? "").trim();
  const legalId = String(formData.get("legalId") ?? "").trim();
  const facebook = String(formData.get("facebook") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const tiktok = String(formData.get("tiktok") ?? "").trim();

  const tierSemiWholesaleQty = Math.trunc(Number(formData.get("tierSemiWholesaleQty")));
  const tierWholesaleQty = Math.trunc(Number(formData.get("tierWholesaleQty")));
  const defaultLowStockThreshold = Math.trunc(Number(formData.get("defaultLowStockThreshold")));

  if (!shopName || !whatsappNumber || !phoneNumber || !address || !hours || !email || !orderNotificationEmail) {
    throw new Error("Les coordonnées de la boutique sont obligatoires.");
  }
  if (!Number.isFinite(tierSemiWholesaleQty) || !Number.isFinite(tierWholesaleQty) || tierSemiWholesaleQty < 1 || tierWholesaleQty <= tierSemiWholesaleQty) {
    throw new Error("Le seuil semi-gros doit être positif et le seuil gros doit lui être strictement supérieur.");
  }
  if (!Number.isFinite(defaultLowStockThreshold) || defaultLowStockThreshold < 0) {
    throw new Error("Le seuil de stock bas doit être un nombre positif ou nul.");
  }

  const next: ShopSettings = {
    ...current,
    shopName,
    whatsappNumber,
    phoneNumber,
    address,
    hours,
    email,
    orderNotificationEmail,
    legalId,
    facebook,
    instagram,
    tiktok,
    tierSemiWholesaleQty,
    tierWholesaleQty,
    defaultLowStockThreshold,
  };

  await setSetting("shopSettings", next);

  // Ces réglages sont lus depuis Footer/WhatsAppButton (toutes les pages) et les pages de contenu.
  revalidatePath("/", "layout");
  revalidatePath("/admin/parametres");
}
