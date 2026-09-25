# OPENSTYLE — Prototype e-commerce professionnel

## 1. Rôle et objectif

Tu es un expert senior en UI/UX Design, Product Design, e-commerce, conversion mobile et conception d’interfaces modernes destinées à être développées avec Next.js.

Conçois un prototype complet, cohérent, réaliste et haut de gamme pour **OPENSTYLE**, une boutique de prêt-à-porter, sacs, accessoires et parfums.

Le prototype doit être pensé comme la base d’un futur développement web avec :

* Next.js
* TypeScript
* Tailwind CSS
* Architecture responsive mobile-first
* Composants réutilisables
* Interface rapide, accessible et optimisée pour la conversion
* Design facilement transformable en code

Ne crée pas une simple landing page. Crée une véritable expérience e-commerce complète avec les parcours client, les pages, les interactions et les interfaces d’administration nécessaires.

---

# 2. Informations réelles sur la marque

## Identité

* Nom de la marque : OPENSTYLE
* Responsable : Toko Tchazue Thérèse Doriane
* Activité : vente de vêtements, sacs, accessoires et parfums
* Année de création : 2023
* Localisation principale : Yaoundé, Mokolo, Elobi, Centre commercial Dubaï Market
* Horaires : 08h00 à 18h30
* Téléphone / WhatsApp : +216 656356687
* E-mail : [Openstyle911@gmail.com](mailto:Openstyle911@gmail.com)
* Zone commerciale principale : Yaoundé
* Expédition : partout au Cameroun

## Positionnement

OPENSTYLE doit être perçue comme une boutique :

* Élégante
* Professionnelle
* Accessible
* Fiable
* Moderne
* Orientée qualité
* À l’écoute de ses clients
* Adaptée aux achats sur mobile

## Slogan

« Un style qui s’accorde à votre identité. »

## Valeurs

* Qualité
* Élégance
* Satisfaction
* Confiance

## Différenciation

La marque met en avant des pièces élégantes et soigneusement sélectionnées, avec une attention particulière portée à la qualité, au style et à la satisfaction client.

---

# 3. Direction artistique

## Style général

Créer un design :

* Premium mais accessible
* Élégant sans être prétentieux
* Minimaliste mais visuellement impactant
* Moderne et éditorial
* Féminin et unisexe lorsque nécessaire
* Inspiré des boutiques de mode contemporaines
* Adapté au marché camerounais
* Très professionnel
* Facile à utiliser par des personnes non techniques

Éviter absolument :

* Les designs génériques de boutiques Shopify
* Les interfaces trop colorées
* Les dégradés excessifs
* Les effets 3D inutiles
* Les cartes surchargées
* Les animations trop agressives
* Les textes artificiels ou trop longs
* Les interfaces qui ressemblent à un simple template

## Palette de couleurs

Utiliser principalement :

* Noir profond : #111111
* Noir secondaire : #1C1C1C
* Blanc : #FFFFFF
* Blanc cassé : #F7F7F5
* Gris clair : #EAEAEA
* Gris texte secondaire : #6B6B6B

Le noir et blanc doit être la base de l’identité visuelle.

Utiliser éventuellement une nuance grise très discrète pour créer la hiérarchie visuelle. Ne pas introduire de couleur vive sans nécessité.

## Typographie

Utiliser une combinaison élégante et lisible :

* Titres : une police moderne avec caractère éditorial, par exemple Playfair Display, Cormorant Garamond ou une alternative élégante disponible
* Texte et interface : Inter, Manrope ou DM Sans

La typographie doit rester lisible sur mobile.

## Style des images

Utiliser des images de mode réalistes et cohérentes :

* Vêtements présentés sur mannequins ou modèles
* Sacs dans des compositions propres
* Parfums avec des compositions élégantes
* Accessoires photographiés sur fond neutre
* Lumière naturelle ou studio
* Arrière-plans sobres
* Images de qualité commerciale

Ne pas utiliser d’images incohérentes entre elles.

---

# 4. Principes UX obligatoires

Le site doit respecter les principes suivants :

