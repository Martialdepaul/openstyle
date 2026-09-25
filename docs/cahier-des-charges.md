> **Note (consigne 0.1).** Ce document est la copie du cahier des charges tel que reçu de la cliente/du développeur dans la conversation. **Il est incomplet** : le texte fourni s'arrête en plein milieu de la section 10 (Performance et volume de produits). Il manque donc :
>
> - la fin de la section 10,
> - la section 11 (SEO et partage),
> - la section 12 (ordre des jalons — utilisée pour séquencer les fonctionnalités F01 à F24),
> - la section 13 (hors périmètre),
> - la section 14 (textes de marque).
>
> Tant que ces sections ne sont pas fournies, le travail se limite à ce qui n'en dépend pas (J0 — méthode d'intégration du design, section 3.1 — et le début de F02). Voir `docs/decisions.md`.

---

# OpenStyle : cahier des charges du site e-commerce

Version 1.0 du 20 septembre 2026
Client : OpenStyle, boutique de prêt-à-porter à Yaoundé (gérante : Toko Tchazue Thérèse Doriane)
Destinataire : développeur, et Claude Code pour l'implémentation fonctionnalité par fonctionnalité

---

## 0. Consignes pour Claude Code

1. Lire tout le document avant d'écrire du code. Le copier dans le dépôt sous `docs/cahier-des-charges.md`.
2. Suivre l'ordre des jalons de la section 12. Une fonctionnalité (F01, F02, ...) à la fois, un commit par fonctionnalité.
3. Une fonctionnalité est terminée quand tous ses critères d'acceptation sont vérifiés. Les vérifier vraiment, en lançant l'application.
4. Les règles de gestion (RG) de la section 6 priment sur toute autre formulation du document.
5. Ne rien ajouter qui figure en section 13 (hors périmètre). Si un point n'est pas couvert, appliquer la valeur par défaut la plus simple et la noter dans `docs/decisions.md`. Si l'écart est important, poser la question avant de coder.
6. Tests unitaires obligatoires sur quatre sujets : calcul du prix par palier, calcul des frais de livraison, décompte du stock, transitions de statut de commande. Pour le reste, des tests Playwright de parcours suffisent (commande invité, commande client pro, création produit dans l'admin).
7. Aucun texte en dur dans les composants de la vitrine : tout passe par les fichiers de traduction FR et EN. L'admin est en français uniquement, ses textes sont dans `messages/admin.fr.json`.
8. Aucune donnée de prix ou de stock envoyée par le navigateur n'est crédible. Le serveur recalcule tout.
9. L'admin se construit d'abord comme une coque (connexion, mise en page, menu, rôles), puis chaque écran s'y branche. Les liens entre écrans suivent la section 8.1 : aucun écran sans ses liens.
10. Le design Figma Make fait foi pour l'apparence, ce document fait foi pour le comportement (section 3.1). Avant de coder la vitrine, lire `design/figma-make/` et produire `docs/design-mapping.md`.

---

## 1. Contexte

OpenStyle existe depuis 2023. La boutique est à Yaoundé (Mokolo Elobi, centre commercial Doubaï Market). Elle vend des vêtements turcs et des fins de séries, des sacs, des accessoires et des parfums, au détail et en gros. Les ventes se font aujourd'hui sur Instagram, TikTok et Facebook, avec prise de commande par téléphone et WhatsApp.

Le site doit permettre de parcourir un catalogue qui peut devenir grand, de passer commande sans payer en ligne, et de laisser la gérante suivre ses commandes et ses stocks seule depuis son téléphone. La clientèle navigue surtout sur smartphone, souvent avec une connexion lente.

Objectif commercial : être en ligne pour la période de décembre. Mise en ligne visée le vendredi 20 novembre 2026, recette avec la cliente du 9 au 16 novembre.

---

## 2. Décisions figées

| Sujet | Décision |
|---|---|
| Paiement | Aucun paiement en ligne. Le client paie à la réception : en boutique, à la remise au point relais ou à la livraison. Le site enregistre seulement l'état « à encaisser » ou « encaissé », modifié à la main par la gérante. |
| Commande | Panier, puis formulaire de commande sans compte obligatoire. La commande est validée par la gérante après un appel au client. |
| Types de clients | Client détail (prix publics) et client pro (prix semi-gros et gros après validation manuelle du compte). |
| Paliers de prix | 1 à 9 pièces : détail. 10 à 19 : semi-gros. 20 et plus : gros. Quantités cumulées sur tout le panier. |
| Livraison | Retrait en boutique, point relais à Yaoundé, expédition par agence de transport vers les autres villes. Frais par zone, deux grilles (détail et gros). Pas de livraison à domicile. |
| Langues | Français et anglais. Français par défaut. |
| E-mails | Envoyés automatiquement quand le client a renseigné une adresse. Sinon, WhatsApp manuel depuis l'admin. Pas de SMS. |
| Devise | FCFA (XAF), montants entiers, sans décimales. |
| Style | Design déjà généré avec Figma Make, qui fait foi pour l'apparence (section 3.1). Demande de la cliente : noir et blanc, élégant, professionnel, mobile d'abord. |
| Domaine | Acheté par la cliente à son nom. Le développeur configure le DNS. |
| Volume de produits | Aucun plafond. Le site doit rester rapide avec 5 000 produits (voir section 10). |
| Lancement | Une seule phase. Les fonctions de la section 13 viennent après décembre. |

---

## 3. Stack technique

| Élément | Choix |
|---|---|
| Framework | Next.js (App Router), TypeScript en mode strict |
| Base de données | PostgreSQL (Neon), Prisma |
| Style | Tailwind CSS |
| Internationalisation | next-intl, chemins localisés (`/fr/boutique`, `/en/shop`) |
| Authentification | Auth.js avec identifiants (e-mail et mot de passe), hachage argon2 ou bcrypt |
| Validation | Zod, côté serveur pour toutes les entrées |
| E-mails | Resend et React Email, gabarits FR et EN |
| Images | sharp côté serveur, compression côté navigateur avant envoi, stockage Vercel Blob ou Cloudflare R2 |
| Import de fichiers | papaparse (CSV) et SheetJS (XLSX) |
| Tests | Vitest (unitaires), Playwright (parcours) |
| Hébergement | Vercel, base Neon. Comptes ouverts au nom de la cliente, accès partagé au développeur. |

Conventions :
- Les montants sont des entiers en FCFA. Affichage : `12 500 FCFA` (espace insécable).
- Les dates sont stockées en UTC et affichées en heure de Douala (UTC+1).
- Les actions serveur vérifient le rôle de l'utilisateur à chaque appel, pas seulement dans le middleware.
- Un fichier `lib/pricing.ts` unique contient le calcul des prix, un fichier `lib/delivery.ts` celui des frais, un fichier `lib/orders.ts` les transitions de statut et le stock. Aucun autre endroit ne recalcule ces valeurs.
- Chemins : `app/[locale]/(shop)/...` pour la vitrine, `app/admin/...` pour le back-office (hors du segment de langue, avec sa propre mise en page racine), `prisma/`, `emails/`, `messages/fr.json`, `messages/en.json` et `messages/admin.fr.json`.
- Composants partagés de l'admin : `PageHeader` (fil d'Ariane et actions), `DataTable` (pagination serveur, filtres dans l'URL, affichage en cartes sur mobile), `StatusBadge`, `ProductLink`, `OrderLink`, `CustomerLink`. Toute mention d'un produit, d'une commande ou d'un client dans l'admin passe par ces liens, jamais par du texte simple.

### 3.1 Design existant (Figma Make)

Un design du site a déjà été généré avec Figma Make. Il fait foi pour l'apparence : mise en page, typographie, couleurs, espacements, composants. Ce cahier des charges fait foi pour le comportement : quoi afficher, avec quelles données, selon quelles règles. Si les deux se contredisent sur le comportement, le cahier des charges gagne. S'ils se contredisent sur l'apparence, le design gagne.

Le code exporté par Figma Make est une maquette avec des données factices, pas la base du projet. Le format exact de l'export est à vérifier à sa réception (du React avec Tailwind est attendu).

**Méthode d'intégration, à faire au jalon J0**

1. Placer l'export tel quel dans `design/figma-make/`, en lecture seule, exclu du build et du lint.
2. Relever les jetons de design (couleurs, polices, tailles de texte, espacements, rayons, ombres, points de rupture) dans la configuration Tailwind et en variables CSS, puis les lister dans `docs/design-tokens.md`.
3. Recréer chaque écran et chaque composant dans Next.js en reprenant le balisage et les classes du design. Composants serveur par défaut, `"use client"` seulement quand il y a de l'interaction.
4. Ne pas reprendre : les données factices, le routage propre au design, l'état local qui simule un panier ou des comptes, les images de démonstration (remplacées par le pipeline d'images de F14 avec `next/image`) et les textes en dur (déplacés dans les fichiers de traduction).
5. Polices auto-hébergées avec `next/font`, même si le design les charge depuis Google Fonts.
6. Les budgets de la section 10 s'appliquent aussi aux composants du design. Un carrousel, une animation ou un lot d'icônes trop lourds sont remplacés par une version légère (CSS `scroll-snap`, icônes importées une par une) sans changer l'aspect.
7. Créer `docs/design-mapping.md` : un tableau avec chaque écran du design, la fonctionnalité correspondante (F01 à F24) et son état (repris, adapté, absent du design).

