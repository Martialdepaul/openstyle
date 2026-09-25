import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import { whatsAppLink, getShopSettings } from "@/lib/shop-settings";
import { Link } from "@/i18n/navigation";
import ClearCartOnMount from "@/components/checkout/ClearCartOnMount";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; numero: string }>;
}) {
  const { locale, numero } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Checkout");
  const tTracking = await getTranslations("Tracking");

  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { number: numero },
      include: { items: true, zone: true, relayPoint: true },
    }),
    getShopSettings(),
  ]);
  if (!order) notFound();

  const methodLabel = t(`method${order.deliveryMethod}`);
  const recapLines = order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ");
  const whatsappMessage = t("whatsappMessage", { number: order.number, recap: recapLines, total: formatPriceFcfa(order.total) });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center lg:px-8">
      <ClearCartOnMount />
      <h1 className="font-serif text-3xl font-bold">{t("confirmationTitle")}</h1>
      <p className="mt-3 text-sm text-os-muted">
        {t("orderNumberLabel")} <strong className="text-os-black">{order.number}</strong>
      </p>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-os-muted">{t("confirmationBody")}</p>

      <div className="mt-8 border border-os-gray p-6 text-left">
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
        <p className="mt-3 text-xs text-os-muted">
          {methodLabel}
          {order.relayPoint ? ` — ${order.relayPoint.name}` : ""}
          {order.address ? ` — ${order.address}` : ""}
        </p>
      </div>

      <a
        href={whatsAppLink(settings.whatsappNumber, whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        className="btn-press mt-8 flex w-full items-center justify-center gap-2 bg-[#25D366] py-4 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {t("sendWhatsapp")}
      </a>
      <a
        href={`tel:${settings.phoneNumber}`}
        className="btn-press mt-3 flex w-full items-center justify-center gap-2 border border-os-gray py-4 text-sm font-semibold uppercase tracking-widest transition hover:border-os-black"
      >
        {t("callShop")}
      </a>

      <div className="mt-6 flex flex-col gap-2">
        <Link href="/suivi" className="text-sm underline">
          {tTracking("title")}
        </Link>
        <Link href="/" className="text-sm underline">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
