/**
 * Coordonnées de la boutique. Valeurs de substitution en attendant le
 * réglage `Setting` (F22, nécessite Prisma). Le numéro WhatsApp repris de
 * l'export Figma Make est un indicatif tunisien factice, PAS le vrai numéro
 * de la cliente — voir docs/decisions.md. Ne jamais le présenter comme réel.
 */
export const shopInfo = {
  whatsappNumber: "216656356687",
  phoneNumber: "+216656356687",
  address: "Yaoundé, Mokolo, Elobi — Centre commercial Dubaï Market",
  hours: "08h00 – 18h30",
  email: "Openstyle911@gmail.com",
  social: {
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
    tiktok: undefined as string | undefined,
  },
};

export function whatsAppLink(message: string): string {
  return `https://wa.me/${shopInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