**Écarts à traiter**

- Un élément du design hors périmètre ou contraire aux règles (paiement en ligne, choix de carte bancaire ou de Mobile Money, favoris, comparateur, avis, codes promo, page dédiée au gros, demande de devis) n'est pas construit. Il est noté dans `design-mapping.md`, et la mise en page voisine referme l'espace laissé vide.
- Un écran absent du design (admin, suivi de commande, compte pro, états vides, produit épuisé, erreurs, confirmations, pages de contenu) est conçu avec les mêmes jetons et les mêmes composants, sans nouvelle famille de police ni nouvelle couleur.
- Les prix, noms de produits et textes du design sont des exemples. Les textes de marque viennent de la section 14.
- La cliente a demandé du noir et blanc. Si le design utilise d'autres couleurs de façon marquée, le signaler dans `design-mapping.md` sans modifier le design.

**Valeurs par défaut**, à utiliser uniquement pour ce que le design ne montre pas : fond blanc, texte noir, gris clair `#F5F5F5` pour les fonds, gris moyen pour le texte secondaire, titres en police à empattements (Cormorant Garamond ou Playfair Display), texte en Inter, coins peu arrondis, boutons noirs pleins, zones tactiles de 44 px minimum, couleurs d'état (erreur, succès) discrètes.

---

## 4. Acteurs et droits

| Acteur | Description |
|---|---|
| Visiteur | Parcourt le catalogue, commande sans compte, suit sa commande avec son numéro. Voit uniquement les prix de détail. |
| Client | A créé un compte. Retrouve son historique de commandes et ses coordonnées. Prix de détail. |
| Client pro | Compte dont la demande pro a été validée. Voit les prix semi-gros et gros. |
| Gérant (OWNER) | La gérante. Tous les droits. |
| Gestionnaire (MANAGER) | L'informaticien. Gère le catalogue et les contenus. |

Droits du back-office :

| Fonction | OWNER | MANAGER |
|---|---|---|
| Produits, catégories, prix, photos, import | oui | oui |
| Stocks (consultation et ajustement) | oui | oui |
| Contenus (pages, FAQ, témoignages, bannières) | oui | oui |
| Commandes (voir, changer le statut, état du paiement) | oui | non |
| Clients, comptes pro | oui | non |
| Livraison (zones, tarifs, points relais) | oui | non |
| Paramètres de la boutique | oui | non |
| Exports CSV | oui | non |
| Équipe (comptes admin) et journal d'activité | oui | non |
| Mon compte (nom, mot de passe) | oui | oui |

---

## 5. Modèle de données

