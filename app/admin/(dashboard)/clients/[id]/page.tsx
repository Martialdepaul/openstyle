import { notFound } from "next/navigation";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import PageHeader from "@/components/admin/PageHeader";
import OrderLink from "@/components/admin/OrderLink";
import StatusBadge from "@/components/admin/StatusBadge";
import ProRequestActions from "@/components/admin/ProRequestActions";

const PRO_STATUS_LABELS: Record<string, string> = {
  NONE: "Client détail",
  PENDING: "Demande en attente",
  APPROVED: "Pro validé",
  REJECTED: "Demande refusée",
};

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("OWNER");
  const { id } = await params;

  const customer = await prisma.user.findFirst({
    where: { id, role: "CUSTOMER" },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });
  if (!customer) notFound();

  return (
    <div>
      <PageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Clients", href: "/admin/clients" },
          { label: `${customer.firstName} ${customer.lastName}` },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Coordonnées</h2>
          <p className="text-sm">{customer.email}</p>
          <p className="mt-1 text-sm text-os-muted">{customer.phone ?? "—"}</p>
          <p className="mt-4 text-xs text-os-muted">
            Inscrit le {customer.createdAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala" })}
          </p>
        </section>

        <section className="border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Compte professionnel</h2>
          <p className="text-sm font-semibold">{PRO_STATUS_LABELS[customer.proStatus]}</p>
          {customer.shopName && (
            <p className="mt-2 text-xs text-os-muted">
              {customer.shopName} — {customer.proCity} — {customer.proPhone}
            </p>
          )}
          <div className="mt-4">
            <ProRequestActions userId={customer.id} proStatus={customer.proStatus} />
          </div>
        </section>

        <section className="border border-os-gray bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Commandes</h2>
          <div className="flex flex-col gap-3">
            {customer.orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-os-cream pb-3 last:border-0">
                <OrderLink id={order.id} number={order.number} />
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-semibold">{formatPriceFcfa(order.total)}</span>
                </div>
              </div>
            ))}
            {customer.orders.length === 0 && <p className="text-sm text-os-muted">Aucune commande.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
