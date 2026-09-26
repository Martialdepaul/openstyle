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
- ~~L'e-mail E1 (confirmation) n'est pas envoyé : Resend n'est pas encore configuré.~~ Fait depuis (F24, voir plus bas) : E1 part réellement si le client a laissé un e-mail, E2 part toujours à la boutique.
- RG-15 (limite de débit par IP) : compteur en mémoire dans `lib/actions/order.tsx`, propre à l'instance de serveur — suffisant en développement mono-instance, à remplacer par un magasin partagé (Upstash/Redis) avant une mise en ligne multi-instance.
- « Un double clic ne crée pas deux commandes » : le bouton d'envoi se désactive pendant la soumission (`useFormStatus`), sans clé d'idempotence en base. Suffisant pour un usage normal (un seul clic physique) ; deux requêtes strictement simultanées depuis deux onglets resteraient possibles mais hors du scénario visé par le critère d'acceptation.

**Impact.** F08/F09/F20 faits depuis. Resend fait depuis (F24, voir plus bas).

## Comptes clients (F08), compte professionnel (F09), admin clients (F19)

**Constat.** Ces trois fonctionnalités sont liées (F19 n'a de vraies données qu'avec F08/F09) et dépendaient toutes de Resend pour les e-mails prévus par le texte (lien de réinitialisation, notification de validation/refus pro) — Resend est branché depuis (F24, voir plus bas), ces e-mails partent réellement désormais.

**Décisions :**

- Chemins localisés (aucun exemple donné par F01) : `/inscription` (`/register`), `/connexion` (`/login`), `/compte` (`/account`), `/compte/commandes/[numero]` (`/account/orders/[numero]`), `/mot-de-passe-oublie` (`/forgot-password`), `/reinitialiser-mot-de-passe/[token]` (`/reset-password/[token]`).
- Connexion par e-mail (pas « téléphone ou e-mail » comme le suggère l'export Figma Make) : le téléphone est facultatif à l'inscription, l'e-mail est le seul identifiant garanti présent.
- Un seul fournisseur d'identifiants (Auth.js) sert l'admin et l'espace client ; `lib/admin-auth.ts` (`requireRole`) et `lib/customer-auth.ts` (`requireCustomerSession`) filtrent chacun par rôle à l'entrée de leur zone. Un compte OWNER/MANAGER ne peut pas atteindre `/compte` avec ses propres données affichées comme celles d'un client (redirigé vers `/connexion`) ; un compte CUSTOMER ne peut pas atteindre `/admin` (`forbidden()`).
- Mot de passe oublié : le mécanisme est réel (jeton à usage unique, valable 1 heure, en base) ; l'e-mail part réellement depuis F24 (E7). Même chose pour l'e-mail de validation/refus pro (F09, E6).
- Limite de tentatives de connexion (RG F08) : compteur en mémoire par e-mail dans `lib/auth.ts` (5 tentatives / 15 minutes), même mécanisme que les autres limites de débit du projet (RG-15, F07) — pas de magasin partagé, à revoir avant une mise en ligne multi-instance.
- RG-03 réellement appliquée depuis ce lot : le palier d'une commande dépend du statut pro du compte connecté (`proStatus = APPROVED`) au moment de la commande, plus la quantité totale. Un visiteur ou un client détail garde toujours le prix de détail.
- **Reste hors de ce lot (F09)** : l'affichage du tableau de paliers sur la fiche produit et le panier pour un compte pro validé (F04/F05/F06, critère RG-06 sur l'absence de prix de gros dans le HTML servi à un visiteur — déjà respecté aujourd'hui puisque ces prix ne sont affichés nulle part encore, mais l'affichage réel pour un pro reste à construire). Le lien « Devenir client pro » renvoie vers `/inscription` (case à cocher) partout, y compris pour un visiteur déjà connecté — pas encore de variante « demande depuis le compte » pré-remplie.
- F19 : liste des clients et onglet « Demandes pro » avec recherche, validation/refus créant un `AdminLog` (`PRO_APPROVED`/`PRO_REJECTED`/`PRO_REVERTED`). Réservé à l'OWNER, comme prévu par la section 8.1.

