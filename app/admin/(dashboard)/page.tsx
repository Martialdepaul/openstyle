import Link from "next/link";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminTranslations } from "@/lib/admin-i18n";
import { getManagerDashboardData, getOwnerDashboardData } from "@/lib/admin-dashboard";
import { formatPriceFcfa } from "@/lib/currency";
import OrderLink from "@/components/admin/OrderLink";
import StatusBadge from "@/components/admin/StatusBadge";

function Counter({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="block border border-os-gray bg-white p-5 transition hover:border-os-black">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-os-muted">{label}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const t = getAdminTranslations("Dashboard");

  if (session.user.role === "OWNER") {
    const data = await getOwnerDashboardData();

    return (
      <div>
        <h1 className="mb-6 font-serif text-2xl font-bold">{t("title")}</h1>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Counter label={t("newOrders")} value={data.newOrders} href="/admin/commandes?statut=NEW" />
          <Counter label={t("toFollowUp")} value={data.toFollowUp} href="/admin/commandes?filtre=relance" />
          <Counter label={t("pendingPro")} value={data.pendingPro} href="/admin/clients?onglet=pro" />
          <Counter label={t("lowStock")} value={data.lowStockCount} href="/admin/stocks?filtre=bas" />
        </div>

        <div className="mb-8 border border-os-gray bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold">{t("last7Days")}</h2>
          <p className="text-xl font-bold">
            {data.last7DaysCount} · {formatPriceFcfa(data.last7DaysTotal)}
          </p>
        </div>

        <div className="border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold">{t("recentOrders")}</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-os-muted">{t("noOrders")}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.recentOrders.map((order) => {
                const toFollowUp =
                  order.status === "NEW" && Date.now() - order.createdAt.getTime() > 3 * 24 * 60 * 60 * 1000;
                return (
                  <div key={order.id} className="flex items-center justify-between gap-3 border-b border-os-gray pb-3">
                    <div>
                      <OrderLink id={order.id} number={order.number} />
                      <p className="text-xs text-os-muted">
                        {order.firstName} {order.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} toFollowUp={toFollowUp} />
                      <span className="text-sm font-semibold">{formatPriceFcfa(order.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const data = await getManagerDashboardData();

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-bold">{t("title")}</h1>
      <div className="grid grid-cols-2 gap-4">
        <Counter label={t("draftProducts")} value={data.draftProducts} href="/admin/produits?statut=DRAFT" />
        <Counter label={t("lowStock")} value={data.lowStockCount} href="/admin/stocks?filtre=bas" />
      </div>
    </div>
  );
}
