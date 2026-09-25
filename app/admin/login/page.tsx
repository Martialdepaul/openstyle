import { getAdminTranslations } from "@/lib/admin-i18n";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const t = getAdminTranslations("Login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-os-cream px-4">
      <div className="w-full max-w-sm bg-white p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-12" />
        </div>
        <h1 className="mb-1 text-center font-serif text-2xl font-bold">{t("title")}</h1>
        <p className="mb-6 text-center text-sm text-os-muted">{t("subtitle")}</p>
        <LoginForm labels={{ email: t("email"), password: t("password"), submit: t("submit"), error: t("error") }} />
      </div>
    </div>
  );
}