1. Mobile-first, car la majorité des clients utilisent un téléphone.
2. Navigation simple et immédiatement compréhensible.
3. Accès rapide au catalogue.
4. Ajout au panier visible et intuitif.
5. Commande possible sans créer de compte.
6. Bouton WhatsApp visible sur toutes les pages.
7. Parcours d’achat court et rassurant.
8. Informations de livraison clairement présentées.
9. Distinction claire entre vente au détail et vente en gros.
10. Prix de gros visibles uniquement après validation du compte professionnel.
11. Interface accessible et lisible.
12. Boutons suffisamment grands pour une utilisation tactile.
13. États de chargement, erreurs, succès et rupture de stock prévus.
14. Design responsive pour mobile, tablette et ordinateur.
15. Aucun écran ne doit sembler vide ou inachevé.

---

# 5. Architecture générale du site

Créer les pages suivantes :

## Pages publiques

* Accueil
* Boutique
* Catégories
* Page catégorie
* Page produit
* Recherche
* Panier
* Commande / Checkout
* Confirmation de commande
* Connexion
* Inscription
* Mot de passe oublié
* Mon compte
* Mes commandes
* Détail d’une commande
* Profil client
* Page dédiée aux clients professionnels
* Demande d’accès aux tarifs de gros
* Promotions
* Nouveautés
* À propos
* Livraison
* FAQ
* Contact
* Conditions générales de vente
* Politique de confidentialité
* Politique de retour et d’échange

## Pages d’administration

* Connexion administrateur
* Tableau de bord
* Gestion des produits
* Ajouter un produit
* Modifier un produit
* Gestion des catégories
* Gestion des stocks
* Gestion des commandes
* Détail d’une commande
* Gestion des clients
* Validation des comptes professionnels
* Gestion des tarifs de gros
* Gestion des promotions
* Gestion des avis
* Gestion des utilisateurs administrateurs
* Rapports et statistiques
* Paramètres du site

---

# 6. Header et navigation

## Desktop

Créer un header élégant comprenant :

* Logo OPENSTYLE à gauche
* Navigation principale :

  * Accueil
  * Boutique
  * Vêtements
  * Sacs
  * Accessoires
  * Parfums
  * Promotions
* Barre de recherche
* Icône compte
* Icône panier avec compteur
* Bouton ou icône WhatsApp

Le header peut devenir sticky après défilement.

## Mobile

Créer un header mobile comprenant :

* Menu hamburger
* Logo OPENSTYLE centré ou aligné à gauche
* Icône recherche
* Icône panier avec compteur
* Navigation latérale ou menu plein écran
* Bouton WhatsApp flottant

La navigation mobile doit être extrêmement simple.

---

# 7. Page d’accueil

Créer une page d’accueil visuellement forte et orientée conversion.

## Section Hero

Présenter une image de mode élégante avec un message court :

Titre :

« Votre style, votre identité. »

Sous-titre :

« Découvrez une sélection de vêtements, sacs, accessoires et parfums soigneusement choisis pour accompagner votre quotidien. »

Boutons :

* Découvrir la boutique
* Voir les nouveautés

Prévoir une image forte, sobre et premium.

## Bandeau de confiance

Afficher quatre éléments :

* Produits soigneusement sélectionnés
* Livraison partout au Cameroun
* Paiement flexible
* Service client disponible sur WhatsApp

## Catégories principales

Créer quatre grandes cartes visuelles :

* Vêtements
* Sacs
* Accessoires
* Parfums

Chaque carte doit contenir :

* Image
* Nom de la catégorie
* Bouton « Découvrir »

## Section nouveautés

Afficher une grille de produits avec :

* Image
* Nom
* Prix
* Ancien prix si promotion
* Badge « Nouveau » si nécessaire
* Sélecteur de variante si utile
* Bouton d’ajout au panier
* Icône de consultation rapide

## Section produits populaires

Mettre en avant :

* Vêtements
* Sacs

Afficher une grille de produits réaliste.

## Section promotion

Créer une section visuelle dédiée aux offres et nouveautés.

Exemple :

« Les pièces du moment »

Bouton :

« Découvrir les offres »

## Section vente professionnelle

Créer un bloc discret mais clair pour les revendeurs et professionnels :

Titre :

« Vous achetez en quantité ? »

Texte :

« Accédez à nos tarifs professionnels après validation de votre compte. »

Bouton :

« Demander un accès professionnel »

Ne pas afficher les prix de gros publiquement.

## Section marque

Présenter OPENSTYLE avec un texte court :

« Chez OPENSTYLE, nous sélectionnons des pièces qui associent élégance, qualité et accessibilité, pour permettre à chacun de construire un style qui lui ressemble. »

