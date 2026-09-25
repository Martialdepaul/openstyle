import { getShopSettings } from "@/lib/shop-settings";
import type { TierThresholds } from "@/lib/pricing";

/** F22 : seuils réels, réglables par la gérante — voir docs/decisions.md. */
export async function getTierThresholds(): Promise<TierThresholds> {
  const settings = await getShopSettings();
  return { semiWholesale: settings.tierSemiWholesaleQty, wholesale: settings.tierWholesaleQty };
}
