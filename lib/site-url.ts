/**
 * F11 (SEO) : section 11 du cahier des charges n'a jamais été reçue (voir
 * docs/decisions.md, "Cahier des charges incomplet") — pas de domaine
 * imposé. Valeur par défaut la plus simple : l'URL de déploiement Vercel
 * (fournie automatiquement, sans configuration), remplaçable par un
 * réglage `SITE_URL` explicite dès qu'un nom de domaine personnalisé existe.
 */
export function getSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
