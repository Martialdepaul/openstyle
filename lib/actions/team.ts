"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import type { Role } from "@/generated/prisma/client";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure, même durée que F08.

function isAdminRole(role: string): role is Extract<Role, "OWNER" | "MANAGER"> {
  return role === "OWNER" || role === "MANAGER";
}

async function activeOwnerCount(excludeUserId?: string): Promise<number> {
  return prisma.user.count({
    where: { role: "OWNER", isActive: true, id: excludeUserId ? { not: excludeUserId } : undefined },
  });
}

/**
 * F12 : création d'un compte OWNER/MANAGER. Aucun mot de passe n'est
 * transmis en clair : un mot de passe aléatoire inutilisable est généré,
 * puis un lien de réinitialisation est journalisé (même limite que F08,
 * Resend non branché — voir docs/decisions.md), pour que le nouvel admin
 * choisisse lui-même son mot de passe.
 */
export async function createAdminAccount(formData: FormData): Promise<void> {
  const session = await requireRole("OWNER");

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");

  if (!firstName || !lastName || !email) {
    throw new Error("Le prénom, le nom et l'e-mail sont obligatoires.");
  }
  if (!isAdminRole(role)) {
    throw new Error("Le rôle doit être Gérante (OWNER) ou Gestionnaire (MANAGER).");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Un compte existe déjà avec cet e-mail.");
  }

  const randomPassword = crypto.randomBytes(24).toString("hex");
  const passwordHash = await bcrypt.hash(randomPassword, 10);

  const user = await prisma.user.create({
    data: { firstName, lastName, email, passwordHash, role, isActive: true },
  });

  await prisma.adminLog.create({
    data: { userId: session.user.id, action: "ADMIN_CREATED", entity: "User", entityId: user.id },
  });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
  });
  console.log(`[F12] Compte admin créé pour ${email} — lien pour choisir un mot de passe (valable 1h) : /fr/reinitialiser-mot-de-passe/${token}`);

  revalidatePath("/admin/equipe");
}

/** F12 : impossible de changer le rôle si ça retirerait le dernier OWNER actif. */
export async function changeAdminRole(userId: string, formData: FormData): Promise<{ error?: string }> {
  const session = await requireRole("OWNER");

  const role = String(formData.get("role") ?? "");
  if (!isAdminRole(role)) return { error: "Rôle invalide." };

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || !isAdminRole(target.role)) return { error: "Compte introuvable." };

  if (target.role === "OWNER" && role !== "OWNER" && (await activeOwnerCount(userId)) === 0) {
    return { error: "Impossible de retirer le dernier OWNER." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  await prisma.adminLog.create({
    data: { userId: session.user.id, action: "ROLE_CHANGED", entity: "User", entityId: userId },
  });

  revalidatePath("/admin/equipe");
  return {};
}

/** F12 : un OWNER ne peut ni se désactiver lui-même ni désactiver le dernier OWNER actif. */
export async function toggleAdminActive(userId: string): Promise<{ error?: string }> {
  const session = await requireRole("OWNER");

  if (userId === session.user.id) {
    return { error: "Vous ne pouvez pas désactiver votre propre compte." };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || !isAdminRole(target.role)) return { error: "Compte introuvable." };

  if (target.isActive && target.role === "OWNER" && (await activeOwnerCount(userId)) === 0) {
    return { error: "Impossible de désactiver le dernier OWNER." };
  }

  await prisma.user.update({ where: { id: userId }, data: { isActive: !target.isActive } });
  await prisma.adminLog.create({
    data: {
      userId: session.user.id,
      action: target.isActive ? "ADMIN_DEACTIVATED" : "ADMIN_REACTIVATED",
      entity: "User",
      entityId: userId,
    },
  });

  revalidatePath("/admin/equipe");
  return {};
}

/** F12 : envoyer un lien de réinitialisation du mot de passe à un membre de l'équipe. */
export async function sendAdminResetLink(userId: string): Promise<{ error?: string }> {
  await requireRole("OWNER");

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || !isAdminRole(target.role)) return { error: "Compte introuvable." };

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { userId: target.id, token, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
  });
  console.log(`[F12] Lien de réinitialisation pour ${target.email} (valable 1h) : /fr/reinitialiser-mot-de-passe/${token}`);

  return {};
}
