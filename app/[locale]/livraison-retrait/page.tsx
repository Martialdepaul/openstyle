import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageBody from "@/components/content/PageBody";
import { getPageContent } from "@/lib/pages";
import { getSetting } from "@/lib/settings";
import { formatPriceFcfa } from "@/lib/currency";
import { localizedText } from "@/lib/i18n-helpers";
import { prisma } from "@/lib/db";

const SLUG = "livraison-retrait";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageContent(SLUG);
  if (!page) return {};
  return { title: localizedText(locale, page.titleFr, page.titleEn) };
}

// F10/F20 : le texte reprend les zones et les frais réels saisis dans l'admin (critère d'acceptation).
export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContentPages.delivery");

  const [page, zones, delayText] = await Promise.all([
    getPageContent(SLUG),
    prisma.deliveryZone.findMany({ orderBy: { position: "asc" } }),
    getSetting("deliveryDelayText", "2 jours"),
  ]);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-serif text-4xl font-bold">{localizedText(locale, page.titleFr, page.titleEn)}</h1>
      <div className="mt-8">
        <PageBody locale={locale} bodyFr={page.bodyFr} bodyEn={page.bodyEn} />
      </div>

      <div className="mt-10 border-t border-os-gray pt-6">
        <h2 className="font-serif text-2xl font-bold">{t("zonesTitle")}</h2>
        <p className="mt-2 text-sm text-os-muted">{t("pickupNote")}</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-os-gray text-xs uppercase tracking-widest text-os-muted">
                <th className="py-2 pr-4">{t("zoneColumn")}</th>
                <th className="py-2 pr-4">{t("citiesColumn")}</th>
                <th className="py-2 pr-4">{t("retailColumn")}</th>
                <th className="py-2">{t("wholesaleColumn")}</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-os-gray/50">
                  <td className="py-3 pr-4 font-semibold">{localizedText(locale, zone.nameFr, zone.nameEn)}</td>
                  <td className="py-3 pr-4 text-os-muted">{zone.cities.join(", ")}</td>
                  <td className="py-3 pr-4">{formatPriceFcfa(zone.feeRetail)}</td>
                  <td className="py-3">{formatPriceFcfa(zone.feeWholesale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm">
          <span className="font-semibold">{t("delayLabel")}</span> : {delayText}
        </p>
      </div>
    </div>
  );
}
