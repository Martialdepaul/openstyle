import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { csvResponse, toCsv } from "@/lib/csv";

const PRO_STATUS_LABELS = { NONE: "Client détail", PENDING: "Demande en attente", APPROVED: "Client pro validé", REJECTED: "Demande refusée" };

/** F23 : export clients, réservé à l'OWNER, journalisé. */
export async function GET() {
  const session = await requireRole("OWNER");

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  const rows = customers.map((customer) => [
    `${customer.firstName} ${customer.lastName}`,
    customer.email,
    customer.phone ?? "",
    PRO_STATUS_LABELS[customer.proStatus],
    customer.shopName ?? "",
    customer.proCity ?? "",
    customer._count.orders,
    customer.createdAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala" }),
  ]);

  const csv = toCsv(
    ["Nom", "E-mail", "Téléphone", "Statut pro", "Boutique", "Ville pro", "Nombre de commandes", "Inscrit le"],
    rows,
  );

  await prisma.adminLog.create({ data: { userId: session.user.id, action: "EXPORT_CUSTOMERS" } });

  const dateSuffix = new Date().toISOString().slice(0, 10);
  return csvResponse(`openstyle-clients-${dateSuffix}.csv`, csv);
}
