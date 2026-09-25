"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import { auth, signIn, signOut } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { isValidCameroonPhone } from "@/lib/orders";

export type AuthFormState = { error: string | null };

const INVALID_CREDENTIALS_ERROR = "E-mail ou mot de passe incorrect, ou trop de tentatives récentes.";

/**
 * F08 : inscription (prénom, nom, e-mail, mot de passe, téléphone
 * facultatif). RG : mot de passe de 8 caractères minimum, jamais journalisé
 * (jamais passé à console.log/throw). F09 : case "Je suis un professionnel"
 * -> proStatus = PENDING dès la création.
 */
export async function registerCustomer(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const isPro = formData.get("isPro") === "on";
  const shopName = String(formData.get("shopName") ?? "").trim();
  const proCity = String(formData.get("proCity") ?? "").trim();
  const proPhone = String(formData.get("proPhone") ?? "").trim();
  const locale = String(formData.get("locale") ?? "fr") === "en" ? "en" : "fr";

  if (!firstName || !lastName || !email) {
    return { error: "Merci de renseigner le prénom, le nom et l'e-mail." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse e-mail invalide." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (phone && !isValidCameroonPhone(phone)) {
    return { error: "Le téléphone doit être un numéro camerounais valide (9 chiffres commençant par 6 ou 2)." };
  }
  if (isPro && (!shopName || !proCity || !proPhone)) {
    return { error: "Merci de renseigner le nom de la boutique, la ville et le téléphone professionnel." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet e-mail." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      phone: phone || null,
      locale,
      proStatus: isPro ? "PENDING" : "NONE",
      shopName: isPro ? shopName : null,
      proCity: isPro ? proCity : null,
      proPhone: isPro ? proPhone : null,
    },
  });

  return finishSignIn(email, password, locale);
}

export async function loginCustomer(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const locale = String(formData.get("locale") ?? "fr") === "en" ? "en" : "fr";

  if (!email || !password) {
    return { error: "Merci de renseigner l'e-mail et le mot de passe." };
  }

  return finishSignIn(email, password, locale);
}

/**
 * `signIn("credentials", { redirect: false })` ne rejette pas une promesse en
 * cas d'identifiants invalides (`authorize()` a simplement renvoyé `null`) —
 * il ne lève que pour une erreur de configuration/réseau imprévue. La seule
 * façon fiable de savoir si la connexion a réellement réussi est de relire
 * la session juste après.
 */
async function finishSignIn(email: string, password: string, locale: "fr" | "en"): Promise<AuthFormState> {
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: INVALID_CREDENTIALS_ERROR };
    }
    throw error;
  }

  // Un compte OWNER/MANAGER existe mais ne doit pas passer par cette porte (F12 reste la voie admin).
  const session = await auth();
  if (!session || session.user.role !== "CUSTOMER") {
    await signOut({ redirect: false });
    return { error: INVALID_CREDENTIALS_ERROR };
  }

  return redirect({ href: "/compte", locale });
}

export async function logoutCustomer(locale: "fr" | "en"): Promise<void> {
  await signOut({ redirect: false });
  return redirect({ href: "/", locale });
}