Bouton :

« En savoir plus »

## Section avis clients

Créer des témoignages réalistes mais clairement présentés comme exemples de contenu à remplacer.

Afficher :

* Prénom
* Ville
* Note
* Commentaire court

## Section réseaux sociaux

Créer une section Instagram / TikTok / Facebook avec des visuels de produits et un appel à suivre la marque.

## Footer

Inclure :

* Logo
* Description courte
* Liens de navigation
* Catégories
* Informations de livraison
* Contact
* WhatsApp
* Réseaux sociaux
* Conditions générales
* Politique de confidentialité
* Politique de retour
* Copyright OPENSTYLE

---

# 8. Page Boutique

Créer une page catalogue complète.

## Éléments

* Titre « La boutique »
* Description courte
* Barre de recherche
* Filtres
* Tri
* Nombre de produits
* Grille responsive
* Pagination ou chargement progressif

## Filtres

Prévoir :

* Catégorie
* Prix
* Taille
* Couleur
* Parfum
* Disponibilité
* Nouveautés
* Promotions

Sur mobile, les filtres doivent s’ouvrir dans un panneau inférieur ou latéral.

## Carte produit

Chaque carte doit afficher :

* Image principale
* Badge promotion ou nouveauté
* Nom du produit
* Catégorie
* Prix
* Prix barré si promotion
* État du stock
* Bouton « Ajouter au panier »
* Bouton « Voir le produit »

Ne pas afficher de prix de gros sur le catalogue public.

---

# 9. Page produit

Créer une page produit complète et professionnelle.

## Mise en page

Desktop :

* Galerie d’images à gauche
* Informations produit à droite

Mobile :

* Galerie défilante
* Informations sous les images
* Bouton d’ajout au panier accessible

## Informations

Afficher :

* Nom du produit
* Référence
* Catégorie
* Prix de détail
* Disponibilité
* Description
* Tailles disponibles
* Couleurs disponibles
* Variante de parfum si applicable
* Quantité
* Bouton « Ajouter au panier »
* Bouton « Commander via WhatsApp »
* Informations de livraison
* Politique d’échange

## Réassurance

Afficher des informations comme :

* Livraison partout au Cameroun
* Paiement après confirmation selon la zone
* Échange possible selon les conditions
* Assistance WhatsApp

## Produits associés

Afficher des produits similaires ou complémentaires.

---

# 10. Panier

Créer un panier clair et simple.

Afficher :

* Image produit
* Nom
* Variante
* Prix
* Quantité
* Sous-total
* Suppression
* Total estimé
* Frais de livraison à calculer selon la distance
* Bouton « Passer la commande »
* Bouton « Commander via WhatsApp »

Prévoir un message si le panier est vide.

---

# 11. Checkout / commande

Le client doit pouvoir commander sans créer de compte.

## Étapes

1. Informations client
2. Adresse et zone de livraison
3. Mode de livraison
4. Mode de paiement
5. Récapitulatif
6. Confirmation

## Champs

* Nom et prénom
* Téléphone
* WhatsApp
* E-mail facultatif
* Ville
* Quartier / adresse
* Point relais ou retrait en boutique
* Instructions de livraison

## Modes de livraison

* Point relais
* Retrait en boutique
* Expédition selon la zone

## Modes de paiement

* Orange Money
* MTN Mobile Money
* Paiement à la livraison, uniquement à Yaoundé
* Acompte pour certaines commandes en gros

Le paiement direct doit être affiché comme une étape après confirmation de la commande, selon le fonctionnement réel de la boutique.

## Confirmation

Afficher :

* Numéro de commande
* Résumé
* Mode de paiement
* Mode de livraison
* Délai estimatif
* Bouton WhatsApp
* Message de confirmation

Exemple :

« Votre commande a bien été enregistrée. Notre équipe vous contactera pour confirmer les détails et le paiement. »

---

# 12. Parcours vente en gros

Créer un parcours professionnel distinct, même sans page publique dédiée obligatoire.

## Accès

Dans le compte client, prévoir un bouton :

« Demander l’accès aux tarifs professionnels »

## Formulaire professionnel

Champs :

* Nom complet
* Nom de l’entreprise ou boutique
* Téléphone
* WhatsApp
* Ville
* Activité
* Quantité moyenne souhaitée
* Type de client : revendeur, boutique, entreprise, distributeur
* Informations complémentaires

