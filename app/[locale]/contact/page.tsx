import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageBody from "@/components/content/PageBody";
import { getPageContent } from "@/lib/pages";
import { localizedText } from "@/lib/i18n-helpers";
import { getShopSettings, whatsAppLink } from "@/lib/shop-settings";

const SLUG = "contact";

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

// F10 : coordonnées, adresse, horaires, boutons appeler/WhatsApp — pas de formulaire.
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContentPages.contact");

  const [page, settings] = await Promise.all([getPageContent(SLUG), getShopSettings()]);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-serif text-4xl font-bold">{localizedText(locale, page.titleFr, page.titleEn)}</h1>
      <div className="mt-8">
        <PageBody locale={locale} bodyFr={page.bodyFr} bodyEn={page.bodyEn} />
      </div>

      <dl className="mt-8 space-y-3 border-t border-os-gray pt-6 text-sm">
        <div className="flex gap-2">
          <dt className="font-semibold">{t("addressLabel")} :</dt>
          <dd className="text-os-muted">{settings.address}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">{t("hoursLabel")} :</dt>
          <dd className="text-os-muted">{settings.hours}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsAppLink(settings.whatsappNumber, t("whatsappMessage"))}
          target="_blank"
          rel="noreferrer"
          className="btn-press flex flex-1 items-center justify-center gap-2 bg-[#25D366] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {t("whatsappCta")}
        </a>
        <a
          href={`tel:${settings.phoneNumber}`}
          className="btn-press flex flex-1 items-center justify-center gap-2 border border-os-gray px-6 py-4 text-sm font-semibold uppercase tracking-widest transition hover:border-os-black"
        >
          {t("callCta")}
        </a>
      </div>
    </div>
  );
}
