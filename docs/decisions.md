# Décisions et valeurs par défaut

Journal des points non couverts par le cahier des charges (ou couverts par un document reçu incomplet), avec la valeur par défaut retenue — conformément à la consigne 0.5.

## Cahier des charges incomplet

**Constat.** Le texte reçu s'arrête en plein milieu de la section 10 (Performance). Manquent : la fin de la section 10, la section 11 (SEO et partage), la section 12 (ordre des jalons), la section 13 (hors périmètre), la section 14 (textes de marque).

**Décision.** Tant que ces sections ne sont pas fournies :
- Le travail se limite à J0 (méthode d'intégration du design, section 3.1) et au début de F02 (page d'accueil), qui ne dépendent pas de l'ordre des jalons.
- F03 à F24, Prisma/Auth.js/Resend, et tout ce qui nécessite de connaître le périmètre exact (section 13) ou l'ordre (section 12) sont reportés.
- Les textes de marque nécessaires dans l'intervalle (slogan, description courte) sont ceux déjà donnés ailleurs dans le document reçu (ex. slogan « Un style qui s'accorde à votre identité », section 7 F02) — rien n'est inventé au-delà de ce qui est explicitement fourni.

**Impact.** À réévaluer dès réception des sections manquantes.

## Numéro WhatsApp, adresse, horaires

**Constat.** L'export Figma Make code en dur un numéro `+216 656 356 687` (indicatif tunisien, pas camerounais) dans Header, Footer, ProductCard, Product, Checkout et Account, ainsi qu'une adresse ("Yaoundé, Mokolo, Elobi — Centre commercial Dubaï Market", cohérente avec la section 1 du cahier des charges) et des horaires ("08h00 – 18h30").

**Décision.** Ces valeurs ne sont pas codées en dur dans les composants : elles viennent d'un point central (`lib/shop-info.ts`), en attendant le réglage `Setting` de F22. Le numéro WhatsApp/téléphone est désormais le vrai numéro camerounais de la boutique (`+237 656 356 687`, fourni par la cliente) — mis à jour, ce n'est plus le placeholder tunisien de l'export Figma Make. L'adresse et les horaires restent ceux de l'export (déjà cohérents avec la section 1 du cahier des charges), à confirmer par la cliente à l'occasion.

**Impact.** Numéro corrigé. Reste à remplacer définitivement par le réglage `Setting` quand F22 sera fait, et à confirmer l'adresse/les horaires avec la cliente si besoin.

## Données de démonstration pour F02 (avant Prisma)

**Constat.** Aucune base de données n'est branchée à ce stade (Prisma vient avec une fonctionnalité ultérieure, une fois l'ordre des jalons connu).

**Décision.** Un fichier `lib/demo-data.ts` porte un jeu de produits/catégories de démonstration, séparé du composant, pour permettre de voir et vérifier l'écran d'accueil. Il est explicitement temporaire.

**Impact.** À supprimer dès que la couche Prisma/produits réelle est branchée ; ne doit jamais être importé depuis une page d'admin ou une logique de prix/stock.

## Pagination "par curseur" de F03, avant Prisma

**Constat.** F03 demande une pagination par curseur (24 produits/page, bouton "Voir plus"). Sans base de données, il n'y a pas de vrai curseur (identifiant du dernier élément) à faire suivre.

**Décision.** `lib/shop-filters.ts` utilise un compteur `nb` dans l'URL (nombre d'éléments actuellement affichés, +24 à chaque clic sur "Voir plus"), qui produit le même comportement visible (pas de défilement infini, chargement progressif) sans curseur réel.

