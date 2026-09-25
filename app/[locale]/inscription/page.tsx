import { setRequestLocale } from "next-intl/server";
import RegisterForm from "@/components/account/RegisterForm";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <RegisterForm />
    </div>
  );
}
