import { prisma } from "@/lib/db";
import { getShopSettings } from "@/lib/shop-settings";
import { getSiteUrl } from "@/lib/site-url";
import { sendEmail } from "@/lib/email";
import LowStockEmail from "@/emails/LowStockEmail";

/**
 * RG-24, F24 (E8) : alerte à l'OWNER "un seul [envoi] par passage sous le
 * seuil" — comparer l'ancien et le nouveau stock au seuil, pas juste le
 * nouveau stock, pour ne pas réalerter à chaque mouvement tant qu'on reste
 * sous le seuil.
 */
export async function maybeSendLowStockAlert(variantId: string, previousStock: number, newStock: number, threshold: number): Promise<void> {
  if (!(previousStock >= threshold && newStock < threshold)) return;

  const variant = await prisma.variant.findUnique({ where: { id: variantId }, include: { product: true } });
  if (!variant) return;

  const settings = await getShopSettings();
  const variantLabel = [variant.size, variant.color, variant.scent].filter(Boolean).join(" · ");

  await sendEmail({
    to: settings.orderNotificationEmail,
    subject: `Stock bas — ${variant.product.nameFr}`,
    react: (
      <LowStockEmail productName={variant.product.nameFr} variantLabel={variantLabel} stock={newStock} threshold={threshold} siteUrl={getSiteUrl()} />
    ),
  });
}
