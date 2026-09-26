import { Button, Text } from "react-email";
import EmailLayout from "./components/EmailLayout";
import { formatPriceFcfa } from "@/lib/currency";

/** F24 : E2, notification de nouvelle commande à la boutique — toujours envoyée, français uniquement. */
export default function NewOrderNotificationEmail({
  order,
  siteUrl,
}: {
  order: { id: string; number: string; firstName: string; lastName: string; phone: string; total: number };
  siteUrl: string;
}) {
  return (
    <EmailLayout preview={`Nouvelle commande ${order.number}`}>
      <Text style={{ fontSize: "16px", color: "#111111" }}>Nouvelle commande reçue.</Text>
      <Text style={{ fontSize: "13px", color: "#111111" }}>
        <strong>{order.number}</strong> — {order.firstName} {order.lastName} ({order.phone})
      </Text>
      <Text style={{ fontSize: "15px", fontWeight: "bold", color: "#111111" }}>Total : {formatPriceFcfa(order.total)}</Text>
      <Button
        href={`${siteUrl}/admin/commandes/${order.id}`}
        style={{
          backgroundColor: "#111111",
          color: "#FFFFFF",
          padding: "12px 24px",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginTop: "16px",
          display: "inline-block",
        }}
      >
        Voir la commande
      </Button>
    </EmailLayout>
  );
}
