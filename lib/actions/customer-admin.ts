"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

/**
 * F19 : validation d'une demande de compte pro. L'e-mail qui informe le
 * client (F09) nécessite Resend, non branché à ce stade — voir
 * docs/decisions.md ; journalisé côté serveur en attendant.
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
  console.log(`[F09] Compte pro validé pour ${user.email} (e-mail non envoyé, Resend non branché).`);

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
  console.log(`[F09] Compte pro refusé pour ${user.email} (e-mail non envoyé, Resend non branché).`);

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
