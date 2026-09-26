import { Resend } from "resend";
import type { ReactElement } from "react";
import { prisma } from "@/lib/db";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * F24 : domaine non vérifié dans Resend pour l'instant — l'expéditeur reste
 * celui du bac à sable Resend (`onboarding@resend.dev`), qui ne peut
 * envoyer qu'à l'adresse du compte Resend lui-même tant qu'aucun nom de
 * domaine réel n'est vérifié. À changer pour une adresse `@openstyle...`
 * dès qu'un domaine est ajouté et vérifié — voir docs/decisions.md.
 */
const FROM_ADDRESS = "OpenStyle <onboarding@resend.dev>";

export type SendEmailResult = { success: boolean; error?: string };

/**
 * Envoi non bloquant : ne lève jamais d'exception, retente une fois en cas
 * d'échec (section 9 : « un échec d'envoi ne bloque jamais l'action »).
 */
export async function sendEmail(params: { to: string; subject: string; react: ReactElement }): Promise<SendEmailResult> {
  if (!resend) {
    console.log(`[F24] RESEND_API_KEY absente — e-mail non envoyé (« ${params.subject} » → ${params.to}).`);
    return { success: false, error: "Resend non configuré." };
  }

  let lastError = "Erreur inconnue.";
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const result = await resend.emails.send({ from: FROM_ADDRESS, to: params.to, subject: params.subject, react: params.react });
      if (!result.error) return { success: true };
      lastError = result.error.message;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }
  console.log(`[F24] Échec d'envoi après deux tentatives (« ${params.subject} » → ${params.to}) : ${lastError}`);
  return { success: false, error: lastError };
}

/**
 * F18/F24 : variante pour les e-mails liés à une commande — journalise le
 * résultat comme événement `EMAIL_SENT`, visible dans l'historique de la
 * commande (section 9, critère « visible dans le détail de la commande »).
 */
export async function sendOrderEmail(params: { orderId: string; to: string; subject: string; react: ReactElement; code: string }): Promise<void> {
  const result = await sendEmail(params);
  await prisma.orderEvent.create({
    data: {
      orderId: params.orderId,
      type: "EMAIL_SENT",
      note: `${params.code} → ${params.to} : ${result.success ? "envoyé" : `échec (${result.error})`}`,
    },
  });
}
