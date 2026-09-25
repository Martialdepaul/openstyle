import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import PageHeader from "@/components/admin/PageHeader";
import OrderLink from "@/components/admin/OrderLink";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 25;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; statut?: string; filtre?: string; date?: string; tri?: string; page?: string }>;
}) {
  await requireRole("OWNER");
  const { q, statut, filtre, date, tri, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.OrderWhereInput = {};
  if (statut) where.status = statut as OrderStatus;
  // RG-13 : commande NEW depuis plus de 3 jours.
  if (filtre === "relance") {
    where.status = "NEW";
    where.createdAt = { lt: new Date(Date.now() - THREE_DAYS_MS) };
  }
  if (filtre === "recu") where.receiptRequested = true;
  if (date) {
    const day = new Date(date);
    const next = new Date(day.getTime() + 24 * 60 * 60 * 1000);
    where.createdAt = { gte: day, lt: next };
  }
  if (q) {
    where.OR = [
      { number: { contains: q } },
      { firstName: { contains: q } },
      { lastName: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: tri === "asc" ? "asc" : "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (statut) params.set("statut", statut);
    if (filtre) params.set("filtre", filtre);
    if (date) params.set("date", date);
    if (tri) params.set("tri", tri);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/commandes${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <PageHeader title="Commandes" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Commandes" }]} />

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Numéro, nom ou téléphone..."
          className="border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
        />
        <select name="statut" defaultValue={statut ?? ""} className="border border-os-gray px-3 py-2 text-sm">
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="filtre" defaultValue={filtre ?? ""} className="border border-os-gray px-3 py-2 text-sm">
          <option value="">Tous</option>
          <option value="relance">À relancer</option>
          <option value="recu">Reçu demandé</option>
        </select>
        <input type="date" name="date" defaultValue={date} className="border border-os-gray px-3 py-2 text-sm" />
        <select name="tri" defaultValue={tri ?? "desc"} className="border border-os-gray px-3 py-2 text-sm">
          <option value="desc">Plus récentes</option>
          <option value="asc">Plus anciennes</option>
        </select>
        <button
          type="submit"
          className="border border-os-black px-4 py-2 text-xs uppercase tracking-wide hover:bg-os-black hover:text-white"
        >
          Filtrer
        </button>
      </form>

      <div className="hidden overflow-x-auto border border-os-gray bg-white lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-os-gray">
              {["Commande", "Client", "Téléphone", "Total", "Statut", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-os-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const toFollowUp = order.status === "NEW" && Date.now() - order.createdAt.getTime() > THREE_DAYS_MS;
              return (
                <tr key={order.id} className="border-b border-os-cream last:border-0 hover:bg-os-cream">
                  <td className="px-4 py-3">
                    <OrderLink id={order.id} number={order.number} />
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-4 py-3 text-xs text-os-muted">{order.phone}</td>
                  <td className="px-4 py-3 text-xs font-semibold">{formatPriceFcfa(order.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} toFollowUp={toFollowUp} />
                  </td>
                  <td className="px-4 py-3 text-xs text-os-muted">
                    {order.createdAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {orders.map((order) => {
          const toFollowUp = order.status === "NEW" && Date.now() - order.createdAt.getTime() > THREE_DAYS_MS;
          return (
            <div key={order.id} className="border border-os-gray bg-white p-4">
              <div className="flex items-center justify-between">
                <OrderLink id={order.id} number={order.number} />
                <StatusBadge status={order.status} toFollowUp={toFollowUp} />
              </div>
              <p className="mt-1 text-xs text-os-muted">
                {order.firstName} {order.lastName} · {order.phone}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="font-semibold">{formatPriceFcfa(order.total)}</span>
                <span className="text-os-muted">{order.createdAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala" })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucune commande.</p>}

      <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
