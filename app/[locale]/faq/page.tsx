import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedText } from "@/lib/i18n-helpers";
import { prisma } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContentPages.faq" });
  return { title: t("title") };
}

// F10 : questions/réponses issues de FaqItem (éditable dans l'admin, F21).
// Accordéon natif <details>/<summary> : pas de JS nécessaire.
export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContentPages.faq");

  const items = await prisma.faqItem.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-serif text-4xl font-bold">{t("title")}</h1>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-os-muted">{t("empty")}</p>
      ) : (
        <div className="mt-8 divide-y divide-os-gray border-t border-os-gray">
          {items.map((item) => (
            <details key={item.id} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-semibold">
                {localizedText(locale, item.questionFr, item.questionEn)}
                <span className="flex-shrink-0 text-xl text-os-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-os-muted">
                {localizedText(locale, item.answerFr, item.answerEn)}
              </p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
