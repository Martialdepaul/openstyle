import { requireRole } from "@/lib/admin-auth";
import { getShopSettings } from "@/lib/shop-settings";
import { getSetting } from "@/lib/settings";
import { updateShopSettings } from "@/lib/actions/shop-settings";
import { updateDeliveryDelayText } from "@/lib/actions/delivery-admin";
import PageHeader from "@/components/admin/PageHeader";

const inputClass = "w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-widest";

export default async function AdminSettingsPage() {
  await requireRole("OWNER");

  const [settings, deliveryDelayText] = await Promise.all([
    getShopSettings(),
    getSetting("deliveryDelayText", "2 jours"),
  ]);

  return (
    <div>
      <PageHeader title="Paramètres" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Paramètres" }]} />

      <div className="flex flex-col gap-6">
        <section className="max-w-2xl border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Coordonnées de la boutique</h2>
          <form action={updateShopSettings} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nom de la boutique</label>
              <input name="shopName" defaultValue={settings.shopName} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Numéro d'identification légal</label>
              <input name="legalId" defaultValue={settings.legalId} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Numéro WhatsApp (format international, sans +)</label>
              <input name="whatsappNumber" defaultValue={settings.whatsappNumber} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Téléphone affiché</label>
              <input name="phoneNumber" defaultValue={settings.phoneNumber} required className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Adresse</label>
              <input name="address" defaultValue={settings.address} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Horaires</label>
              <input name="hours" defaultValue={settings.hours} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>E-mail de contact (affiché)</label>
              <input name="email" type="email" defaultValue={settings.email} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>E-mail de notification des commandes</label>
              <input name="orderNotificationEmail" type="email" defaultValue={settings.orderNotificationEmail} required className={inputClass} />
              <p className="mt-1 text-xs text-os-muted">Reçoit un e-mail (E2) à chaque nouvelle commande.</p>
            </div>
            <div>
              <label className={labelClass}>Facebook (URL, facultatif)</label>
              <input name="facebook" defaultValue={settings.facebook} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram (URL, facultatif)</label>
              <input name="instagram" defaultValue={settings.instagram} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>TikTok (URL, facultatif)</label>
              <input name="tiktok" defaultValue={settings.tiktok} className={inputClass} />
            </div>

            <div className="sm:col-span-2 mt-2 border-t border-os-gray pt-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest">Paliers et stock</h3>
            </div>
            <div>
              <label className={labelClass}>Seuil semi-gros (pièces)</label>
              <input name="tierSemiWholesaleQty" type="number" min={1} defaultValue={settings.tierSemiWholesaleQty} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Seuil gros (pièces)</label>
              <input name="tierWholesaleQty" type="number" min={2} defaultValue={settings.tierWholesaleQty} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Seuil de stock bas par défaut</label>
              <input name="defaultLowStockThreshold" type="number" min={0} defaultValue={settings.defaultLowStockThreshold} required className={inputClass} />
              <p className="mt-1 text-xs text-os-muted">Appliqué aux nouvelles variantes ; réglable ensuite variante par variante (Stocks).</p>
            </div>

            <div className="sm:col-span-2">
              <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
                Enregistrer
              </button>
            </div>
          </form>
        </section>

        <section className="max-w-md border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Délai de livraison affiché</h2>
          <form action={updateDeliveryDelayText} className="flex items-end gap-3">
            <div className="flex-1">
              <label className={labelClass}>Texte (ex. « 2 jours »)</label>
              <input name="deliveryDelayText" defaultValue={deliveryDelayText} className={inputClass} />
            </div>
            <button type="submit" className="border border-os-black px-4 py-2 text-xs uppercase tracking-wide hover:bg-os-black hover:text-white">
              Enregistrer
            </button>
          </form>
          <p className="mt-2 text-xs text-os-muted">Affiché sur la page publique « Livraison et retrait ».</p>
        </section>
      </div>
    </div>
  );
}
