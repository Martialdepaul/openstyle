import { setRequestLocale } from "next-intl/server";
import CustomerLoginForm from "@/components/account/CustomerLoginForm";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:px-8">
      <CustomerLoginForm />
    </div>
  );
}
