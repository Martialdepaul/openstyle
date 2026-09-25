import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Images de démonstration (prisma/seed.ts, Unsplash), à retirer avec
    // le vrai pipeline d'images (F14, Vercel Blob/R2 + sharp).
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    // Active forbidden() / unauthorized() (next/navigation) pour F12 :
    // un rôle non autorisé sur une page admin doit renvoyer une vraie 403.
    authInterrupts: true,
  },
};

export default withNextIntl(nextConfig);
