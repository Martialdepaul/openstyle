import { setRequestLocale } from "next-intl/server";
import OrderTrackingForm from "@/components/tracking/OrderTrackingForm";

export default async function TrackingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OrderTrackingForm />;
}
