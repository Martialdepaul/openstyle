/**
 * Fonction pure, sans dépendance serveur (Prisma) : c'est le seul module que
 * les composants client (ex. `components/cart/CartView.tsx`) peuvent
 * importer pour construire un lien WhatsApp, le numéro leur étant fourni en
 * props depuis un composant serveur (`lib/shop-settings.ts`).
 */
export function whatsAppLink(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
