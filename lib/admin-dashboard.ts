import { prisma } from "./db";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function getOwnerDashboardData() {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - THREE_DAYS_MS);
  const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_MS);

  const [newOrders, toFollowUp, pendingPro, variants, last7DaysOrders, recentOrders] = await Promise.all([
    prisma.order.count({ where: { status: "NEW" } }),
    // RG-13 : commande NEW depuis plus de 3 jours.
    prisma.order.count({ where: { status: "NEW", createdAt: { lt: threeDaysAgo } } }),
    prisma.user.count({ where: { proStatus: "PENDING" } }),
    prisma.variant.findMany({ where: { isActive: true }, select: { stock: true, lowStockThreshold: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: sevenDaysAgo } }, select: { total: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, number: true, firstName: true, lastName: true, total: true, status: true, createdAt: true },
    }),
  ]);

  const lowStockCount = variants.filter((v) => v.stock <= v.lowStockThreshold).length;

  return {
    newOrders,
    toFollowUp,
    pendingPro,
    lowStockCount,
    last7DaysCount: last7DaysOrders.length,
    last7DaysTotal: last7DaysOrders.reduce((sum, o) => sum + o.total, 0),
    recentOrders,
  };
}

export async function getManagerDashboardData() {
  const [draftProducts, variants] = await Promise.all([
    prisma.product.count({ where: { status: "DRAFT" } }),
    prisma.variant.findMany({ where: { isActive: true }, select: { stock: true, lowStockThreshold: true } }),
  ]);

  const lowStockCount = variants.filter((v) => v.stock <= v.lowStockThreshold).length;

  return { draftProducts, lowStockCount };
}
