# Jetons de design

Relevés dans `design/figma-make/src/index.css` et `design/figma-make/tailwind` (Tailwind v4 `@theme`, pas de fichier de config séparé). Portés dans `app/globals.css` sous les mêmes noms de variable, pour que les classes utilitaires (`bg-os-black`, `text-os-muted`, `font-serif`, `animate-fade-up`, ...) restent identiques entre le design et le site reconstruit.

## Couleurs

| Jeton | Valeur | Usage observé dans le design |
|---|---|---|
| `--color-os-black` | `#111111` | Texte principal, boutons pleins, fond header admin |
| `--color-os-black2` | `#1C1C1C` | État hover des boutons noirs |
| `--color-os-white` | `#FFFFFF` | Fond général |
| `--color-os-cream` | `#F7F7F5` | Fonds de section alternés, fond image produit |
| `--color-os-gray` | `#EAEAEA` | Bordures, séparateurs |
| `--color-os-muted` | `#6B6B6B` | Texte secondaire, légendes |

Le design utilise aussi ponctuellement des couleurs hors palette (vert WhatsApp `#25D366`, couleurs de statut `bg-green-100`/`bg-yellow-100`/`bg-red-100` dans l'admin mock). La cliente a demandé un rendu noir et blanc : le vert WhatsApp est conservé (convention universelle du bouton WhatsApp, hors identité visuelle du site) ; les couleurs de statut colorées de l'admin sont à revoir en niveaux de gris avec un seul accent, conformément à la consigne F18 (« Badges de statut en niveaux de gris et un seul accent pour "À relancer" ») — noté aussi dans `design-mapping.md`.

## Typographie

| Jeton | Police | Usage | Chargement |
|---|---|---|---|
| `--font-serif` | Playfair Display | Titres (`h1`-`h3`, logos texte) | `next/font/google`, auto-hébergée (le design la charge depuis Google Fonts CDN, remplacé par la règle 3.1.5) |
| `--font-sans` | Inter | Corps de texte, UI | `next/font/google`, auto-hébergée |

Graisses utilisées dans le design : Playfair Display 400/600/700/900 (+ italique 400/600), Inter 300 à 700.

## Animations

Portées telles quelles (mêmes noms, mêmes durées/courbes) dans `app/globals.css` : `fade-up`, `fade-in`, `slide-right`, `slide-left`, `scale-in`, `reveal-line`, `slide-from-right` (tiroir panier), `slide-from-left` (menu mobile), `overlay-in`, `marquee`, `shimmer`.

Classes utilitaires reprises : `.reveal` / `.reveal-left` / `.reveal-right` (+ `.visible`, via `IntersectionObserver`), `.stagger` (délais échelonnés par enfant), `.page-enter`, `.hero-label/-title/-sub/-cta/-img`, `.cart-panel`, `.menu-panel`, `.overlay-fade`, `.marquee-track`, `.img-zoom`, `.underline-reveal`, `.btn-press`, `.skeleton`.

À surveiller pour le budget de performance (section 10) : le marquee CSS et le scroll-reveal via `IntersectionObserver` sont légers et conservés tels quels ; aucun carrousel JS lourd n'est utilisé dans le design.

## Espacements, rayons, ombres, points de rupture

Le design n'utilise pas d'échelle personnalisée : espacements Tailwind par défaut, coins peu arrondis (`rounded-full` uniquement sur les badges/pastilles, sinon pas d'arrondi), pas d'ombre marquée (`shadow-sm` uniquement sur le header au scroll). Points de rupture Tailwind par défaut (`lg:` = 1024px est le point de bascule mobile/desktop principal dans le design).

## Logo

Image réelle fournie par la cliente : `design/figma-make/src/assets/attachment1.png`. Ce n'est pas un placeholder — à réutiliser telle quelle (copiée dans `public/`), pas de texte « OPENSTYLE » de repli tant que ce fichier est disponible (règle F01 : le texte de repli ne sert que si le fichier officiel manque).