## États du compte

* Demande envoyée
* En attente de validation
* Compte validé
* Compte refusé

## Après validation

Le client professionnel peut voir :

* Prix de gros
* Prix semi-gros
* Quantité minimale
* Disponibilité
* Conditions spécifiques

La quantité minimale configurée doit pouvoir être représentée à partir de 10 pièces, tandis que la cliente a également mentionné 20 pièces comme seuil de grossiste. Prévoir une logique administrable plutôt qu’une valeur figée.

---

# 13. Compte client

Créer un espace client comprenant :

* Tableau de bord
* Informations personnelles
* Mes commandes
* Détail d’une commande
* Statut de commande
* Accès professionnel
* Adresse
* Préférences
* Déconnexion

## Statuts de commande

* En attente de confirmation
* Confirmée
* En préparation
* Expédiée
* Prête au retrait
* Livrée
* Annulée

Le suivi peut être associé à un numéro de commande envoyé par SMS ou WhatsApp.

---

# 14. Page À propos

Créer une page éditoriale élégante.

Contenu :

* Présentation d’OPENSTYLE
* Histoire depuis 2023
* Valeurs
* Engagement qualité
* Sélection des produits
* Localisation à Yaoundé
* Photos de la boutique ou de l’équipe

Le ton doit être humain, professionnel et crédible.

---

# 15. Pages Livraison, FAQ et Contact

## Livraison

Présenter clairement :

* Yaoundé
* Expédition partout au Cameroun
* Délai moyen annoncé : environ deux jours, à confirmer selon la destination
* Point relais
* Retrait en boutique
* Frais calculés selon la distance
* Frais pouvant varier entre détail et gros
* Procédure en cas d’absence du client

## FAQ

Créer des questions sur :

* Comment commander ?
* Quels sont les moyens de paiement ?
* Livrez-vous hors de Yaoundé ?
* Peut-on payer à la livraison ?
* Comment accéder aux tarifs de gros ?
* Quels sont les délais ?
* Peut-on échanger un article ?
* Comment contacter OPENSTYLE ?

## Contact

Inclure :

* Téléphone
* WhatsApp
* E-mail
* Adresse
* Horaires
* Formulaire de contact
* Carte ou bloc de localisation
* Bouton d’appel
* Bouton WhatsApp

---

# 16. Interface d’administration

Créer un dashboard moderne, fonctionnel et réaliste.

## Tableau de bord

Afficher :

* Chiffre d’affaires estimé
* Nombre de commandes
* Commandes en attente
* Produits en rupture
* Produits à stock faible
* Clients inscrits
* Demandes professionnelles en attente
* Graphique des ventes
* Dernières commandes

Les chiffres peuvent être fictifs uniquement pour illustrer l’interface.

## Gestion des produits

Fonctionnalités visuelles :

* Liste des produits
* Recherche
* Filtres
* Ajouter un produit
* Modifier
* Supprimer
* Activer / désactiver
* Gérer les images
* Gérer les variantes
* Prix de détail
* Prix de gros
* Stock
* Catégorie
* Statut

## Formulaire produit

Champs :

* Nom
* Description
* Catégorie
* Images
* Prix de détail
* Prix promotionnel
* Prix semi-gros
* Prix gros
* Quantité minimale
* Stock
* Tailles
* Couleurs
* Variantes
* Référence
* Statut de publication

## Gestion des commandes

Afficher :

* Numéro
* Client
* Date
* Montant
* Mode de paiement
* Livraison
* Statut
* Actions

Créer une page détaillée avec :

* Informations client
* Produits
* Quantités
* Adresse
* Historique de statut
* Notes internes
* Confirmation manuelle
* Export

## Gestion des stocks

Prévoir :

* Stock disponible
* Stock faible
* Rupture
* Seuil d’alerte
* Historique des mouvements

## Gestion des clients professionnels

Afficher :

* Liste des demandes
* Informations de l’entreprise
* Ville
* Téléphone
* Statut
* Date de demande
* Boutons valider / refuser
* Attribution du niveau tarifaire

## Gestion des administrateurs

Prévoir différents rôles :

* Administrateur
* Gérante
* Informaticien

Les droits d’accès doivent être différenciés.

## Export

Prévoir des boutons d’export :

