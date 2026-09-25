import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { requireCustomerSession } from "@/lib/customer-auth";
import { formatPriceFcfa } from "@/lib/currency";
import { Link } from "@/i18n/navigation";

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const DELIVERY_METHOD_LABELS: Record<string, string> = {
  PICKUP: "Retrait en boutique",
  RELAY: "Point relais",
  SHIPPING: "Expédition",
};

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; numero: string }>;
}) {
  const { locale, numero } = await params;
  setRequestLocale(locale);
  const session = await requireCustomerSession(locale as "fr" | "en");
  const t = await getTranslations("Account");

  const order = await prisma.order.findUnique({
    where: { number: numero },
    include: { items: true, events: { where: { type: "STATUS_CHANGE" }, orderBy: { createdAt: "asc" } } },
  });

  // F08 : seules les commandes passées par ce compte lui sont accessibles.
  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <Link href="/compte" className="text-xs text-os-muted hover:text-os-black">
        ← {t("ordersTitle")}
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">{order.number}</h1>
        <span className="rounded-full bg-os-gray px-2.5 py-0.5 text-xs font-medium">{STATUS_LABELS[order.status] ?? order.status}</span>
      </div>
      <p className="mt-1 text-xs text-os-muted">{DELIVERY_METHOD_LABELS[order.deliveryMethod] ?? order.deliveryMethod} — {order.city}</p>

      <div className="mt-6 border border-os-gray p-6">
        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.name}
                {[item.size, item.color, item.scent].filter(Boolean).length > 0
                  ? ` (${[item.size, item.color, item.scent].filter(Boolean).join(" · ")})`
                  : ""}
              </span>
              <span className="font-semibold">{formatPriceFcfa(item.lineTotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1.5 border-t border-os-gray pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-os-muted">{t("subtotalLabel")}</span>
            <span>{formatPriceFcfa(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-os-muted">{t("deliveryFeeLabel")}</span>
            <span>{formatPriceFcfa(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-os-gray pt-2 font-semibold">
            <span>{t("totalLabel")}</span>
            <span>{formatPriceFcfa(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-os-muted">Historique</h2>
        <div className="flex flex-col gap-1.5">
          {order.events.map((event) => (
            <p key={event.id} className="text-xs text-os-muted">
              {STATUS_LABELS[event.toStatus ?? ""] ?? event.toStatus} —{" "}
              {event.createdAt.toLocaleString("fr-FR", { timeZone: "Africa/Douala" })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
