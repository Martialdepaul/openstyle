import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import { getSetting } from "@/lib/settings";
import PageHeader from "@/components/admin/PageHeader";
import RelayPointQuickActions from "@/components/admin/RelayPointQuickActions";
import { createRelayPoint, updateDeliveryDelayText, updateDeliveryZone, updateRelayPoint } from "@/lib/actions/delivery-admin";

export default async function AdminDeliveryPage({ searchParams }: { searchParams: Promise<{ onglet?: string }> }) {
  await requireRole("OWNER");
  const { onglet } = await searchParams;
  const tab = onglet === "relais" ? "relais" : "zones";

  return (
    <div>
      <PageHeader title="Livraison" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Livraison" }]} />

      <div className="mb-6 flex gap-2 border-b border-os-gray text-sm">
        <a href="/admin/livraison" className={`px-4 py-2 ${tab === "zones" ? "border-b-2 border-os-black font-semibold" : "text-os-muted"}`}>
          Zones
        </a>
        <a
          href="/admin/livraison?onglet=relais"
          className={`px-4 py-2 ${tab === "relais" ? "border-b-2 border-os-black font-semibold" : "text-os-muted"}`}
        >
          Points relais
        </a>
      </div>

      {tab === "zones" ? <ZonesTab /> : <RelayPointsTab />}
    </div>
  );
}

async function ZonesTab() {
  const [zones, deliveryDelayText] = await Promise.all([
    prisma.deliveryZone.findMany({ orderBy: { position: "asc" } }),
    getSetting("deliveryDelayText", "2 jours"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <section className="max-w-md border border-os-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Délai de livraison affiché</h2>
        <form action={updateDeliveryDelayText} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Texte (ex. « 2 jours »)</label>
            <input
              name="deliveryDelayText"
              defaultValue={deliveryDelayText}
              className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
            />
          </div>
          <button type="submit" className="border border-os-black px-4 py-2 text-xs uppercase tracking-wide hover:bg-os-black hover:text-white">
            Enregistrer
          </button>
        </form>
      </section>

      {zones.map((zone) => {
        const updateWithId = updateDeliveryZone.bind(null, zone.id);
        return (
          <section key={zone.id} className="max-w-2xl border border-os-gray bg-white p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">{zone.nameFr}</h2>
            <form action={updateWithId} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (FR)</label>
                <input name="nameFr" defaultValue={zone.nameFr} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (EN, facultatif)</label>
                <input name="nameEn" defaultValue={zone.nameEn ?? ""} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Villes incluses (séparées par des virgules)</label>
                <input
                  name="cities"
                  defaultValue={zone.cities.join(", ")}
                  required
                  className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Frais détail (FCFA)</label>
                <input
                  name="feeRetail"
                  type="number"
                  min={0}
                  defaultValue={zone.feeRetail}
                  className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
                />
                <p className="mt-1 text-xs text-os-muted">Actuel : {formatPriceFcfa(zone.feeRetail)}</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Frais gros (FCFA)</label>
                <input
                  name="feeWholesale"
                  type="number"
                  min={0}
                  defaultValue={zone.feeWholesale}
                  className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
                />
                <p className="mt-1 text-xs text-os-muted">Actuel : {formatPriceFcfa(zone.feeWholesale)}</p>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
                  Enregistrer
                </button>
              </div>
            </form>
          </section>
        );
      })}
    </div>
  );
}

async function RelayPointsTab() {
  const relayPoints = await prisma.relayPoint.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-6">
      <section className="max-w-lg border border-os-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Nouveau point relais</h2>
        <form action={createRelayPoint} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom</label>
            <input name="name" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Ville</label>
            <input name="city" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Adresse</label>
            <input name="address" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Téléphone (facultatif)</label>
            <input name="phone" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
            Créer
          </button>
        </form>
      </section>

      <div className="flex flex-col gap-4">
        {relayPoints.map((point) => {
          const updateWithId = updateRelayPoint.bind(null, point.id);
          return (
            <section key={point.id} className="border border-os-gray bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest">
                  {point.name} {!point.isActive && <span className="ml-2 rounded-full bg-os-gray px-2 py-0.5 text-[10px] normal-case">Désactivé</span>}
                </h3>
                <RelayPointQuickActions relayPointId={point.id} isActive={point.isActive} />
              </div>
              <form action={updateWithId} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom</label>
                  <input name="name" defaultValue={point.name} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Ville</label>
                  <input name="city" defaultValue={point.city} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Adresse</label>
                  <input name="address" defaultValue={point.address} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Téléphone</label>
                  <input name="phone" defaultValue={point.phone ?? ""} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
                    Enregistrer
                  </button>
                </div>
              </form>
            </section>
          );
        })}
        {relayPoints.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucun point relais.</p>}
      </div>
    </div>
  );
}