**Impact.** À remplacer par une vraie pagination par curseur (`cursor` sur l'identifiant du dernier produit, requête Prisma `take`/`skip` ou `cursor`) dès que la base de données est branchée ; le paramètre d'URL `nb` disparaîtra au profit d'un paramètre `apres` (ou équivalent) tenant l'identifiant.

## Galerie et stock par variante (F04), avant Prisma

**Constat.** F04 demande une galerie de 5 photos et des combinaisons de variantes grisées selon leur stock propre. Les données de démonstration n'ont qu'une photo par produit et un seul indicateur `inStock` au niveau du produit (pas par combinaison taille/couleur/parfum, qui n'existe qu'au niveau du futur modèle `Variant`).

**Décision.** La fiche produit affiche une seule photo (pas de vignettes/zoom/glissement tactile, qui n'auraient rien à faire défiler). La quantité est plafonnée à 10 de façon arbitraire quand le produit est en stock ; aucune combinaison n'est grisée individuellement, tout le produit est simplement bloqué si `inStock` est faux.

**Impact.** À refaire entièrement une fois `Variant` branché : vraie galerie (jusqu'à 5 photos), stock et quantité maximale par combinaison, combinaisons épuisées grisées (RG-23).

## Création de produit sans photos (F14, provisoire)

**Constat.** F14 prévoit un envoi de photos avec compression navigateur puis génération serveur de 3 tailles WebP (sharp) et stockage Vercel Blob/Cloudflare R2 — infrastructure non montée à ce stade (pas de compte de stockage).

**Décision.** `/admin/produits/nouveau` crée le produit (infos, prix, badges, variantes) sans gestion de photos pour l'instant. Le produit reste en `DRAFT` (cohérent avec la règle « un produit sans photo ne peut pas être publié ») jusqu'à ce que l'onglet Photos soit construit.

**Impact.** À compléter dès que le stockage d'images (F14) est en place : ajout de l'onglet Photos sur la fiche produit, puis seulement la publication redeviendra possible pour les produits créés ainsi.

## Chemin localisé de "/commande"

**Constat.** F06 (commande) n'a pas de chemin localisé donné en exemple par F01.

**Décision.** `/commande` en français, `/checkout` en anglais — déclaré dans `i18n/routing.ts` dès maintenant (F05 y renvoie le bouton "Passer la commande") même si la page F06 elle-même n'est pas encore construite ; elle renverra 404 jusqu'à ce jalon.

**Impact.** Mineur, à ajuster si la cliente préfère un autre libellé.

## Chemin localisé de la fiche produit

**Constat.** F04 ne précise pas de chemin localisé pour la fiche produit (contrairement à `/boutique`↔`/shop`, `/panier`↔`/cart`, `/suivi`↔`/tracking` donnés en exemple par F01).

**Décision.** `/produit/[slug]` en français, `/product/[slug]` en anglais — traduction littérale, cohérente avec la convention observée ailleurs.

**Impact.** Mineur, à ajuster si la cliente préfère un autre libellé.

## Chemin localisé de "/nouveautes"

**Constat.** F01 donne des exemples de chemins localisés (`/fr/boutique` ↔ `/en/shop`, `/fr/panier` ↔ `/en/cart`, `/fr/suivi` ↔ `/en/tracking`) mais pas pour `/nouveautes` (liste prédéfinie des nouveautés, F03).

**Décision.** Traduction littérale simple : `/en/new-arrivals`. `/promotions` reste identique dans les deux langues (mot déjà anglais).

**Impact.** Mineur, cohérent avec la convention observée ; à ajuster si la cliente préfère un autre libellé.

## Commande (F06), avant comptes clients/pro et Resend

**Constat.** F06 dépend de plusieurs éléments qui n'existent pas encore : comptes clients et paliers pro validés (F08/F09), envoi d'e-mail de confirmation E1 (Resend, section 9), grille officielle des zones de livraison et des points relais (F20, remplie par la gérante), liste officielle des villes du Cameroun.

**Décisions :**

- ~~Le palier de prix est toujours `RETAIL`~~ — mis à jour avec F08/F09 : le palier dépend désormais du statut pro réel du client connecté (voir plus bas).
- Zones de livraison : le découpage (Yaoundé ; Douala, Edéa, Bafoussam, Kribi, Limbé ; Autres villes) vient directement de F20 ; les frais restent à 0 tant que la gérante ne les a pas saisis (F20, pas encore construit), conformément au texte reçu. Points relais : 2 points de démonstration à Yaoundé (`prisma/seed.ts`), coordonnées factices en attendant F20.
- Liste des villes du formulaire : liste indicative des villes principales du Cameroun avec saisie libre en repli (« Autre »), pas de source officielle fournie.
- L'e-mail E1 (confirmation) n'est pas envoyé : Resend n'est pas encore configuré. La commande est créée normalement, seul l'envoi d'e-mail est un no-op documenté dans `lib/actions/order.ts`.
- RG-15 (limite de débit par IP) : compteur en mémoire dans `lib/actions/order.ts`, propre à l'instance de serveur — suffisant en développement mono-instance, à remplacer par un magasin partagé (Upstash/Redis) avant une mise en ligne multi-instance.
- « Un double clic ne crée pas deux commandes » : le bouton d'envoi se désactive pendant la soumission (`useFormStatus`), sans clé d'idempotence en base. Suffisant pour un usage normal (un seul clic physique) ; deux requêtes strictement simultanées depuis deux onglets resteraient possibles mais hors du scénario visé par le critère d'acceptation.

**Impact.** À revoir quand F08/F09 (comptes pro), F20 (livraison) et Resend seront construits.

## Comptes clients (F08), compte professionnel (F09), admin clients (F19)

**Constat.** Ces trois fonctionnalités sont liées (F19 n'a de vraies données qu'avec F08/F09) et dépendent toutes de Resend (non branché) pour les e-mails prévus par le texte (confirmation d'inscription implicite, lien de réinitialisation, notification de validation/refus pro).

**Décisions :**

- Chemins localisés (aucun exemple donné par F01) : `/inscription` (`/register`), `/connexion` (`/login`), `/compte` (`/account`), `/compte/commandes/[numero]` (`/account/orders/[numero]`), `/mot-de-passe-oublie` (`/forgot-password`), `/reinitialiser-mot-de-passe/[token]` (`/reset-password/[token]`).
- Connexion par e-mail (pas « téléphone ou e-mail » comme le suggère l'export Figma Make) : le téléphone est facultatif à l'inscription, l'e-mail est le seul identifiant garanti présent.
- Un seul fournisseur d'identifiants (Auth.js) sert l'admin et l'espace client ; `lib/admin-auth.ts` (`requireRole`) et `lib/customer-auth.ts` (`requireCustomerSession`) filtrent chacun par rôle à l'entrée de leur zone. Un compte OWNER/MANAGER ne peut pas atteindre `/compte` avec ses propres données affichées comme celles d'un client (redirigé vers `/connexion`) ; un compte CUSTOMER ne peut pas atteindre `/admin` (`forbidden()`).
- Mot de passe oublié : le mécanisme est réel (jeton à usage unique, valable 1 heure, en base), mais l'e-mail n'est pas envoyé (Resend non branché) — le lien est journalisé côté serveur (`console.log`) pour rester testable manuellement. Même limite pour l'e-mail de validation/refus pro (F09).
- Limite de tentatives de connexion (RG F08) : compteur en mémoire par e-mail dans `lib/auth.ts` (5 tentatives / 15 minutes), même mécanisme que les autres limites de débit du projet (RG-15, F07) — pas de magasin partagé, à revoir avant une mise en ligne multi-instance.
- RG-03 réellement appliquée depuis ce lot : le palier d'une commande dépend du statut pro du compte connecté (`proStatus = APPROVED`) au moment de la commande, plus la quantité totale. Un visiteur ou un client détail garde toujours le prix de détail.
- **Reste hors de ce lot (F09)** : l'affichage du tableau de paliers sur la fiche produit et le panier pour un compte pro validé (F04/F05/F06, critère RG-06 sur l'absence de prix de gros dans le HTML servi à un visiteur — déjà respecté aujourd'hui puisque ces prix ne sont affichés nulle part encore, mais l'affichage réel pour un pro reste à construire). Le lien « Devenir client pro » renvoie vers `/inscription` (case à cocher) partout, y compris pour un visiteur déjà connecté — pas encore de variante « demande depuis le compte » pré-remplie.
- F19 : liste des clients et onglet « Demandes pro » avec recherche, validation/refus créant un `AdminLog` (`PRO_APPROVED`/`PRO_REJECTED`/`PRO_REVERTED`). Réservé à l'OWNER, comme prévu par la section 8.1.

**Impact.** À corriger dès que Resend est branché (e-mails F08/F09/E1-E3) ; à compléter avec l'affichage des tarifs de palier une fois F04/F05/F06 repris pour les comptes pro.

## Commandes (F18), portée de ce lot

**Constat.** F18 couvre la liste, la fiche détail et plusieurs actions (statut, contact, paiement, note interne). Deux sous-parties restent plus lourdes : la modification des lignes d'une commande `NEW` (RG-11, implique de recalculer prix/palier/frais comme au moment de la commande) et le reçu imprimable (F18, feuille de style d'impression dédiée).

**Décision.** Ce lot construit : liste avec recherche/filtres/tri, fiche détail (lignes avec lien produit, livraison, historique non modifiable), changement de statut réel avec RG-09/10/12 (transitions autorisées, décompte du stock à la confirmation avec refus propre si stock insuffisant, remise en stock à l'annulation après confirmation), tentative de contact (RG-13), état du paiement (RG-16), note interne. La modification des lignes et le reçu imprimable sont reportés.

**Impact.** À compléter avec RG-11 et le reçu imprimable dans un lot suivant. Les e-mails de suivi (E2/E3) ne partent pas : Resend n'est pas branché (même limite que F06).

## Catégories (F16), livraison (F20), contenus (F21)

**Constat.** Ces trois écrans admin gèrent des données déjà présentes en base (catégories, zones/points relais, pages/FAQ/témoignages/bannières) mais jusque-là seulement modifiables via `prisma/seed.ts`.

**Décisions :**

- F16 : suppression autorisée seulement si la catégorie ne contient aucun produit et n'a aucune sous-catégorie (sinon désactivation forcée, texte d'erreur explicite) — le modèle `Category` n'a pas de champ dédié à une suppression différée, ce contrôle suffit.
- F20 : le texte du délai de livraison (ex. « 2 jours ») est enregistré comme réglage (`Setting`, clé `deliveryDelayText`). Affiché depuis F10 sur la page publique `/livraison-retrait` ; **toujours pas repris dans le récapitulatif de commande (F06)**, qui garde un texte statique par mode de livraison — à brancher quand F22 (paramètres) sera repris dans son ensemble.
- F21 : le contenu des pages (F10) est nettoyé avant enregistrement avec `sanitize-html` (balises limitées à `h2/h3/p/ul/ol/li/strong/em/a/br`, aucun script), conformément au critère « aucun script accepté ». L'aperçu dans l'admin affiche le HTML tel que tapé (avant nettoyage serveur) — acceptable car c'est un aperçu de la gérante pour elle-même dans son propre navigateur, jamais exposé à un visiteur.
- F21 : les 6 pages de contenu gérées (à-propos, contact, livraison et retrait, conditions de vente, confidentialité, mentions légales) correspondent à la liste de F10, désormais affichées sur des routes publiques (voir section F10 ci-dessous). Le lien « Voir sur le site » reste réservé aux témoignages et bannières dans l'admin contenus — à étendre aux pages/FAQ dans un lot suivant.

**Impact.** Reste à relier : le texte du délai de livraison dans le récapitulatif de commande (F06, avec F22).

## Pages de contenu publiques (F10)

**Constat.** Les 6 pages `Page` (à-propos, contact, livraison et retrait, conditions de vente, confidentialité, mentions légales) et la FAQ (`FaqItem`) étaient éditables dans l'admin (F21) mais n'avaient aucune route publique.

**Décision.**

- Chemins localisés ajoutés à `i18n/routing.ts` (aucun exemple donné par F01) : `/a-propos` (`/about`), `/contact` (identique), `/livraison-retrait` (`/delivery`), `/faq` (identique), `/conditions-vente` (`/terms`), `/confidentialite` (`/privacy`), `/mentions-legales` (`/legal`).
- Le HTML de `Page.bodyFr`/`bodyEn` est injecté tel quel (`dangerouslySetInnerHTML`) : sans risque, puisqu'il est déjà nettoyé par `sanitize-html` avant d'être enregistré (F21) et que seul un admin peut l'écrire.
- `/contact` ajoute des boutons Appeler/WhatsApp réels (pas de formulaire, conformément à F10) au-dessus du contenu `Page`.
- `/livraison-retrait` ajoute un tableau des zones/frais réels (`DeliveryZone`) et le texte du délai de livraison (`Setting`), en plus du contenu `Page` — répond au critère d'acceptation F10 (« le texte de la page Livraison reprend les zones et les frais saisis dans l'admin »).
- `/faq` liste les `FaqItem` dans un accordéon natif `<details>`/`<summary>` (pas de composant client, pas de JavaScript nécessaire).
- Pied de page (`components/Footer.tsx`) : colonne "Informations" ajoutée (À propos, Contact, FAQ, Livraison) et liens légaux (CGV, Confidentialité, Mentions légales) ajoutés à la ligne de copyright.

**Impact.** F10 fait. Reste hors de ce lot : le lien « Modifier dans l'admin » sur ces pages pour un admin connecté (section 8.1) et le lien « Voir sur le site » correspondant dans `/admin/contenus`.

## Données de démonstration partout (boutique et admin), sur demande explicite

**Constat.** Le développement se poursuit sur plusieurs jalons encore. La cliente doit pouvoir visualiser dès maintenant une plateforme qui donne l'impression d'être terminée — boutique ET admin remplis de données réalistes — plutôt que des écrans vides en attendant les jalons restants.

**Décision.** `prisma/seed.ts` a été étoffé sur demande explicite pour peupler l'ensemble du site :
- 6 comptes clients de démonstration (`prisma/seed.ts`), un statut pro par valeur possible (`NONE`, `PENDING`, `APPROVED`, `REJECTED`) pour que F19 (admin clients) ne soit jamais vide. Mot de passe commun `Client2026!`, à usage de démonstration uniquement.
- 16 commandes de démonstration couvrant tous les statuts (`NEW` avec et sans relance, `CONFIRMED`, `READY`, `SHIPPED`, `DELIVERED`, `CANCELLED`), certaines rattachées aux comptes de démonstration, une commande au palier gros pour illustrer RG-03 pour un compte pro validé. Le stock et les mouvements (`StockMovement`) sont décomptés exactement comme le ferait une vraie confirmation (RG-10), pour que les chiffres restent cohérents entre eux.
- FAQ (5 questions), témoignages (5) et bannières (3) supplémentaires ; les 6 pages de contenu (F10/F21) reçoivent un texte de départ réaliste en FR et EN.
- **Revirement assumé sur les frais de livraison** : une décision précédente de ce journal fixait les frais des zones à 0 « tant que la cliente ne les a pas donnés », en application stricte du texte reçu. Sur cette demande explicite de données démonstratives partout, les frais sont désormais des montants réalistes (1 500 à 8 500 FCFA selon la zone et le palier) — clairement fictifs, à remplacer par les vrais montants de la cliente avant mise en ligne.
- Une sous-catégorie (« Robes », sous « Vêtements ») a été ajoutée pour illustrer la hiérarchie à deux niveaux de F16, avec un produit existant reclassé dedans.

**Impact.** Toutes ces données sont explicitement fictives (noms, boutiques, montants de livraison, avis clients) et devront être retirées ou remplacées avant une mise en ligne réelle — notamment les comptes de démonstration (mot de passe partagé) et les frais de livraison. `prisma/seed.ts` reste le point d'entrée unique pour regénérer ou ajuster ce jeu de données.

## Migration de SQLite vers PostgreSQL (Neon), mise en ligne

**Constat.** Le développement a démarré sur SQLite en local (voir plus haut dans ce journal). Au moment de mettre le projet sur GitHub/Vercel, il fallait basculer sur la vraie base prévue par le cahier des charges (PostgreSQL, hébergée sur Neon) — SQLite ne fonctionne pas sur l'infrastructure serverless de Vercel (système de fichiers non persistant).

**Décision.**

- `prisma/schema.prisma` : `datasource` en `postgresql`. `DeliveryZone.cities` est redevenu un vrai `String[]` (ce n'était une chaîne séparée par des virgules que par limitation de SQLite).
- `lib/db.ts` et `prisma/seed.ts` : adaptateur `@prisma/adapter-pg` (`pg`) à la place de `@prisma/adapter-better-sqlite3`. Ces deux fichiers restent les seuls endroits qui connaissent l'existence d'un adaptateur.
- Les migrations SQLite (`prisma/migrations/`) ont été supprimées et regénérées depuis zéro pour PostgreSQL (le SQL généré par Prisma dépend du moteur ; les anciennes migrations n'étaient pas rejouables sur Postgres). Une seule migration initiale désormais.
- Dépendances `better-sqlite3` et `@prisma/adapter-better-sqlite3` retirées (plus utilisées, et évitent un module natif à compiler sur Vercel).
- `dotenv` manquait comme dépendance directe (seed.ts en a besoin pour charger `.env` hors du CLI Prisma) — ajouté.
- **RG-14 non pleinement respectée** : le numéro de commande (`OS-000123`) est toujours généré par comptage (`prisma/orders.ts`), pas par une vraie séquence Postgres atomique comme demandé par le texte. Fonctionne correctement en usage normal, mais deux commandes créées à la même milliseconde pourraient théoriquement obtenir le même numéro. À corriger avec une vraie séquence SQL avant un trafic réel.
- Avertissement bénin au démarrage (`pg-connection-string`) sur le mode SSL `require` — sans impact aujourd'hui, deviendra pertinent avec une future version majeure de `pg` (voir le message dans les journaux).

**Impact.** La base de données de développement local et celle utilisée par Vercel sont désormais la même instance Neon (aucune base locale distincte) — toute donnée de test ajoutée en local (y compris via le seed) est visible en production tant qu'une base dédiée par environnement n'est pas mise en place.

## Paramètres de la boutique (F22)

**Constat.** Les coordonnées de la boutique (numéro WhatsApp, téléphone, adresse, horaires, e-mail, liens sociaux) et les seuils de paliers/stock bas étaient codés en dur dans `lib/shop-info.ts` et `lib/pricing.ts`, en attendant ce lot.

**Décision.**

- `lib/shop-info.ts` est retiré. `lib/shop-settings.ts` porte désormais un seul réglage `Setting` (clé `shopSettings`, un objet JSON) avec toutes les valeurs de coordonnées + les seuils de paliers (RG-02) + le seuil de stock bas par défaut appliqué aux nouvelles variantes (RG-24). `getShopSettings()` fusionne les valeurs enregistrées avec des valeurs par défaut (les anciennes valeurs codées en dur), pour rester robuste si un champ est ajouté plus tard sans avoir encore été enregistré.
- `/admin/parametres` (déjà présent dans le menu, jusque-là 404) : formulaire unique, réservé à l'OWNER (section 4). Le texte du délai de livraison (`deliveryDelayText`, F20) y est aussi éditable, en plus de `/admin/livraison` — les deux écrans modifient le même réglage, aucune duplication de donnée.
- `lib/pricing.ts` : `tierForQuantity` reste une fonction pure et synchrone (aucun autre fichier ne doit recalculer un prix par palier), mais accepte désormais des seuils en paramètre (`getTierThresholds()`, async, lit `shopSettings`) au lieu de la constante figée `TIER_THRESHOLDS`. Les deux appelants (`lib/actions/order.ts`, `lib/actions/delivery.ts`) passent désormais les seuils réels ; `prisma/seed.ts` continue d'utiliser la valeur par défaut (paramètre optionnel), le seed s'exécutant sur une base sans réglage encore enregistré.
- **Piège Next.js évité** : `whatsAppLink()` (construction de l'URL `wa.me/...`) est une fonction pure sans dépendance à Prisma, déplacée dans `lib/whatsapp.ts` séparé de `lib/shop-settings.ts` (qui, lui, importe Prisma). Le panier (`components/cart/CartView.tsx`, composant client) importe uniquement `lib/whatsapp.ts` et reçoit le numéro en props depuis sa page serveur — l'importer depuis `lib/shop-settings.ts` aurait tenté d'embarquer Prisma dans le bundle navigateur.
- **Bug corrigé au passage** : le bouton WhatsApp de la fiche commande admin (`/admin/commandes/[id]`) ouvrait une conversation avec le numéro WhatsApp de la boutique elle-même au lieu du téléphone du client (`order.phone`, préfixé `237`). Sans lien avec F22, mais découvert en modifiant la signature de `whatsAppLink()`.

**Impact.** F22 fait. Reste hors de ce lot : historique des modifications de réglages (pas demandé par le texte), validation plus fine des URLs de réseaux sociaux.

## Équipe et journal (F12, reste)

**Constat.** `/admin/equipe` et `/admin/journal` étaient déjà annoncés dans le menu admin (`lib/admin-nav.ts`) mais renvoyaient un 404, faute d'écran construit. F12 exige aussi "impossible de désactiver le dernier OWNER", ce qui suppose un statut actif/inactif inexistant sur `User` (seul le rôle existait).

**Décision.**

- Migration additive `20260925215103_add_user_is_active` : `User.isActive Boolean @default(true)`. Colonne avec valeur par défaut, aucune donnée existante affectée ; appliquée directement à la base Neon partagée dev/prod (voir la mise en garde plus haut sur cette base commune).
- `lib/auth.ts` : un compte désactivé (`isActive = false`) ne peut plus se connecter (traité comme un mot de passe invalide, sans révéler la raison).
- `/admin/equipe` (`lib/actions/team.ts`), réservé à l'OWNER : création de compte OWNER/MANAGER (mot de passe aléatoire jamais transmis, un lien de réinitialisation est journalisé côté serveur à la place d'un envoi par e-mail — Resend non branché, même limite que F08), changement de rôle, activation/désactivation, envoi d'un lien de réinitialisation à la demande. Un OWNER ne peut pas se désactiver lui-même ni retirer/désactiver le dernier OWNER actif (vérifié côté serveur, pas seulement caché dans l'interface).
- **Limite acceptée** : le lien de réinitialisation envoyé depuis l'équipe pointe vers la page publique `/[locale]/reinitialiser-mot-de-passe/[token]` (mécanisme partagé avec F08), qui redirige ensuite vers `/connexion` (espace client) plutôt que `/admin/login`. Le mot de passe est bien mis à jour ; seul le renvoi post-soumission est celui du client, pas de l'admin. À corriger si gênant en pratique (redirection conditionnelle au rôle).
- `/admin/journal` (F12, S) : liste paginée de `AdminLog` (auteur, action, entité concernée), les 9 types d'action existants (exports, décisions pro, création/désactivation/changement de rôle d'un compte admin) traduits en français. Lecture seule, réservé à l'OWNER.

**Impact.** F12 fait. Reste hors de ce lot : redirection post-réinitialisation consciente du rôle, e-mails F08/F09/F12 réels une fois Resend branché.

## Exports CSV (F23)

**Constat.** `/admin/exports` était déjà annoncé dans le menu admin mais renvoyait un 404.

**Décision.** `lib/csv.ts` (BOM UTF-8, séparateur `;`, valeurs entre guillemets si elles contiennent le séparateur/un guillemet/un retour à la ligne — conforme à la demande "s'ouvre correctement dans Excel"). Deux routes (`app/admin/exports/commandes/route.ts`, `.../clients/route.ts`), pas des Server Actions : un export est un téléchargement de fichier via `GET`, chacune vérifie `requireRole("OWNER")` elle-même (pas seulement le menu qui la cache) et journalise l'export (`AdminLog`, `EXPORT_ORDERS`/`EXPORT_CUSTOMERS`). `/admin/exports` (page) porte les formulaires : commandes filtrables par période et statut, clients sans filtre (liste complète avec statut pro et nombre de commandes).

**Impact.** F23 fait.

## Section "Suivez-nous" (grille Instagram) de la page d'accueil

**Constat.** Le design affiche une grille de 6 photos sous un bloc "Suivez-nous — @openstyle_cm". Le cahier des charges (F02) ne mentionne pas ce bloc parmi ceux à afficher.

**Décision.** Conservé à titre décoratif (photos statiques, aucun appel à l'API Instagram/TikTok/Facebook, aucune dépendance externe), puisqu'il ne contredit aucune règle et ferme un espace visuel prévu par le design. À retirer si la cliente ne le souhaite pas.

**Impact.** Mineur, purement visuel.
