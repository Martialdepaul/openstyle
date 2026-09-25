import { forbidden, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

/**
 * F12 : le rôle est vérifié dans chaque page ET chaque action serveur, pas
 * seulement dans un middleware — voir section 3 des conventions.
 */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireRole(...roles: Role[]) {
  const session = await requireAdminSession();
  if (!roles.includes(session.user.role)) {
    forbidden();
  }
  return session;
}
