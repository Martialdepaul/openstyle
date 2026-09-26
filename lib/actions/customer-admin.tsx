"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import ProAccountDecisionEmail from "@/emails/ProAccountDecisionEmail";

/**
 * F19 : validation d'une demande de compte pro. F24 (E6) : e-mail envoyé au
 * client, dans sa langue — jamais bloquant si l'envoi échoue.
 */
export async function approveProRequest(userId: string): Promise<void> {
  const session = await requireRole("OWNER");

  const user = await prisma.user.update({
    where: { id: userId },
    data: { proStatus: "APPROVED", proDecidedAt: new Date() },
  });
  await prisma.adminLog.create({
    data: { userId: session.user.id, action: "PRO_APPROVED", entity: "User", entityId: userId },
  });
  await sendEmail({
    to: user.email,
    subject: user.locale === "en" ? "Your pro account request has been approved" : "Votre demande de compte pro a été validée",
    react: <ProAccountDecisionEmail locale={user.locale === "en" ? "en" : "fr"} firstName={user.firstName} approved />,
  });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${userId}`);
}

export async function rejectProRequest(userId: string): Promise<void> {
  const session = await requireRole("OWNER");

  const user = await prisma.user.update({
    where: { id: userId },
    data: { proStatus: "REJECTED", proDecidedAt: new Date() },
  });
  await prisma.adminLog.create({
    data: { userId: session.user.id, action: "PRO_REJECTED", entity: "User", entityId: userId },
  });
  await sendEmail({
    to: user.email,
    subject: user.locale === "en" ? "Your pro account request has been declined" : "Votre demande de compte pro a été refusée",
    react: <ProAccountDecisionEmail locale={user.locale === "en" ? "en" : "fr"} firstName={user.firstName} approved={false} />,
  });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${userId}`);
}

/** F19 : un compte pro validé peut être repassé en client détail. */
export async function revertToRetail(userId: string): Promise<void> {
  const session = await requireRole("OWNER");

  await prisma.user.update({
    where: { id: userId },
    data: { proStatus: "NONE", proDecidedAt: new Date() },
  });
  await prisma.adminLog.create({
    data: { userId: session.user.id, action: "PRO_REVERTED", entity: "User", entityId: userId },
  });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${userId}`);
}
