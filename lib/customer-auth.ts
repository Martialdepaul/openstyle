import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import type { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

/**
 * F08 : l'espace client est réservé aux comptes CUSTOMER. Un compte
 * OWNER/MANAGER connecté à l'admin ne doit pas se retrouver dans l'espace
 * client avec ses propres données affichées comme si c'était un client.
 */
export async function requireCustomerSession(locale: Locale) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CUSTOMER") {
    return redirect({ href: "/connexion", locale });
  }
  return session;
}