**Impact.** E-mails F08/F09/E1-E3 faits depuis (F24). Reste à compléter : l'affichage des tarifs de palier une fois F04/F05/F06 repris pour les comptes pro.

## Commandes (F18), portée de ce lot

**Constat.** F18 couvre la liste, la fiche détail et plusieurs actions (statut, contact, paiement, note interne). Deux sous-parties restent plus lourdes : la modification des lignes d'une commande `NEW` (RG-11, implique de recalculer prix/palier/frais comme au moment de la commande) et le reçu imprimable (F18, feuille de style d'impression dédiée).

**Décision.** Ce lot construit : liste avec recherche/filtres/tri, fiche détail (lignes avec lien produit, livraison, historique non modifiable), changement de statut réel avec RG-09/10/12 (transitions autorisées, décompte du stock à la confirmation avec refus propre si stock insuffisant, remise en stock à l'annulation après confirmation), tentative de contact (RG-13), état du paiement (RG-16), note interne. La modification des lignes et le reçu imprimable sont reportés.

**Impact.** RG-11 et le reçu imprimable faits depuis (voir les sections dédiées plus bas). Les e-mails de suivi (E3/E4/E5) partent réellement depuis F24.

## Modification des lignes d'une commande NEW (RG-11)

**Constat.** RG-11 autorise la gérante à modifier les quantités, retirer des lignes et changer le mode de livraison tant qu'une commande est `NEW`, avec un recalcul complet ("les totaux sont recalculés avec les mêmes règles de prix").

**Décision.** `lib/actions/order-items.ts` : `updateOrderLineQuantity`, `removeOrderLine`, `updateOrderDeliveryMethod` — chacune vérifie le statut `NEW` (refus explicite sinon), dans une transaction. Après toute modification, `recalculateOrderTotals` reproduit exactement le calcul de `lib/actions/order.ts` (création) : quantité totale → palier (`tierForQuantity`/`effectiveTier`, y compris le statut pro du compte client s'il y en a un) → prix de chaque ligne relu depuis le produit réel au palier obtenu (RG-04/RG-05, pas un simple recalcul du sous-total avec les anciens prix de ligne) → frais de livraison (zone + palier) → totaux. Chaque modification crée un événement `ITEMS_EDITED` avec une note lisible (ex. « Quantité de « Robe midi » modifiée : 2 → 3 »). Une commande garde toujours au moins une ligne (le retrait de la dernière est refusé). Interface : `/admin/commandes/[id]` affiche les contrôles (quantité + retirer par ligne, sélecteur de mode de livraison avec point relais/adresse selon le choix) uniquement quand `order.status === "NEW"`.

**Impact.** RG-11 faite. Reste : le reçu imprimable (F18, voir section suivante).

## Reçu imprimable (F18)

**Constat.** F18 demande une page imprimable (coordonnées de la boutique, numéro, lignes, totaux, mention de paiement) accessible depuis la fiche commande.

**Décision.** `/admin/commandes/[id]/recu`, volontairement placée **hors** du groupe `(dashboard)` pour ne pas hériter du menu/de la coque admin (`app/admin/layout.tsx` reste la seule mise en page — même mécanisme que les routes d'export, section F23) : rien à imprimer que le reçu lui-même. Accès vérifié comme toute page admin (`requireRole("OWNER")`, F18 étant réservé à l'OWNER). Bouton "Imprimer" (`window.print()`, masqué à l'impression via `print:hidden`) plutôt qu'une feuille de style d'impression dédiée séparée — le rendu HTML normal de la page suffit déjà à une impression propre (mise en page en carte simple, pas de navigation à masquer puisqu'il n'y en a pas). Mention « Payé à la réception » si `paymentStatus = COLLECTED`, sinon « À payer à la réception ». Lien "Imprimer le reçu" ajouté sur `/admin/commandes/[id]` (ouvre un nouvel onglet).

**Impact.** F18 fait dans son ensemble.

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
- **RG-14 (corrigée depuis)** : le numéro de commande était généré par comptage (`SELECT COUNT(*)+1`), pas par une vraie séquence Postgres atomique comme demandé par le texte — risque théorique de collision entre deux commandes créées au même instant. Voir la section "Séquence Postgres pour le numéro de commande (RG-14)" plus bas pour la correction.
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
- `/admin/equipe` (`lib/actions/team.tsx`), réservé à l'OWNER : création de compte OWNER/MANAGER (mot de passe aléatoire jamais transmis, un lien de réinitialisation part réellement par e-mail depuis F24), changement de rôle, activation/désactivation, envoi d'un lien de réinitialisation à la demande. Un OWNER ne peut pas se désactiver lui-même ni retirer/désactiver le dernier OWNER actif (vérifié côté serveur, pas seulement caché dans l'interface).
- **Limite acceptée** : le lien de réinitialisation envoyé depuis l'équipe pointe vers la page publique `/[locale]/reinitialiser-mot-de-passe/[token]` (mécanisme partagé avec F08), qui redirige ensuite vers `/connexion` (espace client) plutôt que `/admin/login`. Le mot de passe est bien mis à jour ; seul le renvoi post-soumission est celui du client, pas de l'admin. À corriger si gênant en pratique (redirection conditionnelle au rôle).
- `/admin/journal` (F12, S) : liste paginée de `AdminLog` (auteur, action, entité concernée), les 9 types d'action existants (exports, décisions pro, création/désactivation/changement de rôle d'un compte admin) traduits en français. Lecture seule, réservé à l'OWNER.

**Impact.** F12 fait. Reste hors de ce lot : redirection post-réinitialisation consciente du rôle, e-mails F08/F09/F12 réels une fois Resend branché.

## Exports CSV (F23)

**Constat.** `/admin/exports` était déjà annoncé dans le menu admin mais renvoyait un 404.

**Décision.** `lib/csv.ts` (BOM UTF-8, séparateur `;`, valeurs entre guillemets si elles contiennent le séparateur/un guillemet/un retour à la ligne — conforme à la demande "s'ouvre correctement dans Excel"). Deux routes (`app/admin/exports/commandes/route.ts`, `.../clients/route.ts`), pas des Server Actions : un export est un téléchargement de fichier via `GET`, chacune vérifie `requireRole("OWNER")` elle-même (pas seulement le menu qui la cache) et journalise l'export (`AdminLog`, `EXPORT_ORDERS`/`EXPORT_CUSTOMERS`). `/admin/exports` (page) porte les formulaires : commandes filtrables par période et statut, clients sans filtre (liste complète avec statut pro et nombre de commandes).

**Impact.** F23 fait.

## Tests unitaires (section 0.6)

**Constat.** La consigne 0.6 exige des tests unitaires sur quatre sujets précis (prix par palier, frais de livraison, décompte du stock, transitions de statut) ; jusqu'ici tout avait été vérifié manuellement (build + navigation), sans suite de tests réelle.

**Décision.**

- Vitest ajouté (`pnpm test`, `vitest.config.ts`, alias `@/` aligné sur `tsconfig.json`). Choix naturel pour un projet TypeScript strict + ESM, sans dépendance à un framework de test déjà en place.
- **Nouveau fichier `lib/stock.ts`** : `findStockShortages` (RG-10) et `computeProductInStock` (RG-26) étaient dupliquées telles quelles dans trois endroits (`lib/actions/order-status.ts`, `lib/actions/stock.ts`, `lib/actions/product-create.ts`) — consolidées ici et réutilisées partout, ce qui les rend aussi testables en isolation.
- **Séparation "calcul pur" / "accès base"**, nécessaire pour que les quatre sujets soient testables sans base de données ni variables d'environnement :
  - `lib/pricing.ts` reste pur ; `getTierThresholds()` (qui lit le réglage F22 via Prisma) déménage dans `lib/tier-thresholds.ts`.
  - `lib/delivery.ts` reste pur (`availableDeliveryMethods`, `deliveryFee`) ; `findZoneForCity` (requête Prisma) déménage dans `lib/delivery-zones.ts`.
  - `lib/orders.ts` reste pur (`canTransition`, validation de téléphone) ; `generateOrderNumber` (requête Prisma) déménage dans `lib/order-number.ts`.
  - Ce découpage reproduit celui déjà fait pour `lib/whatsapp.ts`/`lib/shop-settings.ts` (F22) : sans lui, importer une seule fonction pure aurait aussi chargé Prisma/`pg` au démarrage des tests.
- Tests écrits : `lib/pricing.test.ts`, `lib/delivery.test.ts`, `lib/stock.test.ts`, `lib/orders.test.ts` — chacun couvre les règles de gestion citées en commentaire (RG-01 à RG-05, RG-09, RG-10, RG-18, RG-19, RG-26).
- **Tests Playwright (parcours commande invité/pro, création produit admin)** : la consigne dit qu'ils "suffisent" pour le reste, contrairement aux quatre sujets ci-dessus qui sont "obligatoires". Non faits dans ce lot, faute de temps ; à prioriser ensuite si la cliente veut une couverture de bout en bout.

**Impact.** Les quatre sujets obligatoires de la section 0.6 sont couverts. Reste : tests Playwright (recommandés, pas obligatoires selon le texte), et étendre les tests unitaires si de nouvelles règles de calcul apparaissent.

## Séquence Postgres pour le numéro de commande (RG-14)

**Constat.** Depuis la migration vers Postgres, le numéro de commande (`OS-000123`) restait généré par `SELECT COUNT(*)+1` (`lib/order-number.ts`), documenté comme un gap connu — RG-14 demande explicitement une séquence Postgres.

**Décision.** Migration `add_order_number_sequence` : `CREATE SEQUENCE order_number_seq`, initialisée par `setval` au plus grand numéro déjà utilisé (`SUBSTRING` sur les commandes de démonstration existantes) + 1, pour ne pas entrer en collision avec les commandes du seed. `generateOrderNumber()` appelle désormais `SELECT nextval('order_number_seq')` via `prisma.$queryRaw` — atomique sous accès concurrent par construction (propriété native des séquences Postgres), contrairement à l'ancien comptage.

**Impact.** RG-14 respectée. Une deuxième base (ex. environnement de test dédié, si mis en place un jour) devra rejouer cette migration comme les autres pour recréer la séquence.

## SEO et partage (F11)

**Constat.** F11 renvoie entièrement à la section 11, jamais reçue (voir la toute première entrée de ce journal, "Cahier des charges incomplet"). Aucun détail précis à suivre — valeur par défaut la plus simple retenue, comme prévu par la consigne 0.5.

**Décision.**

- `lib/site-url.ts` : URL du site déduite automatiquement (`SITE_URL` si définie, sinon l'URL de déploiement Vercel fournie par la plateforme, sinon `localhost:3000`) — pas de nom de domaine imposé par le texte, donc pas de valeur codée en dur. À définir explicitement (`SITE_URL`) dès qu'un nom de domaine personnalisé existe.
- `app/robots.ts` : autorise l'indexation de la vitrine, bloque `/admin` et les pages privées (panier, commande, compte) dans les deux langues ; référence `sitemap.xml`.
- `app/sitemap.ts` : plan du site régénéré à chaque requête (`export const dynamic = "force-dynamic"`, même raisonnement que `/boutique` et `/produit/[slug]` — sans ça, Next.js le figerait au build et il ne refléterait plus les produits publiés/dépubliés depuis) — pages statiques (accueil, boutique, contenus) et toutes les catégories actives/produits publiés, dans les deux langues.
- Métadonnées par défaut (`app/[locale]/layout.tsx`) : `metadataBase`, modèle de titre (`%s — OPENSTYLE`), Open Graph et Twitter Card de base, hérités par toute page qui ne les redéfinit pas.
- Pages avec métadonnées enrichies : accueil (description + variantes de langue), fiche produit (titre/description réels, image Open Graph depuis la première photo, variantes de langue via les vrais chemins localisés `/produit/[slug]` ↔ `/product/[slug]`), boutique (même correctif).
- **Bug corrigé au passage** : le `canonical` de la page boutique pointait vers `/boutique` en dur, y compris en anglais (aurait dû être `/en/shop`) et sans préfixe de langue — jamais remarqué car non vérifié jusqu'ici. Recalculé via `getPathname()` (next-intl), avec les mêmes variantes de langue ajoutées à la fiche produit.
- Les données structurées `Product` (JSON-LD) de F04 existaient déjà et n'ont pas été retouchées.

**Impact.** F11 fait dans une version raisonnable par défaut. Pas de favicon dédié (reste le `logo.jpg` existant, non prioritaire pour le référencement) ; pas d'alternates de langue sur les autres pages (compte, suivi, etc. — moins pertinentes à indexer). À ajuster dès réception de la section 11 si elle diffère de ces choix.

## Import de produits en lot (F15)

**Constat.** F15 demande un import CSV **ou** XLSX avec prévisualisation (rien n'écrit avant confirmation), traitement par lots de 200 lignes (2 000 maximum), rapprochement par référence, et upload de photos en lot (S) — cette dernière partie dépend du stockage d'images, pas encore branché (F14).

**Décisions :**

- **CSV et XLSX pris en charge.** CSV via un analyseur maison (`lib/csv-import.ts`, testé) ; XLSX via `lib/xlsx-import.ts` (dépendance `xlsx`/SheetJS, ajoutée après coup une fois le reste de F15 stabilisé). Les deux formats produisent le même tableau de lignes en mémoire, puis suivent exactement la même validation — aucune duplication de logique entre les deux formats. Le fichier XLSX est envoyé du navigateur au serveur en base64 (les actions serveur ne transportent que des données sérialisables ; un `File`/`ArrayBuffer` binaire ne s'y prête pas directement). Le modèle téléchargeable (`public/modele-import-produits.csv`) reste au format CSV, ouvrable tel quel dans Excel.
- **Upload de photos en lot non fait** : F14 (stockage d'images) n'est pas branché — aucune photo n'est stockée nulle part actuellement, donc rattacher des fichiers `REFERENCE-1.jpg` n'aurait rien à faire. À reprendre avec F14.
- **Pas d'aperçu écrit en base** (critère d'acceptation) : `previewImport` ne fait que lire (produits existants par référence, catégories) — les lignes validées restent en mémoire côté navigateur (état React) entre l'aperçu et la confirmation, pas de table de travail en base. Plus simple qu'une table `ImportJob`, au prix de renvoyer le tableau complet des lignes à chaque lot (acceptable : opération d'admin peu fréquente, pas un chemin à fort trafic).
- **Lots de 200 *produits* (regroupements), pas 200 lignes brutes** : découper par ligne brute risquerait de couper les variantes d'un même produit entre deux lots. Interprétation pragmatique du texte, qui reste cohérente avec l'esprit (éviter qu'un import dépasse le délai d'une fonction serveur) sans risquer une écriture partielle d'un produit.
- **Rapprochement catégorie** : par nom français exact (insensible à la casse/aux espaces), pas par identifiant technique — c'est ce qu'une gérante non technique tape dans un tableur. Une catégorie introuvable est une erreur de ligne, pas un blocage de tout le fichier.
- **Une ligne par variante**, les champs produit (nom, description, prix, marque, nouveau, populaire, statut) peuvent n'être renseignés que sur la première ligne d'une référence (les suivantes peuvent les laisser vides) — le import retient la première valeur non vide trouvée dans le groupe.
- **Cellule vide = valeur inchangée**, au sens strict : pour un produit existant (mise à jour), un prix/stock/statut vide n'est jamais écrit ; pour une création, vide prend un défaut neutre (`null` pour les prix optionnels, `false` pour nouveau/populaire, `DRAFT` pour le statut, `0` pour le stock). Chaque stock importé (création de variante ou changement de quantité) crée un `StockMovement` de raison `IMPORT` ; une cellule stock vide ne crée aucun mouvement.
- Réservé à OWNER et MANAGER, comme la gestion des produits (section 4).

**Impact.** F15 fait, CSV et XLSX compris. Reste : l'upload de photos en lot, qui dépend de F14 (stockage d'images).

## E-mails (F24)

**Constat.** Jusqu'ici, tous les envois d'e-mails prévus par le texte (E1-E8, section 9) étaient des no-op documentés (lien journalisé côté serveur ou simple commentaire) faute de compte Resend. La cliente a fourni une vraie clé API Resend en cours de session.

**Décisions :**

- **Stack conforme à la section 3** : Resend + React Email. `@react-email/components` (que j'ai d'abord installé) s'est révélé marqué "no longer supported" sur npm au moment de l'installation — les composants ont été fusionnés dans le paquet `react-email` lui-même (confirmé par une recherche web) ; retiré aussitôt, tous les gabarits importent leurs composants (`Html`, `Body`, `Button`, etc.) depuis `react-email` directement.
- `lib/email.ts` : `sendEmail()` générique (jamais d'exception, retente une fois en cas d'échec, comme l'exige la section 9), `sendOrderEmail()` qui journalise en plus le résultat comme événement `EMAIL_SENT` sur la commande concernée (visible dans `/admin/commandes/[id]`, critère d'acceptation explicite).
- **Adresse d'expédition** : `onboarding@resend.dev` (bac à sable Resend), car aucun nom de domaine n'est vérifié dans le compte Resend de la cliente. **Limite importante à connaître** : dans cet état, Resend n'autorise l'envoi qu'à l'adresse e-mail du compte Resend lui-même (protection anti-abus standard des fournisseurs d'e-mail transactionnel) — aucun e-mail n'atteindra un vrai client tant qu'un nom de domaine n'est pas ajouté et vérifié dans Resend (enregistrements DNS). Le code est fonctionnellement complet ; seule la livraison réelle est bloquée par ce réglage externe.
- **E-mails envoyés hors transaction Prisma** : un appel réseau (Resend) ne doit jamais tenir une transaction de base de données ouverte. Dans `lib/actions/order-status.tsx`, la commande mise à jour et les vérifications de stock bas sont capturées pendant la transaction puis les e-mails/alertes sont envoyés juste après, une fois la transaction validée.
- **Fichiers renommés `.ts` → `.tsx`** partout où un envoi d'e-mail est déclenché (JSX du gabarit inline) : `lib/actions/order.tsx`, `order-status.tsx`, `customer-admin.tsx`, `password-reset.tsx`, `team.tsx`. `lib/actions/stock.ts` et `product-import.ts` restent `.ts` : ils appellent `maybeSendLowStockAlert()` (fonction, pas de JSX direct dans ces fichiers).
- **E8 (stock bas), interprétation de « un seul par passage sous le seuil »** : comparaison de l'ancien ET du nouveau stock au seuil (`ancien ≥ seuil ET nouveau < seuil`), pas seulement le nouveau stock — sinon chaque mouvement supplémentaire sous le seuil réalerterait. Déclenché à la confirmation d'une commande (RG-10) et à une modification manuelle de stock (F17). **Pas d'alerte à la création d'un produit** (import ou création manuelle) : il n'y a pas de "précédent" à faire chuter, seulement un choix initial de stock assumé par l'admin.
- Gabarits bilingues (E1/E3/E4/E5 client, E6/E7 selon `user.locale`/`order.locale`) ; E2 (notification boutique) et E8 (stock bas) sont en français uniquement, adressés à la gérante.
- E1 et E3 partagent le même composant (`OrderStatusEmail`, `variant="received"|"confirmed"`), conformément au texte qui leur donne exactement le même contenu ; E4 (`ready`/`shipped`) et E5 (`cancelled`) réutilisent aussi ce composant pour rester cohérents (le texte ne détaille pas leur contenu, plus de contexte n'est pas un défaut).

**Impact.** F24 fait, code complet pour les 8 e-mails. Reste : vérifier un nom de domaine dans Resend pour que les clients reçoivent réellement leurs e-mails (nécessite que la cliente possède un nom de domaine et ajoute les enregistrements DNS) ; ajouter `RESEND_API_KEY` aux variables d'environnement Vercel (fait en local dans `.env`, pas encore en production).

## Section "Suivez-nous" (grille Instagram) de la page d'accueil

**Constat.** Le design affiche une grille de 6 photos sous un bloc "Suivez-nous — @openstyle_cm". Le cahier des charges (F02) ne mentionne pas ce bloc parmi ceux à afficher.

**Décision.** Conservé à titre décoratif (photos statiques, aucun appel à l'API Instagram/TikTok/Facebook, aucune dépendance externe), puisqu'il ne contredit aucune règle et ferme un espace visuel prévu par le design. À retirer si la cliente ne le souhaite pas.

**Impact.** Mineur, purement visuel.
