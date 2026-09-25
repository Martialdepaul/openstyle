import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import Pagination from "@/components/admin/Pagination";

const PAGE_SIZE = 30;

/** F12 (S) : journal, à partir de AdminLog — voir prisma/schema.prisma pour la liste des actions. */
const ACTION_LABELS: Record<string, string> = {
  EXPORT_ORDERS: "Export des commandes (CSV)",
  EXPORT_CUSTOMERS: "Export des clients (CSV)",
  PRO_APPROVED: "Demande pro validée",
  PRO_REJECTED: "Demande pro refusée",
  PRO_REVERTED: "Compte pro repassé en client détail",
  ADMIN_CREATED: "Compte admin créé",
  ROLE_CHANGED: "Rôle modifié",
  ADMIN_DEACTIVATED: "Compte admin désactivé",
  ADMIN_REACTIVATED: "Compte admin réactivé",
};

const ENTITY_LABELS: Record<string, string> = {
  User: "Compte",
  Order: "Commande",
};

export default async function AdminJournalPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireRole("OWNER");
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [total, entries] = await Promise.all([
    prisma.adminLog.count(),
    prisma.adminLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildHref = (targetPage: number) => (targetPage > 1 ? `/admin/journal?page=${targetPage}` : "/admin/journal");

  return (
    <div>
      <PageHeader title="Journal" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Journal" }]} />

      <div className="overflow-x-auto border border-os-gray bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-os-gray">
              {["Date", "Auteur", "Action", "Concerne"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-os-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-os-cream last:border-0 hover:bg-os-cream">
                <td className="px-4 py-3 text-xs text-os-muted">
                  {entry.createdAt.toLocaleString("fr-FR", { timeZone: "Africa/Douala", dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3 text-xs">
                  {entry.user.firstName} {entry.user.lastName}
                </td>
                <td className="px-4 py-3 text-xs">{ACTION_LABELS[entry.action] ?? entry.action}</td>
                <td className="px-4 py-3 text-xs text-os-muted">
                  {entry.entity ? `${ENTITY_LABELS[entry.entity] ?? entry.entity}${entry.entityId ? ` #${entry.entityId.slice(-6)}` : ""}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucune entrée pour le moment.</p>}
      <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
