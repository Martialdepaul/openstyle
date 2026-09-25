import { setRequestLocale } from "next-intl/server";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <ForgotPasswordForm />
    </div>
  );
}
