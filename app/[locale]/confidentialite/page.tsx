import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import PageBody from "@/components/content/PageBody";
import { getPageContent } from "@/lib/pages";
import { localizedText } from "@/lib/i18n-helpers";

const SLUG = "confidentialite";

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

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getPageContent(SLUG);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-serif text-4xl font-bold">{localizedText(locale, page.titleFr, page.titleEn)}</h1>
      <div className="mt-8">
        <PageBody locale={locale} bodyFr={page.bodyFr} bodyEn={page.bodyEn} />
      </div>
    </div>
  );
}
