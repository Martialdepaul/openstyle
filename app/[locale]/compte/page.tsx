import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { requireCustomerSession } from "@/lib/customer-auth";
import { formatPriceFcfa } from "@/lib/currency";
import { Link } from "@/i18n/navigation";
import AccountShell, { type AccountTab } from "@/components/account/AccountShell";
import ProfileForm from "@/components/account/ProfileForm";
import ProRequestForm from "@/components/account/ProRequestForm";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const IN_PROGRESS_STATUSES = ["NEW", "CONFIRMED", "READY", "SHIPPED"];

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { onglet } = await searchParams;
  const tab = (["dashboard", "commandes", "profil", "pro"].includes(onglet ?? "") ? onglet : "dashboard") as AccountTab;

  const session = await requireCustomerSession(locale as "fr" | "en");
  const t = await getTranslations("Account");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  const labels = {
    title: t("dashboardTitle"),
    dashboard: t("tabDashboard"),
    orders: t("tabOrders"),
    profile: t("tabProfile"),
    pro: t("tabPro"),
    logout: t("logout"),
  };

  return (
    <AccountShell active={tab} labels={labels}>
      {tab === "dashboard" && <DashboardTab userId={session.user.id} firstName={user.firstName} t={t} />}
      {tab === "commandes" && <OrdersTab userId={session.user.id} t={t} />}
      {tab === "profil" && <ProfileForm user={{ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }} />}
      {tab === "pro" && <ProTab proStatus={user.proStatus} t={t} />}
    </AccountShell>
  );
}

async function DashboardTab({
  userId,
  firstName,
  t,
}: {
  userId: string;
  firstName: string;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  const inProgressCount = orders.filter((o) => IN_PROGRESS_STATUSES.includes(o.status)).length;

  return (
    <div>
      <h2 className="mb-5 font-serif text-xl font-bold">{t("welcomeTitle", { name: firstName })}</h2>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <div className="border border-os-gray p-5">
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="mt-1 text-xs text-os-muted">{t("statCount")}</p>
        </div>
        <div className="border border-os-gray p-5">
          <p className="text-2xl font-bold">{inProgressCount}</p>
          <p className="mt-1 text-xs text-os-muted">{t("statPending")}</p>
        </div>
      </div>

      <h3 className="mb-3 text-sm font-semibold">{t("recentOrdersTitle")}</h3>
      <div className="flex flex-col gap-3">
        {orders.slice(0, 3).map((order) => (
          <OrderRow key={order.id} order={order} t={t} />
        ))}
        {orders.length === 0 && <p className="text-sm text-os-muted">{t("ordersEmpty")}</p>}
      </div>
    </div>
  );
}

async function OrdersTab({ userId, t }: { userId: string; t: Awaited<ReturnType<typeof getTranslations>> }) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h2 className="mb-5 font-serif text-xl font-bold">{t("ordersTitle")}</h2>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} t={t} />
        ))}
        {orders.length === 0 && <p className="text-sm text-os-muted">{t("ordersEmpty")}</p>}
      </div>
    </div>
  );
}

function OrderRow({
  order,
  t,
}: {
  order: { id: string; number: string; status: string; createdAt: Date; total: number; items: unknown[] };
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  return (
    <Link
      href={{ pathname: "/compte/commandes/[numero]", params: { numero: order.number } }}
      className="flex flex-wrap items-center justify-between gap-3 border border-os-gray p-4 transition hover:border-os-black"
    >
      <div>
        <p className="text-sm font-semibold">{order.number}</p>
        <p className="text-xs text-os-muted">
          {order.createdAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Douala" })} · {t("itemCount", { count: order.items.length })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-os-gray px-2.5 py-0.5 text-xs font-medium">{STATUS_LABELS[order.status] ?? order.status}</span>
        <span className="text-sm font-semibold">{formatPriceFcfa(order.total)}</span>
      </div>
    </Link>
  );
}

function ProTab({ proStatus, t }: { proStatus: string; t: Awaited<ReturnType<typeof getTranslations>> }) {
  return (
    <div>
      <h2 className="mb-2 font-serif text-xl font-bold">{t("proTitle")}</h2>
      <p className="mb-6 text-sm text-os-muted">{t("proSubtitle")}</p>

      {proStatus === "PENDING" && <p className="border border-os-gray bg-os-cream p-4 text-sm">{t("proPendingBanner")}</p>}
      {proStatus === "APPROVED" && <p className="border border-os-gray bg-os-cream p-4 text-sm">{t("proApprovedBanner")}</p>}
      {(proStatus === "NONE" || proStatus === "REJECTED") && (
        <>
          {proStatus === "REJECTED" && <p className="mb-4 border border-os-gray bg-os-cream p-4 text-sm">{t("proRejectedBanner")}</p>}
          <ProRequestForm />
        </>
      )}
    </div>
  );
}
