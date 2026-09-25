"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { redirect } from "@/i18n/navigation";

export type ResetRequestState = { sent: boolean };
export type ResetPasswordState = { error: string | null };

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure (F08)

/**
 * F08 : mot de passe oublié. Le message renvoyé est identique que l'e-mail
 * existe ou non (ne révèle jamais si une adresse est inscrite). Resend
 * n'étant pas branché (voir docs/decisions.md), le lien est journalisé côté
 * serveur au lieu d'être envoyé par e-mail — mécanisme réel, livraison
 * simulée.
 */
export async function requestPasswordReset(_prevState: ResetRequestState, formData: FormData): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const locale = String(formData.get("locale") ?? "fr") === "en" ? "en" : "fr";

  if (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.passwordResetToken.create({
        data: { userId: user.id, token, expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
      });
      const path = locale === "en" ? "reset-password" : "reinitialiser-mot-de-passe";
      // E-mail non envoyé (Resend pas branché) : lien journalisé pour rester testable manuellement.
      console.log(`[F08] Lien de réinitialisation pour ${email} (valable 1h) : /${locale}/${path}/${token}`);
    }
  }

  return { sent: true };
}

export async function resetPassword(_prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const locale = String(formData.get("locale") ?? "fr") === "en" ? "en" : "fr";

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== passwordConfirm) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "Ce lien de réinitialisation n'est plus valable. Merci d'en demander un nouveau." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  return redirect({ href: "/connexion", locale });
}
