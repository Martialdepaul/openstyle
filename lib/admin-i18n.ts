import { createTranslator } from "next-intl";
import messages from "@/messages/admin.fr.json";

/**
 * L'admin est hors segment de langue (section 3) et en français uniquement
 * (section 0.7) : pas besoin du routage next-intl, juste un traducteur
 * statique sur messages/admin.fr.json.
 */
export function getAdminTranslations<Namespace extends keyof typeof messages>(namespace: Namespace) {
  return createTranslator({ locale: "fr", messages, namespace });
}