Schéma Prisma de départ, validé syntaxiquement. Les blocs `generator` et `datasource` sont volontairement absents : Claude Code les écrit selon la version de Prisma installée (à partir de Prisma 7, l'URL de connexion se déclare dans `prisma.config.ts` avec un adaptateur, plus dans le schéma). Il peut ajuster le reste, à condition de garder les règles de la section 6.

```prisma
enum Role {
  CUSTOMER
  OWNER
  MANAGER
}
enum ProStatus {
  NONE
  PENDING
  APPROVED
  REJECTED
}
enum ProductStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
enum OrderStatus {
  NEW
  CONFIRMED
  READY
  SHIPPED
  DELIVERED
  CANCELLED
}
enum DeliveryMethod {
  PICKUP
  RELAY
  SHIPPING
}
enum PaymentStatus {
  TO_COLLECT
  COLLECTED
}
enum PriceTier {
  RETAIL
  SEMI_WHOLESALE
  WHOLESALE
}
enum StockReason {
  ORDER_CONFIRMED
  ORDER_CANCELLED
  MANUAL
  IMPORT
}
enum OrderEventType {
  STATUS_CHANGE
  CONTACT_ATTEMPT
  NOTE
  ITEMS_EDITED
  EMAIL_SENT
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  firstName    String
  lastName     String
  phone        String?
  role         Role      @default(CUSTOMER)
  proStatus    ProStatus @default(NONE)
  shopName     String?
  proCity      String?
  proPhone     String?
  proDecidedAt DateTime?
  locale       String    @default("fr")
  createdAt    DateTime  @default(now())
  orders       Order[]
  stockMovements StockMovement[]
  orderEvents  OrderEvent[]
  adminLogs    AdminLog[]
}

model Category {
  id       String     @id @default(cuid())
  slug     String     @unique
  nameFr   String
  nameEn   String?
  parentId String?
  parent   Category?  @relation("Tree", fields: [parentId], references: [id])
  children Category[] @relation("Tree")
  position Int        @default(0)
  imageUrl String?
  isActive Boolean    @default(true)
  products Product[]
}

model Product {
  id            String        @id @default(cuid())
  reference     String        @unique
  slug          String        @unique
  nameFr        String
  nameEn        String?
  descriptionFr String        @default("")
  descriptionEn String?
  categoryId    String
  category      Category      @relation(fields: [categoryId], references: [id])
  brand         String?
  priceRetail   Int
  pricePromo    Int?
  priceSemi     Int?          // palier 10 à 19 pièces
  priceWholesale Int?         // palier 20 pièces et plus
  isNew         Boolean       @default(false)
  isPopular     Boolean       @default(false)
  isFeatured    Boolean       @default(false)
  status        ProductStatus @default(DRAFT)
  soldCount     Int           @default(0)
  inStock       Boolean       @default(true)   // dénormalisé : au moins une variante active avec stock > 0
  publishedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  images        ProductImage[]
  variants      Variant[]
  orderItems    OrderItem[]

  @@index([status, categoryId, publishedAt])
  @@index([status, isNew])
  @@index([status, isPopular])
  @@index([status, priceRetail])
}

model ProductImage {
  id          String  @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  urlThumb    String  // 400 px
  urlCard     String  // 800 px
  urlFull     String  // 1600 px
  blurDataUrl String
  alt         String?
  position    Int     @default(0)

  @@index([productId, position])
}

model Variant {
  id                String  @id @default(cuid())
  productId         String
  product           Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku               String  @unique
  size              String?
  color             String?
  colorHex          String?
  scent             String?
  stock             Int     @default(0)
  lowStockThreshold Int     @default(3)
  isActive          Boolean @default(true)
  orderItems        OrderItem[]
  movements         StockMovement[]

  @@index([productId])
  @@index([size])
  @@index([color])
}

model StockMovement {
  id        String      @id @default(cuid())
  variantId String
  variant   Variant     @relation(fields: [variantId], references: [id])
  delta     Int
  reason    StockReason
  orderId   String?
  order     Order?      @relation(fields: [orderId], references: [id])
  userId    String?
  user      User?       @relation(fields: [userId], references: [id])
  createdAt DateTime    @default(now())

  @@index([variantId, createdAt])
}

model DeliveryZone {
  id           String  @id @default(cuid())
  nameFr       String
  nameEn       String?
  cities       String[]
  feeRetail    Int     @default(0)
  feeWholesale Int     @default(0)
  position     Int     @default(0)
  orders       Order[]
}

model RelayPoint {
  id       String  @id @default(cuid())
  name     String
  city     String
  address  String
  phone    String?
  isActive Boolean @default(true)
  orders   Order[]
}

model Order {
  id               String         @id @default(cuid())
  number           String         @unique   // OS-000123, séquence Postgres
  status           OrderStatus    @default(NEW)
  userId           String?
  user             User?          @relation(fields: [userId], references: [id])
  firstName        String
  lastName         String
  phone            String
  email            String?
  locale           String         @default("fr")
  deliveryMethod   DeliveryMethod
  city             String
  zoneId           String?
  zone             DeliveryZone?  @relation(fields: [zoneId], references: [id])
  relayPointId     String?
  relayPoint       RelayPoint?    @relation(fields: [relayPointId], references: [id])
  address          String?
  agencyNote       String?
  customerNote     String?
  tier             PriceTier      @default(RETAIL)
  subtotal         Int
  deliveryFee      Int
  total            Int
  paymentStatus    PaymentStatus  @default(TO_COLLECT)
  paymentNote      String?
  receiptRequested Boolean        @default(false)
  internalNote     String?
  contactAttempts  Int            @default(0)
  lastContactAt    DateTime?
  confirmedAt      DateTime?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  items            OrderItem[]
  events           OrderEvent[]
  stockMovements   StockMovement[]

  @@index([status, createdAt])
  @@index([phone])
  @@index([userId])
}

model OrderItem {
  id         String @id @default(cuid())
  orderId    String
  order      Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId  String
  product    Product @relation(fields: [productId], references: [id])
  variantId  String
  variant    Variant @relation(fields: [variantId], references: [id])
  name       String  // copie au moment de la commande
  reference  String
  size       String?
  color      String?
  scent      String?
  imageUrl   String?
  unitPrice  Int
  quantity   Int
  lineTotal  Int
}

model OrderEvent {
  id        String         @id @default(cuid())
  orderId   String
  order     Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  type      OrderEventType
  fromStatus OrderStatus?
  toStatus   OrderStatus?
  note      String?
  userId    String?
  user      User?          @relation(fields: [userId], references: [id])
  createdAt DateTime       @default(now())

  @@index([orderId, createdAt])
}

model AdminLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String   // EXPORT_ORDERS, EXPORT_CUSTOMERS, PRO_APPROVED, PRO_REJECTED, ADMIN_CREATED, ROLE_CHANGED
  entity    String?
  entityId  String?
  createdAt DateTime @default(now())

  @@index([createdAt])
}

model Page {
  slug String @id
  titleFr String
  titleEn String?
  bodyFr String
  bodyEn String?
  updatedAt DateTime @updatedAt
}
model FaqItem {
  id String @id @default(cuid())
  questionFr String
  questionEn String?
  answerFr String
  answerEn String?
  position Int @default(0)
}
model Testimonial {
  id String @id @default(cuid())
  author String
  city String?
  textFr String
  textEn String?
  photoUrl String?
  position Int @default(0)
  isActive Boolean @default(true)
}
model Banner {
  id String @id @default(cuid())
  imageUrl String
  titleFr String
  titleEn String?
  subtitleFr String?
  subtitleEn String?
  linkUrl String?
  position Int @default(0)
  isActive Boolean @default(true)
}
model Setting {
  key String @id
  value Json
}
```

Ajouts hors Prisma (migration SQL) : extension `pg_trgm`, index GIN sur `lower(nameFr || ' ' || reference)` pour la recherche, séquence Postgres pour les numéros de commande, tables d'Auth.js selon l'adaptateur choisi.

Réglages stockés dans `Setting` : coordonnées de la boutique, numéro WhatsApp, horaires, liens sociaux, numéro d'identification légal, e-mail de notification des commandes, seuil de stock bas par défaut, quantités des paliers (10 et 20).

---

## 6. Règles de gestion

**Prix**

- RG-01. Tous les montants sont en FCFA, entiers. Le prix de détail est obligatoire sur chaque produit. Les prix semi-gros et gros sont facultatifs.
- RG-02. Le palier dépend du nombre total de pièces dans le panier, tous produits confondus : 1 à 9 détail, 10 à 19 semi-gros, 20 et plus gros. Les seuils 10 et 20 sont des réglages.
- RG-03. Les paliers semi-gros et gros ne s'appliquent qu'aux comptes pro validés (`proStatus = APPROVED`). Pour tous les autres, le prix de détail s'applique, quelle que soit la quantité.
- RG-04. Si un produit n'a pas de prix pour le palier atteint, on retombe sur le palier inférieur (gros, puis semi-gros, puis détail).
- RG-05. Un prix promo remplace le prix de détail. Le client paie le prix le plus bas entre le prix du palier et le prix promo.
- RG-06. Les visiteurs et clients détail voient une mention « Prix de gros pour les professionnels » avec un lien vers la demande de compte pro, sans voir les montants.

**Commande**

- RG-07. Le client peut commander sans compte. Obligatoires : nom, prénom, téléphone, ville, mode de livraison. L'e-mail est facultatif. L'adresse est demandée pour l'expédition, le choix du point relais pour le mode relais.
- RG-08. À la création, la commande est au statut `NEW`. Le stock n'est pas touché. Le serveur recalcule les prix, le palier et les frais, et contrôle que les quantités demandées sont disponibles.
- RG-09. Transitions autorisées : `NEW` vers `CONFIRMED` ou `CANCELLED` ; `CONFIRMED` vers `READY`, `SHIPPED` ou `CANCELLED` ; `READY` vers `DELIVERED` ou `CANCELLED` ; `SHIPPED` vers `DELIVERED` ou `CANCELLED`. `DELIVERED` et `CANCELLED` sont finals. Toute autre transition est refusée côté serveur.
- RG-10. Le stock est décompté au passage à `CONFIRMED`, dans une transaction qui verrouille les variantes concernées. Si une variante n'a pas assez de stock, la confirmation est refusée et l'écran indique quelles lignes posent problème. La gérante corrige alors la commande (RG-11) après avoir appelé le client.
- RG-11. Tant que la commande est `NEW`, la gérante peut modifier les quantités, retirer des lignes et changer le mode de livraison. Les totaux sont recalculés avec les mêmes règles de prix. Chaque modification crée un événement `ITEMS_EDITED`.
- RG-12. Une annulation après confirmation remet les quantités en stock (mouvement `ORDER_CANCELLED`).
- RG-13. Une commande `NEW` depuis plus de 3 jours reçoit le badge « À relancer » dans la liste. Elle n'est jamais annulée automatiquement. La gérante peut enregistrer chaque tentative de contact (compteur et date).
- RG-14. Numéro de commande au format `OS-000123`, généré par une séquence Postgres.
- RG-15. Anti-abus : champ piège invisible dans le formulaire, limite de débit par adresse IP, et pas plus de 3 commandes `NEW` en même temps pour un même numéro de téléphone.

**Paiement**

- RG-16. Le paiement se fait à la réception, hors du site. `paymentStatus` vaut `TO_COLLECT` à la création. La gérante le passe à `COLLECTED`. Au passage à `DELIVERED`, l'écran propose de marquer le paiement comme encaissé.
- RG-17. Pour une expédition hors Yaoundé, les modalités de paiement sont convenues par téléphone lors de la confirmation et notées dans `paymentNote`. Le site n'encaisse rien.

**Livraison**

- RG-18. Le retrait en boutique est gratuit et proposé pour toutes les villes. Le point relais est proposé pour Yaoundé. L'expédition est proposée pour les autres villes.
- RG-19. Les frais dépendent de la zone de la ville choisie et du type de commande : grille détail, ou grille gros quand le palier semi-gros ou gros est atteint par un compte pro. Une ville absente de toute zone tombe dans la dernière zone (« Autres villes »).
- RG-20. Les frais sont affichés au client avant validation. Message affiché : « Frais confirmés lors de l'appel de la boutique ».
- RG-21. Délai indicatif affiché : 2 jours. C'est un texte modifiable, pas un calcul.

**Catalogue et stock**

- RG-22. Un produit a toujours au moins une variante. Un produit sans taille ni couleur a une seule variante « par défaut » qui porte le stock.
- RG-23. Le stock se gère par variante. Une variante à 0 est affichée grisée avec « Épuisé » et ne peut pas être ajoutée au panier. Un produit dont toutes les variantes sont à 0 s'affiche en fin de liste avec le bandeau « Épuisé » et peut être archivé.
- RG-24. Seuil de stock bas : 3 par défaut, réglable par variante. En dessous du seuil, la vitrine affiche « Stock limité » et l'admin déclenche l'alerte (F17).
- RG-25. Seuls les produits `PUBLISHED` apparaissent sur la vitrine. Un produit `DRAFT` ou `ARCHIVED` renvoie une page 404, sauf pour un admin connecté.
- RG-26. Le champ dénormalisé `Product.inStock` est mis à jour à chaque changement de stock. Le tri « disponibles d'abord » s'appuie dessus.
- RG-30. Un produit ou une variante référencé par une commande ne se supprime jamais : on l'archive ou on le désactive. Les lignes de commande gardent une copie du nom et du prix. Les liens de l'admin vers un produit ou une variante restent donc toujours valides.

**Contenu et langues**

- RG-27. Français par défaut, sans détection automatique du navigateur. Le sélecteur de langue est dans l'en-tête et le choix est mémorisé dans un cookie.
- RG-28. Les champs anglais des produits, catégories, pages et FAQ sont facultatifs. Si vide, la version française s'affiche.

**Retours**

- RG-29. Échange possible, remboursement impossible. Les parfums ne sont ni repris ni échangés. Ces règles figurent sur la page Conditions de vente et dans l'e-mail de confirmation. Aucun module de retour dans l'admin : la gérante utilise la note interne de la commande.

---

## 7. Fonctionnalités de la vitrine

Priorités : **M** indispensable au lancement, **S** à faire si le planning le permet avant le 9 novembre, **C** facultatif.

### F01. Structure du site, navigation, langues (M)

- En-tête collant : logo, recherche, sélecteur FR/EN, compte, panier avec compteur. Menu tiroir sur mobile.
- Pied de page : coordonnées, horaires, adresse, liens vers les pages de contenu, réseaux sociaux (une icône n'apparaît que si l'URL est renseignée), numéro d'identification légal.
- Bouton WhatsApp flottant sur toutes les pages, ouvrant `https://wa.me/<numéro>` avec un message d'accueil pré-rempli. Il ne recouvre pas la barre d'achat collante de la fiche produit.
- Bouton « Appeler » (`tel:`) dans l'en-tête sur mobile et sur les pages panier, commande et confirmation.
- Design : celui de Figma Make (section 3.1). Les valeurs par défaut de la section 3.1 servent uniquement pour ce que le design ne montre pas.
- Logo : celui du design s'il en contient un, sinon le texte « OPENSTYLE » en police à empattements tant que le fichier officiel n'est pas fourni.
- Critères d'acceptation :
  - Les routes existent en `/fr/...` et `/en/...` avec des chemins localisés (`/fr/boutique`, `/en/shop`, `/fr/panier`, `/en/cart`, `/fr/suivi`, `/en/tracking`).
  - Aucun défilement horizontal de 320 px à 1440 px.
  - Zones tactiles d'au moins 44 px.
  - Le sélecteur de langue conserve la page courante.

### F02. Page d'accueil (M)

- Bannière (1 à 5 visuels gérés dans l'admin, avec titre, sous-titre, lien).
- Grille des catégories, puis blocs « Nouveautés », « Promotions » et « Les plus demandés » (8 produits chacun, alimentés par les badges et `soldCount`), puis témoignages, puis bandeau de réassurance (qualité, échange, contact WhatsApp).
- Slogan : « Un style qui s'accorde à votre identité ».
- Les blocs listés ici disent quoi afficher. Leur disposition et leur ordre suivent le design.
- Critères d'acceptation :
  - Un bloc sans produit est masqué.
  - La bannière principale se charge en priorité (`priority` sur l'image), les autres en différé.
  - LCP conforme à la section 10.

### F03. Boutique : liste, filtres, tri, recherche (M)

- Routes : `/boutique` (tous les produits), `/boutique/[categorie]`, `/promotions`, `/nouveautes`. Ces deux dernières sont des listes prédéfinies (badge promo, badge nouveau).
- Filtres : catégorie, fourchette de prix, taille, couleur, disponibilité, badges. Tri : nouveautés, prix croissant, prix décroissant, populaires. Sur mobile, les filtres s'ouvrent dans un tiroir.
- Les filtres vivent dans l'URL (`?taille=M&couleur=noir&tri=prix-asc`) pour être partageables et indexables sans doublons (canonical vers la version sans paramètres de tri).
- Recherche : champ dans l'en-tête, suggestions après 2 caractères (6 résultats maximum, anti-rebond de 250 ms), page de résultats complète. Recherche par nom et par référence, tolérante aux fautes légères (`pg_trgm`).
- Pagination par curseur, 24 produits par page, bouton « Voir plus » (pas de défilement infini, pour garder le pied de page accessible).
- Carte produit : photo `urlCard` en lazy loading avec flou de chargement, nom, prix (barré si promo), badges (Nouveau, Promo, Stock limité, Épuisé).
- Critères d'acceptation :
  - Avec le jeu de test de 5 000 produits, la première page se charge sous les budgets de la section 10.
  - Les valeurs de filtres proposées correspondent à la catégorie affichée, avec leur nombre de produits.
  - Une recherche sans résultat affiche un message et les catégories.

### F04. Fiche produit (M)

- Galerie (jusqu'à 5 photos, glissement tactile, zoom), nom, référence, prix, description, sélecteurs de variantes (taille, couleur avec pastille, parfum), quantité, bouton « Ajouter au panier ».
- Barre d'achat collante en bas sur mobile.
- Un compte pro validé voit ses prix de palier sous le prix de détail (tableau : 1-9, 10-19, 20+). Les autres voient la mention de la RG-06.
- Sélection de variante : les combinaisons épuisées sont grisées. La quantité maximale est le stock disponible.
- Produits de la même catégorie en bas de page (4 à 8).
- Critères d'acceptation :
  - Le prix est porté par le produit, pas par la variante : changer de taille ou de couleur ne change pas le prix.
  - Les données structurées `Product` sont présentes (section 11).
  - Ajout au panier sans rechargement de page, avec confirmation visible.

### F05. Panier (M)

- Stocké dans le navigateur (localStorage), sans table en base. Contient : variante, quantité.
- Affiche photo, nom, options, prix unitaire, quantité modifiable, sous-total.
- Pour un compte pro validé : indique le palier atteint et invite à passer au suivant (« Ajoutez 4 pièces pour passer au prix semi-gros »).
- À chaque affichage, le panier est revalidé côté serveur (prix, disponibilité). Une ligne devenue indisponible est signalée et bloque la validation.
- Critères d'acceptation :
  - Le prix affiché au panier est identique à celui recalculé au moment de la commande.
  - Le panier survit à un rechargement de page et à un changement de langue.

### F06. Commande et confirmation (M)

- Page unique : coordonnées (prénom, nom, téléphone, e-mail facultatif), mode de livraison, ville (liste des villes du Cameroun avec autre saisie possible), adresse ou point relais, agence de transport souhaitée pour l'expédition, note libre, récapitulatif avec frais, mention « Paiement à la réception », case d'acceptation des conditions de vente.
- Le téléphone est validé au format camerounais (9 chiffres commençant par 6 ou 2, préfixe +237 accepté).
- Si le client est connecté, ses coordonnées sont pré-remplies.
- Page de confirmation : numéro de commande, récapitulatif, message « La boutique va vous appeler pour confirmer votre commande », bouton « Envoyer ma commande sur WhatsApp » (message pré-rempli avec le récapitulatif) et bouton « Appeler la boutique ».
- Si un e-mail a été saisi, l'e-mail E1 part automatiquement (section 9).
- Critères d'acceptation :
  - Commande réussie sans compte et sans e-mail.
  - Une manipulation du prix dans la requête est ignorée, le serveur recalcule.
  - Un double clic sur le bouton ne crée pas deux commandes.
  - Les règles RG-15 sont appliquées.

### F07. Suivi de commande (M)

- Page `/suivi` : numéro de commande et téléphone. Affiche le statut, l'historique des changements de statut (sans les notes internes) et le récapitulatif.
- Bouton « Demander un reçu » : positionne `receiptRequested` (la gérante le voit dans la liste).
- Critères d'acceptation :
  - Numéro et téléphone doivent correspondre, sinon message générique (pas d'indication sur ce qui est faux).
  - Limite de débit sur cette page.

### F08. Comptes clients (M)

- Inscription (prénom, nom, e-mail, mot de passe, téléphone facultatif), connexion, déconnexion, mot de passe oublié (lien par e-mail, valable 1 heure).
- Espace client : profil, historique des commandes avec statut, détail d'une commande, bouton « Demander un reçu ».
- Seules les commandes passées une fois connecté apparaissent dans l'historique. Les commandes faites sans compte ne sont pas rattachées après coup.
- Critères d'acceptation :
  - Mot de passe de 8 caractères minimum.
  - Limite de tentatives de connexion.
  - Le mot de passe n'est jamais journalisé.

### F09. Compte professionnel (M)

- Sur le formulaire d'inscription, une case « Je suis un professionnel (boutique, revendeur) » affiche : nom de la boutique, ville, téléphone. Le compte est créé aussitôt, avec `proStatus = PENDING`. Un client déjà inscrit peut faire la demande depuis son espace.
- Tant que la demande est en attente, le client garde les prix de détail et voit un bandeau « Votre demande de compte pro est en cours de validation ».
- Après validation par la gérante (F19), il voit les prix de palier partout, et un e-mail l'informe. En cas de refus, un e-mail l'informe et il reste client détail.
- Lien « Devenir client pro » dans le pied de page et sur la fiche produit (RG-06).
- Critères d'acceptation :
  - Aucun montant de gros n'est présent dans le HTML servi à un visiteur ou à un client détail, y compris dans les données JSON de la page.
  - Les prix de palier d'un compte pro sont chargés après connexion par un appel léger, sans rendre les pages publiques dynamiques (voir section 10).

### F10. Pages de contenu (M)

- Pages : À propos, Contact (coordonnées, plan ou adresse, horaires, boutons appeler et WhatsApp, pas de formulaire), Livraison et retrait, FAQ, Conditions de vente, Politique de confidentialité, Mentions légales.
- Le contenu vient de la table `Page` (éditable dans l'admin) avec un texte de départ FR et EN généré à partir de la section 14, à faire relire par la cliente.
- Section témoignages sur l'accueil : alimentée par `Testimonial`.
- Critères d'acceptation :
  - Chaque page existe dans les deux langues.
  - Le texte de la page Livraison reprend les zones et les frais saisis dans l'admin.

### F11. SEO et partage (M)

Détaillé en section 11.

---

## 8. Fonctionnalités du back-office

### 8.1 Une application d'administration à part

L'admin est un espace distinct de la vitrine : adresse propre (`/admin`), mise en page propre, navigation propre, page de connexion propre. Il n'affiche ni l'en-tête, ni le pied de page, ni le bouton WhatsApp de la vitrine. Il est en français uniquement, non indexé (`noindex`), et entièrement utilisable sur téléphone, car la gérante s'en servira surtout depuis son smartphone. Toutes les listes sont paginées côté serveur (25 lignes par page) et leurs filtres vivent dans l'URL.

**Mise en page**

- Sur ordinateur : menu latéral fixe à gauche. Barre supérieure avec la recherche globale, le bouton « + Produit », le lien « Voir le site » (nouvel onglet) et le menu du compte.
- Sur mobile : barre de navigation en bas avec quatre entrées et « Menu » (tiroir avec le reste). OWNER : Accueil, Commandes, Produits, Stocks. MANAGER : Accueil, Produits, Stocks, Contenus.
- Le menu n'affiche que ce que le rôle permet. Des pastilles de compteur signalent les commandes à traiter, les demandes de compte pro et les stocks bas.
- Un fil d'Ariane sur chaque page de détail. Le bouton « Retour à la liste » conserve les filtres et la page.
- Mêmes jetons de design que la vitrine, en plus sobre. Si le design Figma Make ne contient pas d'écrans d'admin, ils sont conçus avec ces jetons. Les tableaux se transforment en cartes sur mobile.

**Plan des pages**

| Adresse | Écran | OWNER | MANAGER |
|---|---|---|---|
| `/admin/login` | Connexion admin | oui | oui |
| `/admin` | Tableau de bord (F13) | oui | version réduite |
| `/admin/commandes` | Liste des commandes | oui | non |
| `/admin/commandes/[id]` | Détail d'une commande | oui | non |
| `/admin/produits` | Liste des produits | oui | oui |
| `/admin/produits/nouveau` | Création d'un produit | oui | oui |
| `/admin/produits/[id]` | Fiche produit en onglets | oui | oui |
| `/admin/produits/import` | Import en lot | oui | oui |
| `/admin/categories` | Catégories | oui | oui |
| `/admin/stocks` | Stocks | oui | oui |
| `/admin/clients` | Onglets Clients et Demandes pro | oui | non |
| `/admin/clients/[id]` | Fiche client | oui | non |
| `/admin/livraison` | Onglets Zones et Points relais | oui | non |
| `/admin/contenus` | Onglets Pages, FAQ, Témoignages, Bannières | oui | oui |
| `/admin/exports` | Exports CSV | oui | non |
| `/admin/parametres` | Paramètres de la boutique | oui | non |
| `/admin/equipe` | Comptes admin | oui | non |
| `/admin/journal` | Journal d'activité (S) | oui | non |
| `/admin/mon-compte` | Nom et mot de passe | oui | oui |

**Liens entre les écrans.** Chaque mention d'une autre entité est un lien cliquable, via les composants partagés de la section 3.

| Depuis | Vers |
|---|---|
| Tableau de bord, chaque compteur | La liste filtrée : `/admin/commandes?statut=NEW`, `/admin/commandes?filtre=relance`, `/admin/clients?onglet=pro`, `/admin/stocks?filtre=bas` |
| Tableau de bord, dernières commandes | Le détail de chaque commande |
| Commande, nom du client | La fiche client s'il a un compte. Sinon, recherche des autres commandes du même téléphone (`/admin/commandes?q=<téléphone>`) |
| Commande, chaque ligne | La fiche produit, onglet Variantes et stock, variante surlignée |
| Commande, zone et point relais | L'écran Livraison, élément concerné |
| Fiche client | Ses commandes, sa demande pro avec les boutons Valider et Refuser |
| Fiche produit | Onglet Commandes (commandes qui contiennent ce produit), onglet Mouvements (chaque mouvement lié à une commande renvoie à cette commande), sa catégorie, « Voir sur le site » |
| Stocks, chaque ligne | La fiche produit. Un mouvement lié à une commande renvoie à la commande |
| Catégories, nombre de produits | `/admin/produits?categorie=<id>`, et « Voir sur le site » |
| Livraison, nombre de commandes d'une zone | `/admin/commandes?zone=<id>` |
| Import, rapport | La fiche de chaque produit créé ou mis à jour |
| Contenus (page, bannière, FAQ, témoignage) | « Voir sur le site » |
| Recherche globale | Commande (numéro, nom, téléphone), produit (nom, référence), client (nom, e-mail, téléphone). Résultats groupés par type, chacun mène à sa fiche |
| Vitrine vers admin | Barre discrète visible seulement pour un admin connecté, sur la fiche produit, les listes de catégorie et les pages de contenu : « Modifier dans l'admin » |

La barre admin de la vitrine s'affiche côté navigateur après une vérification de session par un petit appel, pour ne pas rendre les pages publiques dynamiques ni casser le cache (section 10). Un produit en brouillon ou archivé s'ouvre en aperçu depuis l'admin, avec un bandeau « Aperçu, non publié ».

Ce qui est enregistré dans l'admin apparaît aussitôt sur la vitrine : chaque enregistrement invalide le cache concerné (F14).

**Critères d'acceptation**

- Chaque page de détail a un fil d'Ariane et les liens du tableau ci-dessus.
- Depuis un compteur du tableau de bord, un seul tap ouvre la liste filtrée correspondante.
- Une adresse copiée avec ses filtres rouvre exactement le même écran.
- Aucun lien mort : grâce à RG-30, un produit ou une variante liés à une commande existent toujours.
- Les pages `/admin` portent `noindex` et sont exclues du sitemap.
- Le menu d'un MANAGER n'affiche pas les écrans interdits, et l'adresse directe renvoie une erreur 403.

### F12. Accès, comptes admin et navigation (M)

- Connexion `/admin/login`, séparée de celle des clients. Un compte client ne donne aucun accès à `/admin`. Le premier OWNER est créé par le script de seed.
- Équipe (`/admin/equipe`, OWNER) : créer un compte OWNER ou MANAGER, changer un rôle, désactiver un compte, envoyer un lien de réinitialisation du mot de passe. Un OWNER ne peut ni se désactiver lui-même ni retirer le dernier OWNER.
- Mon compte (`/admin/mon-compte`) : nom et changement de mot de passe.
- Journal (`/admin/journal`, S) : exports, validations et refus de comptes pro, création de comptes admin, changements de rôle, à partir de la table `AdminLog`.
- Contrôle d'accès selon le tableau de la section 4, vérifié dans chaque page et chaque action serveur.
- Critères d'acceptation :
  - Un MANAGER qui ouvre l'adresse d'une page réservée à l'OWNER obtient une erreur 403.
  - Déconnexion automatique après 12 heures d'inactivité.
  - Impossible de supprimer ou désactiver le dernier OWNER.

### F13. Tableau de bord (M)

- Pour l'OWNER : nombre de commandes `NEW`, commandes « À relancer », demandes de compte pro en attente, variantes en stock bas ou à zéro (liste cliquable), commandes des 7 derniers jours (nombre et total).
- Pour le MANAGER : produits en brouillon, variantes en stock bas.
- Raccourcis : « Nouveau produit », « Voir le site ». Les cinq dernières commandes sont listées avec un lien vers chacune.
- Critères d'acceptation : chaque compteur mène à la liste filtrée correspondante (tableau de la section 8.1).

### F14. Gestion des produits (M)

- Liste : recherche (nom, référence), filtres (catégorie, statut, stock bas), tri, miniature, prix, stock total, statut. Actions rapides : publier, archiver, dupliquer.
- Formulaire : nom FR, nom EN facultatif, référence (générée automatiquement si vide, format `OS-P00001`), catégorie, marque facultative, descriptions FR et EN (2 000 caractères maximum), prix de détail, prix promo facultatif, prix semi-gros et gros facultatifs, badges (nouveau, populaire, mis en avant), statut, photos, variantes.
- Fiche produit en onglets : Infos, Photos, Variantes et stock, Commandes (commandes qui contiennent le produit), Mouvements (historique du stock). Boutons « Voir sur le site » et « Voir les commandes ». Après une création, redirection vers la fiche.
- Photos : jusqu'à 5, envoi multiple par glisser-déposer ou appareil photo du téléphone, réordonnables. Compression dans le navigateur avant envoi (côté long 1600 px, qualité 80), puis génération serveur de trois tailles en WebP (400, 800 et 1600 px) et d'une miniature floue. Refus au-delà de 5 Mo par fichier. Texte alternatif facultatif, proposé par défaut à partir du nom du produit.
- Variantes : tableau éditable (taille, couleur avec pastille, parfum, stock, seuil de stock bas, actif). Ajout rapide d'une grille taille × couleur. Maximum 50 variantes par produit. Un produit simple crée sa variante « par défaut » automatiquement (RG-22).
- Critères d'acceptation :
  - Création d'un produit complet en moins de 2 minutes depuis un téléphone.
  - Un produit sans photo peut rester en brouillon mais ne peut pas être publié.
  - Le slug est généré à partir du nom et reste unique.
  - Toute modification invalide le cache concerné (section 10).
  - Un produit lié à une commande ne peut pas être supprimé, seulement archivé (RG-30).

### F15. Import de produits en lot (M)

- Import CSV ou XLSX depuis l'admin, avec un modèle téléchargeable. Colonnes : `reference`, `categorie`, `nom_fr`, `nom_en`, `description_fr`, `description_en`, `marque`, `prix_detail`, `prix_promo`, `prix_semi_gros`, `prix_gros`, `taille`, `couleur`, `parfum`, `stock`, `nouveau`, `populaire`, `statut`. Une ligne par variante ; les lignes qui partagent la même référence forment un seul produit.
- Étape de prévisualisation : nombre de produits à créer, à mettre à jour (rapprochement par référence), lignes en erreur avec le motif. Rien n'est écrit avant confirmation.
- Le traitement se fait par lots de 200 lignes, 2 000 lignes maximum par fichier.
- Les photos se téléversent en lot : le nom de fichier `REFERENCE-1.jpg`, `REFERENCE-2.jpg` rattache la photo au produit et fixe l'ordre. Fichiers sans correspondance listés dans le rapport (S).
- Critères d'acceptation :
  - Un fichier de 500 lignes s'importe sans dépasser le délai de la fonction serveur, avec barre de progression.
  - Un stock importé crée un mouvement `IMPORT`.
  - Le fichier n'écrase jamais un prix ou un stock avec une cellule vide (cellule vide = valeur inchangée).

### F16. Catégories (M)

- Création, modification, réordonnancement, désactivation. Deux niveaux maximum. Catégories de départ : Vêtements, Sacs, Accessoires, Parfums.
- Une catégorie qui contient des produits ne se supprime pas, elle se désactive.

### F17. Stocks (M)

- Vue « Stocks » : liste des variantes avec produit, référence, taille, couleur, stock, seuil. Filtres : stock bas, épuisé. Modification du stock directement dans la ligne (champ numérique, enregistrement à la sortie du champ).
- Chaque ligne renvoie à la fiche produit. Un mouvement lié à une commande renvoie à cette commande.
- Chaque modification crée un `StockMovement` (raison `MANUAL`, utilisateur, écart). Historique consultable par variante.
- Alerte : quand un décompte fait passer une variante sous son seuil, un e-mail E8 est envoyé à l'OWNER (un seul par passage sous le seuil) et la variante apparaît dans le tableau de bord.
- Critères d'acceptation :
  - Deux confirmations de commande simultanées ne peuvent jamais rendre un stock négatif.
  - Le stock d'une variante ne peut pas être saisi en négatif.

### F18. Commandes (M)

- Liste : recherche (numéro, nom, téléphone), filtres (statut, date, « À relancer », reçu demandé), tri par date. Badges de statut en niveaux de gris et un seul accent pour « À relancer ».
- Détail : le nom du client, chaque ligne de commande, la zone et le point relais sont des liens (section 8.1). Coordonnées avec boutons « Appeler » et « WhatsApp » (message pré-rempli selon le statut, en FR ou EN selon la langue de la commande), lignes, totaux, mode de livraison, note du client, note interne, historique des événements.
- Actions : changer le statut (selon RG-09), modifier les lignes tant que `NEW` (RG-11), enregistrer une tentative de contact, changer l'état du paiement et sa note, imprimer le reçu.
- Reçu : page imprimable (feuille de style d'impression) avec les informations de la boutique, le numéro, les lignes, les totaux et la mention « Payé à la réception » ou « À payer à la réception ».
- Critères d'acceptation :
  - La confirmation applique RG-10 et affiche clairement les lignes en défaut de stock.
  - Chaque changement de statut crée un événement avec l'utilisateur et l'heure, et déclenche l'e-mail correspondant si le client a une adresse.
  - L'historique d'une commande n'est jamais modifiable ni supprimable.

### F19. Clients et comptes pro (M)

- Liste des clients avec recherche. Onglet « Demandes pro » : boutique, ville, téléphone, date. Boutons Valider et Refuser (avec e-mail au client, texte du refus facultatif).
- Fiche client (`/admin/clients/[id]`) : coordonnées, statut pro, liste de ses commandes avec liens, boutons Valider, Refuser et Repasser en client détail.
- Un compte pro validé peut être repassé en client détail.

### F20. Livraison (M)

- Zones : nom FR et EN, villes incluses, frais détail, frais gros. Zones de départ à ajuster par la cliente : Yaoundé ; Douala, Edéa, Bafoussam, Kribi, Limbé ; Autres villes. Montants à 0 tant que la cliente ne les a pas donnés.
- Points relais : nom, ville, adresse, téléphone, actif.
- Le texte du délai (2 jours) est un réglage.

### F21. Contenus (M)

- Pages de contenu : éditeur simple (texte avec titres, listes, liens) en FR et EN, avec aperçu. Le contenu est nettoyé avant affichage (aucun script accepté).
- FAQ : questions et réponses FR et EN, ordre modifiable.
- Témoignages (S) : auteur, ville, texte, photo facultative, actif ou non.
- Bannières d'accueil : image, titre, sous-titre, lien, ordre, actif ou non.
- Chaque élément a un lien « Voir sur le site ».

### F22. Paramètres de la boutique (M)

- Nom, coordonnées, numéro WhatsApp, horaires, adresse, liens sociaux, numéro d'identification légal, e-mail de notification des commandes, seuils des paliers, seuil de stock bas par défaut, délai de livraison affiché.
- Toute valeur utilisée sur la vitrine se lit ici, jamais dans le code.

### F23. Exports CSV (M)

- Commandes (filtrables par période et statut) et clients, en CSV encodé UTF-8 avec BOM pour s'ouvrir correctement dans Excel, séparateur point-virgule.
- Réservé à l'OWNER. Chaque export est journalisé (qui, quand).

---

## 9. E-mails (F24, M)

Envoi avec Resend, gabarits FR et EN choisis selon la langue de la commande ou du compte. Un échec d'envoi ne bloque jamais l'action : il est enregistré (événement `EMAIL_SENT` avec le résultat), retenté une fois, et visible dans le détail de la commande.

| Code | Événement | Destinataire | Condition |
|---|---|---|---|
| E1 | Commande reçue | Client | Adresse e-mail saisie |
| E2 | Nouvelle commande | E-mail de notification de la boutique | Toujours |
| E3 | Commande confirmée | Client | Adresse e-mail saisie |
| E4 | Commande prête (retrait ou point relais) ou expédiée | Client | Adresse e-mail saisie |
| E5 | Commande annulée | Client | Adresse e-mail saisie |
| E6 | Compte pro validé ou refusé | Utilisateur | Toujours |
| E7 | Réinitialisation du mot de passe | Utilisateur | Toujours |
| E8 | Stock bas | OWNER | Passage sous le seuil |

Contenu de E1 et E3 : numéro de commande, lignes, total, frais de livraison, mode de livraison, rappel « Paiement à la réception » et rappel de la règle d'échange sans remboursement. Bouton de suivi vers `/suivi`.

---

## 10. Performance et volume de produits

La cliente pourra publier beaucoup de produits. Le site doit rester aussi rapide avec 5 000 produits qu'avec 50. Cette section est un critère d'acceptation global.

**Jeu de test.** Un script `pnpm seed:perf` crée 5 000 produits, 15 000 variantes et leurs images de test. Toutes les mesures ci-dessous se font avec ce jeu.

**Objectifs mesurés** (profil mobile milieu de gamme, réseau Slow 4G ém…

> **[Coupure du document ici.]** Le texte reçu s'arrête à cette phrase. La suite de la section 10, ainsi que les sections 11 à 14, manquent — voir la note en tête de ce fichier et `docs/decisions.md`.
