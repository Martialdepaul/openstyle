import { Body, Container, Head, Hr, Html, Preview, Text } from "react-email";
import type { ReactNode } from "react";

/** F24 : gabarit commun à tous les e-mails (Resend + React Email, section 3). */
export default function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#F7F7F5", fontFamily: "Helvetica, Arial, sans-serif", padding: "32px 0", margin: 0 }}>
        <Container style={{ backgroundColor: "#FFFFFF", padding: "32px", maxWidth: "480px", border: "1px solid #EAEAEA" }}>
          <Text style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "2px", margin: "0 0 24px", color: "#111111" }}>
            OPENSTYLE
          </Text>
          {children}
          <Hr style={{ borderColor: "#EAEAEA", margin: "32px 0 16px" }} />
          <Text style={{ fontSize: "11px", color: "#6B6B6B", margin: 0 }}>OpenStyle — Yaoundé, Cameroun</Text>
        </Container>
      </Body>
    </Html>
  );
}
