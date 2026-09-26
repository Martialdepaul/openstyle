import { Button, Section, Text } from "react-email";
import EmailLayout from "./components/EmailLayout";
import { formatPriceFcfa } from "@/lib/currency";

export type OrderEmailItem = { name: string; quantity: number; unitPrice: number; lineTotal: number };
export type OrderEmailVariant = "received" | "confirmed" | "ready" | "shipped" | "cancelled";

const DELIVERY_METHOD_LABELS = {
  fr: { PICKUP: "Retrait en boutique", RELAY: "Point relais", SHIPPING: "Expédition" },
  en: { PICKUP: "In-store pickup", RELAY: "Relay point", SHIPPING: "Shipping" },
};

const INTROS: Record<OrderEmailVariant, { fr: string; en: string }> = {
  received: { fr: "Nous avons bien reçu votre commande.", en: "We have received your order." },
  confirmed: { fr: "Votre commande est confirmée.", en: "Your order is confirmed." },
  ready: { fr: "Votre commande est prête à récupérer.", en: "Your order is ready for pickup." },
  shipped: { fr: "Votre commande a été expédiée.", en: "Your order has been shipped." },
  cancelled: { fr: "Votre commande a été annulée.", en: "Your order has been cancelled." },
};

/** F24 : E1 (reçue), E3 (confirmée), E4 (prête/expédiée), E5 (annulée) — même contenu, section 9. */
export default function OrderStatusEmail({
  locale,
  variant,
  firstName,
  order,
  siteUrl,
}: {
  locale: "fr" | "en";
  variant: OrderEmailVariant;
  firstName: string;
  order: {
    number: string;
    items: OrderEmailItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    deliveryMethod: "PICKUP" | "RELAY" | "SHIPPING";
  };
  siteUrl: string;
}) {
  const isEn = locale === "en";
  const trackingPath = isEn ? "en/tracking" : "fr/suivi";

  return (
    <EmailLayout preview={`${isEn ? "Order" : "Commande"} ${order.number}`}>
      <Text style={{ fontSize: "16px", color: "#111111" }}>{isEn ? `Hello ${firstName},` : `Bonjour ${firstName},`}</Text>
      <Text style={{ fontSize: "14px", color: "#111111" }}>{INTROS[variant][locale]}</Text>
      <Text style={{ fontSize: "13px", color: "#6B6B6B" }}>
        {isEn ? "Order number" : "Numéro de commande"} : <strong style={{ color: "#111111" }}>{order.number}</strong>
      </Text>

      <Section style={{ marginTop: "16px" }}>
        {order.items.map((item, index) => (
          <Text key={index} style={{ fontSize: "13px", margin: "4px 0", color: "#111111" }}>
            {item.quantity} × {item.name} — {formatPriceFcfa(item.lineTotal)}
          </Text>
        ))}
      </Section>

      <Section style={{ marginTop: "12px", borderTop: "1px solid #EAEAEA", paddingTop: "12px" }}>
        <Text style={{ fontSize: "13px", margin: "2px 0", color: "#6B6B6B" }}>
          {isEn ? "Subtotal" : "Sous-total"} : {formatPriceFcfa(order.subtotal)}
        </Text>
        <Text style={{ fontSize: "13px", margin: "2px 0", color: "#6B6B6B" }}>
          {isEn ? "Delivery" : "Livraison"} ({DELIVERY_METHOD_LABELS[locale][order.deliveryMethod]}) : {formatPriceFcfa(order.deliveryFee)}
        </Text>
        <Text style={{ fontSize: "15px", fontWeight: "bold", margin: "8px 0 0", color: "#111111" }}>
          {isEn ? "Total" : "Total"} : {formatPriceFcfa(order.total)}
        </Text>
      </Section>

      <Text style={{ fontSize: "12px", color: "#6B6B6B", marginTop: "16px" }}>
        {isEn ? "Payment on delivery." : "Paiement à la réception."}
        <br />
        {isEn
          ? "Exchange possible, no refunds. Perfumes cannot be returned or exchanged."
          : "Échange possible, remboursement impossible. Les parfums ne sont ni repris ni échangés."}
      </Text>

      <Button
        href={`${siteUrl}/${trackingPath}`}
        style={{
          backgroundColor: "#111111",
          color: "#FFFFFF",
          padding: "12px 24px",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginTop: "20px",
          display: "inline-block",
        }}
      >
        {isEn ? "Track my order" : "Suivre ma commande"}
      </Button>
    </EmailLayout>
  );
}
