import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });

// F01/8.1 : l'admin n'est jamais indexé.
export const metadata: Metadata = {
  title: "Administration — OPENSTYLE",
  robots: { index: false, follow: false },
};

/**
 * Racine séparée de la vitrine (section 3 : app/admin/... hors segment de
 * langue, sa propre mise en page racine — pas d'en-tête/pied de page/bouton
 * WhatsApp de la vitrine). C'est la deuxième racine <html> du projet, à côté
 * de app/[locale]/layout.tsx — pattern « multiple root layouts » de Next.js.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="bg-os-cream text-os-black">{children}</body>
    </html>
  );
}
