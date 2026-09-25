# OpenStyle — site e-commerce

Site e-commerce Next.js pour OpenStyle, boutique de prêt-à-porter à Yaoundé. Le comportement du site est défini par `docs/cahier-des-charges.md` (qui prime sur toute autre source pour le comportement) ; l'apparence vient de `design/figma-make/` (qui prime pour le visuel). Voir `docs/design-mapping.md` pour la correspondance écran ↔ fonctionnalité et `docs/decisions.md` pour les écarts et valeurs par défaut choisis en l'absence de précision dans le cahier des charges.

## Développement

- Gestionnaire de paquets : pnpm (`.mise.toml` fixe Node 22 / pnpm).
- `pnpm dev` démarre le serveur de développement Next.js.
- `pnpm build` compile en TypeScript strict ; toute erreur de type bloque le build.

## Structure du projet

- `app/[locale]/(shop)/...` — vitrine publique, routage localisé via `next-intl` (`/fr/...`, `/en/...`)
- `app/admin/...` — back-office, hors segment de langue, mise en page racine séparée (pas de header/footer/bouton WhatsApp de la vitrine)
- `messages/fr.json`, `messages/en.json` — textes de la vitrine (aucun texte en dur dans les composants)
- `messages/admin.fr.json` — textes de l'admin, français uniquement
- `prisma/` — schéma et migrations (à venir avec la couche base de données)
- `emails/` — gabarits React Email (à venir)
- `lib/pricing.ts`, `lib/delivery.ts`, `lib/orders.ts` — seuls endroits qui calculent respectivement les prix par palier, les frais de livraison et les transitions de statut/stock (à venir)
- `design/figma-make/` — **export Figma Make original, lecture seule.** Référence pour l'apparence uniquement (mise en page, classes Tailwind, jetons de design). Ne jamais l'importer depuis `app/`, ne jamais y écrire : ses données, son routage et son état sont factices. Exclu du build et du lint du projet Next.js.

## Style

Tailwind CSS v4, jetons de design documentés dans `docs/design-tokens.md` (couleurs, polices Playfair Display / Inter auto-hébergées via `next/font`, animations). Composants serveur par défaut ; `"use client"` uniquement là où il y a de l'interaction.

## Conventions

- Montants : entiers en FCFA, affichés `12 500 FCFA` (espace insécable). Jamais de décimales.
- Dates stockées en UTC, affichées en heure de Douala (UTC+1).
- Les actions serveur vérifient le rôle de l'utilisateur à chaque appel, pas seulement dans le middleware.
- Composants partagés de l'admin (`PageHeader`, `DataTable`, `StatusBadge`, `ProductLink`, `OrderLink`, `CustomerLink`) : toute mention d'un produit, d'une commande ou d'un client dans l'admin passe par ces liens, jamais par du texte simple.

## Code quality

- Utiliser des guillemets doubles pour les chaînes contenant une apostrophe (`"C'est parti"`), ou l'échapper dans une chaîne à guillemets simples.
- Balises JSX toujours fermées, accolades équilibrées.
- Exports par défaut pour les composants.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
