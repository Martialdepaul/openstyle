import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import { shopInfo, whatsAppLink } from "@/lib/shop-info";

const socialIcons: Record<keyof typeof shopInfo.social, string> = {
  facebook: "F",
  instagram: "I",
  tiktok: "T",
};

export default function Footer() {
  const t = useTranslations("Footer");

  const socialLinks = (Object.keys(shopInfo.social) as Array<keyof typeof shopInfo.social>).filter(
    (key) => shopInfo.social[key],
  );

  return (
    <footer className="mt-16 bg-os-black text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-3 lg:px-8">
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
                  href={shopInfo.social[key]}
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
            {t("contactTitle")}
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-os-muted">
            <li>{shopInfo.address}</li>
            <li>
              <a href={`tel:${shopInfo.phoneNumber}`} className="transition hover:text-white">
                {shopInfo.phoneNumber}
              </a>
            </li>
            <li>
              <a href={`mailto:${shopInfo.email}`} className="transition hover:text-white">
                {shopInfo.email}
              </a>
            </li>
            <li>{shopInfo.hours}</li>
          </ul>
          <a
            href={whatsAppLink(t("whatsappCta"))}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#20c05a]"
          >
            {t("whatsappCta")}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-os-muted lg:px-8">
        <span>
          © {new Date().getFullYear()} OPENSTYLE. {t("rights")}
        </span>
      </div>
    </footer>
  );
}
