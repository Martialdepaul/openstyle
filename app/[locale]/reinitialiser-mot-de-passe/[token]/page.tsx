import { setRequestLocale } from "next-intl/server";
import ResetPasswordForm from "@/components/account/ResetPasswordForm";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <ResetPasswordForm token={token} />
    </div>
  );
}
