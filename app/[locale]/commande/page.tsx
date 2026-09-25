import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [relayPoints, session] = await Promise.all([
    prisma.relayPoint.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    auth(),
  ]);

  // F06 : si le client est connecté, ses coordonnées sont pré-remplies.
  const customer =
    session?.user.role === "CUSTOMER"
      ? await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { firstName: true, lastName: true, phone: true, email: true },
        })
      : null;

  return <CheckoutForm relayPoints={relayPoints} customer={customer} />;
}
