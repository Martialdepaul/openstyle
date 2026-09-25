import { cache } from "react";
import { getSetting } from "@/lib/settings";

export { whatsAppLink } from "@/lib/whatsapp";

/**
 * F22 : toute valeur de coordonnées/réglage utilisée sur la vitrine se lit
 * ici (réglage `Setting`, clé unique "shopSettings"), jamais codée en dur
 * dans un composant. Voir docs/decisions.md.
 */
export type ShopSettings = {
  shopName: string;
  whatsappNumber: string;
  phoneNumber: string;
  address: string;
  hours: string;
  email: string;
  legalId: string;
  orderNotificationEmail: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  /** RG-02 : quantité totale du panier à partir de laquelle chaque palier s'applique. */
  tierSemiWholesaleQty: number;
  tierWholesaleQty: number;
  /** RG-24 : seuil appliqué par défaut aux nouvelles variantes (réglable ensuite par variante). */
  defaultLowStockThreshold: number;
};

const DEFAULTS: ShopSettings = {
  shopName: "OPENSTYLE",
  whatsappNumber: "237656356687",
  phoneNumber: "+237656356687",
  address: "Yaoundé, Mokolo, Elobi — Centre commercial Dubaï Market",
  hours: "08h00 – 18h30",
  email: "Openstyle911@gmail.com",
  legalId: "",
  orderNotificationEmail: "Openstyle911@gmail.com",
  facebook: "",
  instagram: "",
  tiktok: "",
  tierSemiWholesaleQty: 10,
  tierWholesaleQty: 20,
  defaultLowStockThreshold: 3,
};

/** `cache()` évite de relire deux fois le même réglage dans une requête (Footer + WhatsAppButton par exemple). */
export const getShopSettings = cache(async (): Promise<ShopSettings> => {
  const saved = await getSetting<Partial<ShopSettings>>("shopSettings", {});
  return { ...DEFAULTS, ...saved };
});