* Commandes CSV
* Clients CSV
* Produits CSV

---

# 17. Responsive design

Créer obligatoirement les versions :

* Mobile : 390 px environ
* Tablette : 768 px environ
* Desktop : 1440 px environ

Priorité :

1. Mobile
2. Tablette
3. Desktop

Le site doit être parfaitement utilisable sur téléphone.

Sur mobile :

* Navigation compacte
* Boutons tactiles
* Panier accessible
* Filtres faciles à ouvrir
* Checkout en une colonne
* Images optimisées
* WhatsApp flottant
* Aucun texte trop petit
* Aucun tableau horizontal difficile à lire

---

# 18. Composants réutilisables à prévoir

Créer une bibliothèque de composants cohérente :

* Header
* Footer
* Navigation mobile
* ProductCard
* ProductGrid
* ProductGallery
* CategoryCard
* Badge
* Button
* Input
* Select
* Checkbox
* FilterDrawer
* SearchBar
* CartDrawer
* QuantitySelector
* PriceDisplay
* StockStatus
* OrderStatus
* Modal
* Toast
* Accordion
* Pagination
* EmptyState
* LoadingSkeleton
* ErrorState
* WhatsAppButton
* AdminSidebar
* AdminTable
* StatCard
* DashboardChart

Utiliser des composants cohérents et facilement transposables dans Next.js et Tailwind CSS.

---

# 19. États et interactions à prototyper

Prévoir les interactions suivantes :

* Ouverture du menu mobile
* Recherche de produit
* Filtrage par catégorie
* Tri des produits
* Ouverture de la fiche produit
* Sélection de taille et couleur
* Modification de quantité
* Ajout au panier
* Ouverture du panier
* Suppression d’un article
* Passage au checkout
* Validation du formulaire
* Sélection du mode de livraison
* Sélection du paiement
* Confirmation de commande
* Demande d’accès professionnel
* Connexion et inscription
* Navigation dans le compte client
* Modification du statut d’une commande dans l’admin
* Ajout et modification d’un produit dans l’admin

---

# 20. Contenu et données de démonstration

Créer des données réalistes pour le prototype :

## Catégories

* Vêtements
* Sacs
* Accessoires
* Parfums

## Produits exemples

Créer au moins 12 à 20 produits fictifs mais crédibles, avec :

* Nom réaliste
* Image adaptée
* Prix en FCFA
* Catégorie
* Description courte
* Variantes
* Stock
* Badge éventuel

Les prix doivent être présentés en **FCFA**, car le commerce cible principalement le Cameroun.

Ne pas utiliser de produits ou de marques protégées de manière trompeuse. Pour les parfums, utiliser des noms génériques ou des noms de démonstration.

---

# 21. Contraintes techniques pour le futur développement

Le design doit être compatible avec une implémentation Next.js.

Prévoir une structure facilement traduisible en :

* App Router
* TypeScript
* Tailwind CSS
* Composants React réutilisables
* API routes ou backend séparé
* Base de données produits, commandes, clients et stocks
* Authentification client et administrateur
* Gestion des rôles
* Gestion des médias
* Intégration WhatsApp
* Intégration Orange Money / MTN Mobile Money selon les prestataires disponibles
* Système de commandes manuelles et de confirmation
* SEO technique
* Données structurées produits
* Pages rapides et accessibles

Ne pas concevoir de fonctionnalités impossibles à développer ou dépendantes d’animations complexes.

---

# 22. Résultat attendu

Génère un prototype complet, cohérent et visuellement impressionnant pour OPENSTYLE.

Le résultat doit comprendre :

* Toutes les pages principales
* Les parcours d’achat
* Le parcours de vente en gros
* Le compte client
* Le tableau de bord administrateur
* Les états vides, erreurs, succès et chargements
* Les versions mobile, tablette et desktop
* Une identité visuelle noir et blanc élégante
* Des composants cohérents
* Des contenus réalistes
* Une hiérarchie visuelle claire
* Une expérience adaptée aux utilisateurs camerounais
* Une interface qui inspire confiance et facilite la commande

Le design doit être suffisamment détaillé pour permettre à un développeur Next.js de commencer l’intégration sans devoir réinventer toute l’interface.

Ne produis pas une maquette générique. Conçois une véritable expérience de marque pour OPENSTYLE, élégante, accessible, professionnelle, différenciante et orientée conversion.
