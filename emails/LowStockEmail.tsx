import { Button, Text } from "react-email";
import EmailLayout from "./components/EmailLayout";

/** F24/RG-24 : E8, alerte de stock bas — envoyée à l'OWNER, une seule fois par passage sous le seuil. */
export default function LowStockEmail({
  productName,
  variantLabel,
  stock,
  threshold,
  siteUrl,
}: {
  productName: string;
  variantLabel: string;
  stock: number;
  threshold: number;
  siteUrl: string;
}) {
  return (
    <EmailLayout preview={`Stock bas : ${productName}`}>
      <Text style={{ fontSize: "16px", color: "#111111" }}>Stock bas</Text>
      <Text style={{ fontSize: "14px", color: "#111111" }}>
        <strong>{productName}</strong>
        {variantLabel ? ` (${variantLabel})` : ""} est passé sous le seuil de stock bas ({threshold}) : il reste {stock} en stock.
      </Text>
      <Button
        href={`${siteUrl}/admin/stocks`}
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
        Voir les stocks
      </Button>
    </EmailLayout>
  );
}
