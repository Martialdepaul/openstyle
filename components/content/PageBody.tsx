import { localizedText } from "@/lib/i18n-helpers";

/**
 * F10/F21 : le HTML est déjà nettoyé côté serveur avant d'être stocké
 * (`lib/actions/page.ts`, `sanitize-html`) — seul un admin peut l'écrire,
 * donc l'injecter tel quel ici est sûr.
 */
export default function PageBody({
  locale,
  bodyFr,
  bodyEn,
}: {
  locale: string;
  bodyFr: string;
  bodyEn: string | null;
}) {
  const body = localizedText(locale, bodyFr, bodyEn);

  return (
    <div
      className="space-y-2 text-sm leading-relaxed text-os-muted [&_a]:text-os-black [&_a]:underline [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-os-black [&_h2:first-child]:mt-0 [&_h3]:mt-4 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-os-black [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-2 [&_strong]:text-os-black [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
