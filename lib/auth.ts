import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { Role } from "@/generated/prisma/client";

/**
 * F12 + F08 : un seul fournisseur d'identifiants pour l'admin et les
 * clients — c'est `lib/admin-auth.ts` (`requireRole`) qui restreint l'accès
 * admin par rôle, pas ce fournisseur. Session JWT (pas de table Auth.js en
 * base : inutile pour des identifiants sans fournisseur externe).
 *
 * maxAge/updateAge approchent la déconnexion automatique après 12h
 * d'inactivité (F12) : la session expire 12h après sa dernière activité
 * suivie, le suivi étant rafraîchi au plus toutes les heures.
 */

/** F08/F12 : limite de tentatives de connexion, par e-mail, en mémoire (même limite que RG-15 côté commande). */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_ATTEMPTS_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPTS_MAX = 5;

function isLockedOut(email: string): boolean {
  const bucket = loginAttempts.get(email);
  if (!bucket || bucket.resetAt < Date.now()) return false;
  return bucket.count >= LOGIN_ATTEMPTS_MAX;
}

function registerFailedAttempt(email: string) {
  const now = Date.now();
  const bucket = loginAttempts.get(email);
  if (!bucket || bucket.resetAt < now) {
    loginAttempts.set(email, { count: 1, resetAt: now + LOGIN_ATTEMPTS_WINDOW_MS });
    return;
  }
  bucket.count += 1;
}

function clearAttempts(email: string) {
  loginAttempts.delete(email);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
    updateAge: 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;
        if (isLockedOut(email)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          registerFailedAttempt(email);
          return null;
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
          registerFailedAttempt(email);
          return null;
        }
        clearAttempts(email);

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
});
