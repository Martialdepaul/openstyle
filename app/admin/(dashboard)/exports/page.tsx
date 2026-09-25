import { requireRole } from "@/lib/admin-auth";
import PageHeader from "@/components/admin/PageHeader";
import type { OrderStatus } from "@/generated/prisma/client";

const inputClass = "w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-widest";

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export default async function AdminExportsPage() {
  await requireRole("OWNER");

  return (
    <div>
      <PageHeader title="Exports" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Exports" }]} />

      <div className="flex flex-col gap-6">
        <section className="max-w-lg border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Commandes</h2>
          <form action="/admin/exports/commandes" method="get" className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Du</label>
                <input name="from" type="date" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Au</label>
                <input name="to" type="date" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Statut</label>
              <select name="statut" defaultValue="" className={inputClass}>
                <option value="">Tous les statuts</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
              Télécharger le CSV
            </button>
          </form>
        </section>

        <section className="max-w-lg border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Clients</h2>
          <p className="mb-4 text-xs text-os-muted">Tous les comptes clients, avec leur statut pro et leur nombre de commandes.</p>
          <a
            href="/admin/exports/clients"
            className="btn-press inline-block w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
          >
            Télécharger le CSV
          </a>
        </section>
      </div>
    </div>
  );
}
