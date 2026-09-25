import type { NextRequest } from "next/server";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { csvResponse, toCsv } from "@/lib/csv";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const DELIVERY_METHOD_LABELS = { PICKUP: "Retrait en boutique", RELAY: "Point relais", SHIPPING: "Expédition" };
const PAYMENT_STATUS_LABELS = { TO_COLLECT: "À encaisser", COLLECTED: "Encaissé" };

/** F23 : export commandes (période + statut), réservé à l'OWNER, journalisé. */
export async function GET(request: NextRequest) {
  const session = await requireRole("OWNER");

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const statut = searchParams.get("statut");

  const where: Prisma.OrderWhereInput = {};
  if (statut) where.status = statut as OrderStatus;
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lt: new Date(new Date(to).getTime() + 24 * 60 * 60 * 1000) } : {}),
    };
  }

  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" } });

  const rows = orders.map((order) => [
    order.number,
    order.createdAt.toLocaleString("fr-FR", { timeZone: "Africa/Douala", dateStyle: "short", timeStyle: "short" }),
    STATUS_LABELS[order.status],
    `${order.firstName} ${order.lastName}`,
    order.phone,
    order.city,
    DELIVERY_METHOD_LABELS[order.deliveryMethod],
    order.subtotal,
    order.deliveryFee,
    order.total,
    PAYMENT_STATUS_LABELS[order.paymentStatus],
  ]);

  const csv = toCsv(
    ["Numéro", "Date", "Statut", "Client", "Téléphone", "Ville", "Livraison", "Sous-total (FCFA)", "Frais (FCFA)", "Total (FCFA)", "Paiement"],
    rows,
  );

  await prisma.adminLog.create({ data: { userId: session.user.id, action: "EXPORT_ORDERS" } });

  const dateSuffix = new Date().toISOString().slice(0, 10);
  return csvResponse(`openstyle-commandes-${dateSuffix}.csv`, csv);
}
