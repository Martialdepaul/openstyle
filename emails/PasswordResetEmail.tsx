import { Button, Text } from "react-email";
import EmailLayout from "./components/EmailLayout";

/** F24 : E7, réinitialisation du mot de passe (client ou compte admin) — toujours envoyée. */
export default function PasswordResetEmail({ locale, resetUrl }: { locale: "fr" | "en"; resetUrl: string }) {
  const isEn = locale === "en";
  return (
    <EmailLayout preview={isEn ? "Reset your password" : "Réinitialiser votre mot de passe"}>
      <Text style={{ fontSize: "16px", color: "#111111" }}>{isEn ? "Reset your password" : "Réinitialisation du mot de passe"}</Text>
      <Text style={{ fontSize: "14px", color: "#111111" }}>
        {isEn
          ? "Click the button below to choose a new password. This link is valid for 1 hour."
          : "Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable 1 heure."}
      </Text>
      <Button
        href={resetUrl}
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
        {isEn ? "Reset password" : "Réinitialiser"}
      </Button>
      <Text style={{ fontSize: "12px", color: "#6B6B6B", marginTop: "16px" }}>
        {isEn ? "If you did not request this, you can ignore this email." : "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail."}
      </Text>
    </EmailLayout>
  );
}
