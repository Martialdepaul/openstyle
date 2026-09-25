import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import { getShopSettings, whatsAppLink } from "@/lib/shop-settings";

const socialIcons = { facebook: "F", instagram: "I", tiktok: "T" } as const;

export default async function Footer() {
  const t = useTranslations("Footer");
  const settings = await getShopSettings();

  const social = { facebook: settings.facebook, instagram: settings.instagram, tiktok: settings.tiktok };
  const socialLinks = (Object.keys(social) as Array<keyof typeof social>).filter((key) => social[key]);

  return (
    <footer className="mt-16 bg-os-black text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 inline-block rounded bg-os-white p-2">
            <Logo className="h-10" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-os-muted">{t("tagline")}</p>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socialLinks.map((key) => (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs uppercase transition hover:border-white"
                >
                  {socialIcons[key]}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-os-gray">
            {t("navigationTitle")}
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-os-muted">
            <li>
              <Link href="/" className="transition hover:text-white">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link href="/boutique" className="transition hover:text-white">
                {t("shop")}
              </Link>
            </li>
            <li>
              <Link href="/suivi" className="transition hover:text-white">
                {t("tracking")}
              </Link>
            </li>
            <li>
              <Link href="/inscription" className="transition hover:text-white">
                {t("becomePro")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-os-gray">
            {t("infoTitle")}
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-os-muted">
            <li>
              <Link href="/a-propos" className="transition hover:text-white">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-white">
                {t("contactTitle")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition hover:text-white">
                {t("faq")}
              </Link>
            </li>
            <li>
              <Link href="/livraison-retrait" className="transition hover:text-white">
                {t("delivery")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-os-gray">
            {t("contactTitle")}
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-os-muted">
            <li>{settings.address}</li>
            <li>
              <a href={`tel:${settings.phoneNumber}`} className="transition hover:text-white">
                {settings.phoneNumber}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="transition hover:text-white">
                {settings.email}
              </a>
            </li>
            <li>{settings.hours}</li>
          </ul>
          <a
            href={whatsAppLink(settings.whatsappNumber, t("whatsappCta"))}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20c05a]"
          >
            {t("whatsappCta")}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center text-xs text-os-muted sm:flex-row sm:justify-between sm:text-left">
          <span>
            © {new Date().getFullYear()} {settings.shopName}. {t("rights")}
          </span>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/conditions-vente" className="transition hover:text-white">
              {t("terms")}
            </Link>
            <Link href="/confidentialite" className="transition hover:text-white">
              {t("privacy")}
            </Link>
            <Link href="/mentions-legales" className="transition hover:text-white">
              {t("legal")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
