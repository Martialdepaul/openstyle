import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import CustomerLink from "@/components/admin/CustomerLink";
import ProRequestActions from "@/components/admin/ProRequestActions";
import Pagination from "@/components/admin/Pagination";

const PAGE_SIZE = 25;

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string; q?: string; page?: string }>;
}) {
  await requireRole("OWNER");
  const { onglet, q, page: pageParam } = await searchParams;
  const tab = onglet === "pro" ? "pro" : "clients";
  const page = Math.max(1, Number(pageParam) || 1);

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (tab === "pro") params.set("onglet", "pro");
    if (q) params.set("q", q);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/clients${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <PageHeader title="Clients" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Clients" }]} />

      <div className="mb-6 flex gap-2 border-b border-os-gray text-sm">
        <a
          href="/admin/clients"
          className={`px-4 py-2 ${tab === "clients" ? "border-b-2 border-os-black font-semibold" : "text-os-muted"}`}
        >
          Clients
        </a>
        <a
          href="/admin/clients?onglet=pro"
          className={`px-4 py-2 ${tab === "pro" ? "border-b-2 border-os-black font-semibold" : "text-os-muted"}`}
        >
          Demandes pro
        </a>
      </div>

      {tab === "clients" ? (
        <ClientsTab q={q} page={page} buildHref={buildHref} />
      ) : (
        <ProRequestsTab />
      )}
    </div>
  );
}

async function ClientsTab({ q, page, buildHref }: { q?: string; page: number; buildHref: (page: number) => string }) {
  const where = {
    role: "CUSTOMER" as const,
    ...(q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, customers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <form className="mb-4 flex gap-3" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Nom, e-mail ou téléphone..."
          className="border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
        />
        <button type="submit" className="border border-os-black px-4 py-2 text-xs uppercase tracking-wide hover:bg-os-black hover:text-white">
          Filtrer
        </button>
      </form>

      <div className="overflow-x-auto border border-os-gray bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-os-gray">
              {["Nom", "E-mail", "Téléphone", "Statut pro", "Inscrit le"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-os-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-os-cream last:border-0 hover:bg-os-cream">
                <td className="px-4 py-3">
                  <CustomerLink id={customer.id} name={`${customer.firstName} ${customer.lastName}`} />
                </td>
                <td className="px-4 py-3 text-xs text-os-muted">{customer.email}</td>
                <td className="px-4 py-3 text-xs text-os-muted">{customer.phone ?? "—"}</td>
                <td className="px-4 py-3 text-xs">{customer.proStatus}</td>
                <td className="px-4 py-3 text-xs text-os-muted">
                  {customer.createdAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {customers.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucun client.</p>}
      <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}

async function ProRequestsTab() {
  const requests = await prisma.user.findMany({
    where: { proStatus: "PENDING" },
    orderBy: { proDecidedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-3">
      {requests.map((request) => (
        <div key={request.id} className="flex flex-wrap items-center justify-between gap-3 border border-os-gray bg-white p-4">
          <div>
            <CustomerLink id={request.id} name={`${request.firstName} ${request.lastName}`} />
            <p className="mt-1 text-xs text-os-muted">
              {request.shopName} — {request.proCity} — {request.proPhone}
            </p>
          </div>
          <ProRequestActions userId={request.id} proStatus={request.proStatus} />
        </div>
      ))}
      {requests.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucune demande en attente.</p>}
    </div>
  );
}
