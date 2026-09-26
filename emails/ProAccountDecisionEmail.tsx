import { Text } from "react-email";
import EmailLayout from "./components/EmailLayout";

/** F24 : E6, validation ou refus d'un compte pro — toujours envoyée. */
export default function ProAccountDecisionEmail({
  locale,
  firstName,
  approved,
  reason,
}: {
  locale: "fr" | "en";
  firstName: string;
  approved: boolean;
  reason?: string | null;
}) {
  const isEn = locale === "en";
  return (
    <EmailLayout preview={isEn ? "Your pro account request" : "Votre demande de compte pro"}>
      <Text style={{ fontSize: "16px", color: "#111111" }}>{isEn ? `Hello ${firstName},` : `Bonjour ${firstName},`}</Text>
      <Text style={{ fontSize: "14px", color: "#111111" }}>
        {approved
          ? isEn
            ? "Your professional account request has been approved. You now see wholesale pricing on the shop."
            : "Votre demande de compte professionnel a été validée. Vous voyez désormais les prix de palier sur la boutique."
          : isEn
            ? "Your professional account request has been declined."
            : "Votre demande de compte professionnel a été refusée."}
      </Text>
      {!approved && reason && <Text style={{ fontSize: "13px", color: "#6B6B6B" }}>{reason}</Text>}
    </EmailLayout>
  );
}
