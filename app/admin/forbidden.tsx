import Link from "next/link";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default function AdminForbidden() {
  const t = getAdminTranslations("Forbidden");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
      <p className="font-serif text-5xl font-bold">{t("title")}</p>
      <p className="text-sm text-[#6B6B6B]">{t("message")}</p>
      <Link href="/admin" className="text-sm underline">
        {t("back")}
      </Link>
    </div>
  );
}
