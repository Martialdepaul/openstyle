import { useTranslations } from "next-intl";
import { getShopSettings, whatsAppLink } from "@/lib/shop-settings";

export default async function WhatsAppButton() {
  const t = useTranslations("WhatsAppButton");
  const settings = await getShopSettings();

  return (
    <a
      href={whatsAppLink(settings.whatsappNumber, t("message"))}
      target="_blank"
      rel="noreferrer"
      aria-label={t("label")}
      className="btn-press fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#20c05a] lg:bottom-8 lg:right-8"
    >
      <svg width="26" height="26" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 0C4.477 0 0 4.477 0 10c0 1.763.463 3.414 1.27 4.845L0 20l5.284-1.247A9.953 9.953 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm5.197 14.203c-.22.614-1.088 1.124-1.777 1.271-.473.1-1.09.18-3.167-.68-2.658-1.08-4.37-3.77-4.502-3.944-.13-.172-1.067-1.42-1.067-2.71 0-1.29.675-1.922.915-2.183.24-.26.522-.325.696-.325h.5c.16 0 .378-.06.59.45.22.523.74 1.812.805 1.943.065.13.108.282.02.455-.086.172-.13.28-.26.43-.13.15-.274.336-.39.452-.13.13-.266.27-.114.53.152.26.674 1.11 1.447 1.797.994.887 1.831 1.162 2.09 1.29.26.13.41.108.562-.065.152-.172.65-.758.824-1.018.173-.26.347-.217.585-.13.238.087 1.52.717 1.78.848.26.13.433.195.497.303.063.107.063.62-.158 1.236z" />
      </svg>
    </a>
  );
}
