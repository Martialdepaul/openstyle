import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { effectiveTier, tierForQuantity, unitPrice } from "../lib/pricing";
import { availableDeliveryMethods, deliveryFee, findZoneForCity } from "../lib/delivery";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

type SeedVariantAxis = { sizes?: string[]; colors?: string[]; scents?: string[] };

type SeedProduct = {
  slug: string;
  reference: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  categorySlug: string;
  priceRetail: number;
  pricePromo?: number;
  imageUrl: string;
  isNew?: boolean;
  isPromo?: boolean;
  isPopular?: boolean;
  variants: SeedVariantAxis;
  /** Motif de stock répété sur les combinaisons générées (0 = épuisé pour tester RG-23/24). */
  stockPattern: number[];
};

/**
 * Catégories de démonstration. `parentSlug` permet une sous-catégorie
 * (F16, deux niveaux maximum) pour montrer la hiérarchie dans l'admin.
 */
const categories = [
  {
    slug: "vetements",
    nameFr: "Vêtements",
    nameEn: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop&auto=format",
    parentSlug: null as string | null,
  },
  {
    slug: "sacs",
    nameFr: "Sacs",
    nameEn: "Bags",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop&auto=format",
    parentSlug: null as string | null,
  },
  {
    slug: "accessoires",
    nameFr: "Accessoires",
    nameEn: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&h=800&fit=crop&auto=format",
    parentSlug: null as string | null,
  },
  {
    slug: "parfums",
    nameFr: "Parfums",
    nameEn: "Perfumes",
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop&auto=format",
    parentSlug: null as string | null,
  },
  {
    slug: "robes",
    nameFr: "Robes",
    nameEn: "Dresses",
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&auto=format",
    parentSlug: "vetements" as string | null,
  },
];

const products: SeedProduct[] = [
  {
    slug: "robe-midi-elegante",
    reference: "OS-VET-001",
    nameFr: "Robe Midi Élégante",
    nameEn: "Elegant Midi Dress",
    descriptionFr:
      "Une robe midi fluide et élégante, parfaite pour toutes les occasions. Tissu de qualité supérieure avec une coupe impeccable qui met en valeur la silhouette.",
    descriptionEn: "A flowing, elegant midi dress, perfect for any occasion. Premium fabric with an impeccable cut.",
    categorySlug: "robes",
    priceRetail: 35000,
    pricePromo: 28000,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&auto=format",
    isPromo: true,
    variants: { sizes: ["S", "M", "L"], colors: ["Noir", "Beige"] },
    stockPattern: [8, 5, 0, 4, 6, 2],
  },
  {
    slug: "blazer-structure",
    reference: "OS-VET-002",
    nameFr: "Blazer Structuré",
    nameEn: "Structured Blazer",
    descriptionFr: "Blazer tailored au tombé parfait. Une pièce versatile qui se porte au bureau comme en soirée.",
    descriptionEn: "Tailored blazer with a perfect drape. A versatile piece for the office or an evening out.",
    categorySlug: "vetements",
    priceRetail: 42000,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&auto=format",
    isNew: true,
    isPopular: true,
    variants: { sizes: ["S", "M", "L", "XL"], colors: ["Noir", "Gris anthracite"] },
    stockPattern: [10, 7, 3, 5, 6, 2, 0, 4],
  },
  {
    slug: "chemise-oversize",
    reference: "OS-VET-003",
    nameFr: "Chemise Oversize",
    nameEn: "Oversized Shirt",
    descriptionFr: "Chemise oversize tendance en coton doux, coupe décontractée.",
    descriptionEn: "Trendy oversized shirt in soft cotton, relaxed cut.",
    categorySlug: "vetements",
    priceRetail: 22000,
    pricePromo: 18500,
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&auto=format",
    isPromo: true,
    isPopular: true,
    variants: { sizes: ["S", "M", "L", "XL"], colors: ["Blanc", "Bleu ciel"] },
    stockPattern: [9, 6, 4, 3, 5, 1, 7, 2],
  },
  {
    slug: "jupe-plissee",
    reference: "OS-VET-004",
    nameFr: "Jupe Plissée Mi-Longue",
    nameEn: "Pleated Midi Skirt",
    descriptionFr: "Jupe plissée fluide et légère, un basique élégant.",
    descriptionEn: "Light, flowing pleated skirt, an elegant basic.",
    categorySlug: "vetements",
    priceRetail: 21000,
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop&auto=format",
    variants: { sizes: ["XS", "S", "M"], colors: ["Noir", "Terracotta"] },
    stockPattern: [0], // toutes les combinaisons épuisées (RG-23)
  },
  {
    slug: "sac-cabas-cuir",
    reference: "OS-SAC-001",
    nameFr: "Sac Cabas Cuir",
    nameEn: "Leather Tote Bag",
    descriptionFr: "Grand cabas en cuir synthétique de qualité, spacieux et fonctionnel.",
    descriptionEn: "Large tote in quality faux leather, spacious and functional.",
    categorySlug: "sacs",
    priceRetail: 35000,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&auto=format",
    isNew: true,
    isPopular: true,
    variants: { colors: ["Noir", "Caramel"] },
    stockPattern: [12, 0],
  },
  {
    slug: "mini-sac-bandouliere",
    reference: "OS-SAC-002",
    nameFr: "Mini Sac Bandoulière",
    nameEn: "Mini Shoulder Bag",
    descriptionFr: "Mini sac bandoulière chic et compact, chaîne dorée élégante.",
    descriptionEn: "Chic, compact mini shoulder bag with an elegant gold chain.",
    categorySlug: "sacs",
    priceRetail: 27000,
    pricePromo: 22000,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&auto=format",
    isPromo: true,
    variants: { colors: ["Noir", "Bordeaux"] },
    stockPattern: [6, 2],
  },
  {
    slug: "ceinture-cuir-doree",
    reference: "OS-ACC-001",
    nameFr: "Ceinture Cuir Dorée",
    nameEn: "Golden Leather Belt",
    descriptionFr: "Ceinture fine en cuir avec boucle dorée.",
    descriptionEn: "Slim leather belt with a gold buckle.",
    categorySlug: "accessoires",
    priceRetail: 12000,
    imageUrl: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=600&h=800&fit=crop&auto=format",
    isNew: true,
    variants: { sizes: ["S/M", "M/L"], colors: ["Noir", "Marron"] },
    stockPattern: [15, 8, 3, 0],
  },
  {
    slug: "lunettes-cat-eye",
    reference: "OS-ACC-002",
    nameFr: "Lunettes de Soleil Cat Eye",
    nameEn: "Cat Eye Sunglasses",
    descriptionFr: "Lunettes cat eye tendance, protection UV400.",
    descriptionEn: "Trendy cat eye sunglasses, UV400 protection.",
    categorySlug: "accessoires",
    priceRetail: 15000,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop&auto=format",
    variants: { colors: ["Noir", "Écaille"] },
    stockPattern: [9, 5],
  },
  {
    slug: "elixir-nuit-parfum-femme",
    reference: "OS-PAR-001",
    nameFr: "Élixir Nuit — Parfum Femme",
    nameEn: "Night Elixir — Women's Perfume",
    descriptionFr: "Fragrance envoûtante aux notes de rose, vanille et musc.",
    descriptionEn: "A captivating fragrance with notes of rose, vanilla and musk.",
    categorySlug: "parfums",
    priceRetail: 25000,
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=800&fit=crop&auto=format",
    isNew: true,
    isPopular: true,
    variants: { scents: ["30ml", "50ml", "100ml"] },
    stockPattern: [10, 6, 2],
  },
  {
    slug: "lumiere-or-unisexe",
    reference: "OS-PAR-002",
    nameFr: "Lumière d'Or — Unisexe",
    nameEn: "Golden Light — Unisex",
    descriptionFr: "Parfum unisexe aux notes d'ambre, oud et fleur d'oranger.",
    descriptionEn: "Unisex fragrance with amber, oud and orange blossom notes.",
    categorySlug: "parfums",
    priceRetail: 38000,
    pricePromo: 32000,
    imageUrl: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop&auto=format",
    isPromo: true,
    variants: { scents: ["50ml", "100ml"] },
    stockPattern: [7, 0],
  },
];

const banners = [
  {
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&h=1000&fit=crop&auto=format",
    titleFr: "Votre style, votre identité.",
    titleEn: "Your style, your identity.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1800&h=1000&fit=crop&auto=format",
    titleFr: "Nouvelle collection",
    titleEn: "New collection",
    subtitleFr: "Découvrez nos dernières pièces.",
    subtitleEn: "Discover our latest pieces.",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&h=1000&fit=crop&auto=format",
    titleFr: "Livraison partout au Cameroun",
    titleEn: "Delivery all over Cameroon",
  },
];

const testimonials = [
  {
    author: "Aïcha M.",
    city: "Yaoundé",
    textFr: "Qualité exceptionnelle, robe arrivée rapidement et conforme aux photos. Je recommande vivement !",
  },
  {
    author: "Sandra K.",
    city: "Douala",
    textFr: "Le service est impeccable. J'ai commandé via WhatsApp et tout s'est passé parfaitement.",
  },
  {
    author: "Marie T.",
    city: "Bafoussam",
    textFr: "Des pièces vraiment élégantes à des prix accessibles. Ma boutique préférée !",
  },
  {
    author: "Grace N.",
    city: "Yaoundé",
    textFr: "Très bon accueil, conseils personnalisés et livraison rapide en point relais.",
  },
  {
    author: "Paul E.",
    city: "Yaoundé",
    textFr: "Le blazer est parfaitement coupé, exactement ce que je cherchais pour le bureau.",
  },
];

const faqItems = [
  {
    questionFr: "Comment passer une commande ?",
    questionEn: "How do I place an order?",
    answerFr: "Ajoutez vos articles au panier puis suivez les étapes de la page Commande. Aucun compte n'est nécessaire pour commander.",
    answerEn: "Add items to your cart, then follow the steps on the checkout page. No account is required to order.",
  },
  {
    questionFr: "Quels sont les délais de livraison ?",
    questionEn: "What are the delivery times?",
    answerFr: "Le retrait en boutique est immédiat. Pour les autres villes, comptez généralement 2 à 5 jours selon la destination.",
    answerEn: "In-store pickup is immediate. For other cities, allow 2 to 5 days depending on the destination.",
  },
  {
    questionFr: "Puis-je payer en ligne ?",
    questionEn: "Can I pay online?",
    answerFr: "Le paiement se fait uniquement à la réception de la commande, en espèces ou par mobile money.",
    answerEn: "Payment is only made upon receiving your order, in cash or via mobile money.",
  },
  {
    questionFr: "Comment devenir client professionnel ?",
    questionEn: "How do I become a professional client?",
    answerFr: "Cochez « Je suis un professionnel » lors de l'inscription, ou faites la demande depuis votre espace client. La boutique valide votre demande sous peu.",
    answerEn: "Check \"I am a professional\" when registering, or request it from your account. The shop validates your request shortly after.",
  },
  {
    questionFr: "Puis-je échanger un article ?",
    questionEn: "Can I exchange an item?",
    answerFr: "Oui, un échange est possible dans les conditions convenues avec la boutique au moment de la livraison.",
    answerEn: "Yes, an exchange is possible under the terms agreed with the shop at the time of delivery.",
  },
];

/**
 * F10 (pages de contenu) : texte de départ FR/EN, à faire relire par la
 * cliente (section 14 du cahier des charges jamais reçue) — voir
 * docs/decisions.md. Balises limitées à celles acceptées par le nettoyage
 * serveur (`lib/actions/page.ts`, `sanitize-html`).
 */
const pages = [
  {
    slug: "a-propos",
    titleFr: "À propos",
    titleEn: "About",
    bodyFr:
      "<h2>Notre histoire</h2><p>OpenStyle est une boutique de prêt-à-porter basée à Yaoundé, fondée par Toko Tchazue Thérèse Doriane. Nous sélectionnons avec soin des vêtements, sacs, accessoires et parfums pour accompagner votre style au quotidien.</p><h2>Notre engagement</h2><p>Chaque pièce est choisie pour sa qualité et son élégance. Un style qui s'accorde à votre identité, à des prix accessibles.</p>",
    bodyEn:
      "<h2>Our story</h2><p>OpenStyle is a ready-to-wear boutique based in Yaoundé, founded by Toko Tchazue Thérèse Doriane. We carefully select clothing, bags, accessories and perfumes for your everyday style.</p><h2>Our commitment</h2><p>Every piece is chosen for its quality and elegance — a style that matches your identity, at accessible prices.</p>",
  },
  {
    slug: "contact",
    titleFr: "Contact",
    titleEn: "Contact",
    bodyFr:
      "<h2>Nous contacter</h2><p>Retrouvez-nous à Yaoundé, Mokolo, Elobi — Centre commercial Dubaï Market.</p><p>Horaires : 08h00 – 18h30, du lundi au samedi.</p><p>Appelez-nous ou écrivez-nous sur WhatsApp, nous répondons rapidement.</p>",
    bodyEn:
      "<h2>Contact us</h2><p>Find us in Yaoundé, Mokolo, Elobi — Dubaï Market shopping center.</p><p>Hours: 8:00 AM – 6:30 PM, Monday to Saturday.</p><p>Call us or write to us on WhatsApp, we reply quickly.</p>",
  },
  {
    slug: "livraison-retrait",
    titleFr: "Livraison et retrait",
    titleEn: "Delivery and pickup",
    bodyFr:
      "<h2>Modes de livraison</h2><ul><li><strong>Retrait en boutique</strong> — gratuit, disponible pour toutes les villes.</li><li><strong>Point relais</strong> — disponible à Yaoundé.</li><li><strong>Expédition</strong> — vers les autres villes du Cameroun, via une agence de transport.</li></ul><p>Le paiement se fait à la réception de la commande.</p>",
    bodyEn:
      "<h2>Delivery options</h2><ul><li><strong>In-store pickup</strong> — free, available for all cities.</li><li><strong>Relay point</strong> — available in Yaoundé.</li><li><strong>Shipping</strong> — to other cities in Cameroon, via a transport agency.</li></ul><p>Payment is made upon receiving the order.</p>",
  },
  {
    slug: "conditions-vente",
    titleFr: "Conditions de vente",
    titleEn: "Terms of sale",
    bodyFr:
      "<h2>Conditions générales de vente</h2><p>Toute commande passée sur ce site implique l'acceptation pleine et entière des présentes conditions.</p><h3>Prix et paiement</h3><p>Les prix sont indiqués en francs CFA (FCFA). Le paiement s'effectue à la réception de la commande.</p><h3>Échanges</h3><p>Un article peut être échangé dans les conditions convenues avec la boutique au moment de la livraison.</p>",
    bodyEn:
      "<h2>Terms and conditions</h2><p>Placing an order on this site implies full acceptance of these terms.</p><h3>Prices and payment</h3><p>Prices are shown in CFA francs (FCFA). Payment is made upon receiving the order.</p><h3>Exchanges</h3><p>An item may be exchanged under terms agreed with the shop at the time of delivery.</p>",
  },
  {
    slug: "confidentialite",
    titleFr: "Politique de confidentialité",
    titleEn: "Privacy policy",
    bodyFr:
      "<h2>Politique de confidentialité</h2><p>Les informations recueillies lors d'une commande (nom, téléphone, adresse) servent uniquement à traiter et livrer votre commande.</p><p>Elles ne sont jamais transmises à des tiers à des fins commerciales.</p>",
    bodyEn:
      "<h2>Privacy policy</h2><p>Information collected when placing an order (name, phone, address) is only used to process and deliver your order.</p><p>It is never shared with third parties for commercial purposes.</p>",
  },
  {
    slug: "mentions-legales",
    titleFr: "Mentions légales",
    titleEn: "Legal notice",
    bodyFr: "<h2>Mentions légales</h2><p>OpenStyle — boutique de prêt-à-porter, Yaoundé, Cameroun.</p><p>Gérante : Toko Tchazue Thérèse Doriane.</p>",
    bodyEn: "<h2>Legal notice</h2><p>OpenStyle — ready-to-wear boutique, Yaoundé, Cameroon.</p><p>Manager: Toko Tchazue Thérèse Doriane.</p>",
  },
];

/**
 * RG-18/19, F20 : zones de livraison. Découpage donné explicitement par le
 * cahier des charges (Yaoundé ; Douala, Edéa, Bafoussam, Kribi, Limbé ;
 * Autres villes). Montants de démonstration (à ajuster par la cliente via
 * /admin/livraison) — voir docs/decisions.md.
 */
const deliveryZones = [
  { nameFr: "Yaoundé", cities: "Yaoundé", feeRetail: 1500, feeWholesale: 2500 },
  { nameFr: "Douala, Edéa, Bafoussam, Kribi, Limbé", cities: "Douala,Edéa,Bafoussam,Kribi,Limbé", feeRetail: 3500, feeWholesale: 6000 },
  { nameFr: "Autres villes", cities: "Autres", feeRetail: 5000, feeWholesale: 8500 },
];

/** Points relais de démonstration (Yaoundé uniquement, RG-18) — coordonnées factices, à remplacer via F20. */
const relayPoints = [
  { name: "Relais Centre-ville", city: "Yaoundé", address: "Yaoundé, Centre-ville, avenue Kennedy" },
  { name: "Relais Mendong", city: "Yaoundé", address: "Yaoundé, Mendong, carrefour marché" },
];

type SeedCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  proStatus: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  shopName?: string;
  proCity?: string;
  proPhone?: string;
};

/** Comptes clients de démonstration (F08/F09) — mot de passe partagé, à usage de démonstration uniquement. */
const DEMO_CUSTOMER_PASSWORD = "Client2026!";
const customers: SeedCustomer[] = [
  { email: "aicha.belinga@example.cm", firstName: "Aïcha", lastName: "Belinga", phone: "677001122", proStatus: "NONE" as const },
  {
    email: "sandra.kamga@example.cm",
    firstName: "Sandra",
    lastName: "Kamga",
    phone: "677002233",
    proStatus: "APPROVED" as const,
    shopName: "Boutique Sandra Mode",
    proCity: "Douala",
    proPhone: "677002233",
  },
  {
    email: "marie.tchoumi@example.cm",
    firstName: "Marie",
    lastName: "Tchoumi",
    phone: "677003344",
    proStatus: "PENDING" as const,
    shopName: "Chez Marie Fashion",
    proCity: "Bafoussam",
    proPhone: "677003344",
  },
  { email: "jean.mballa@example.cm", firstName: "Jean", lastName: "Mballa", phone: "677004455", proStatus: "NONE" as const },
  {
    email: "paul.etoa@example.cm",
    firstName: "Paul",
    lastName: "Etoa",
    phone: "677005566",
    proStatus: "REJECTED" as const,
    shopName: "Etoa Distribution",
    proCity: "Yaoundé",
    proPhone: "677005566",
  },
  { email: "grace.nkolo@example.cm", firstName: "Grace", lastName: "Nkolo", phone: "677006677", proStatus: "NONE" as const },
];

type SeedOrderItem = { sku: string; quantity: number };
type SeedOrderStatus = "NEW" | "CONFIRMED" | "READY" | "SHIPPED" | "DELIVERED" | "CANCELLED";

type SeedOrder = {
  number: string;
  status: SeedOrderStatus;
  customerEmail?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  deliveryMethod: "PICKUP" | "RELAY" | "SHIPPING";
  city: string;
  daysAgo: number;
  items: SeedOrderItem[];
  receiptRequested?: boolean;
  contactAttempts?: number;
  lastContactDaysAgo?: number;
  paymentNote?: string;
  customerNote?: string;
};

/** Commandes de démonstration couvrant tous les statuts, pour que l'admin ne soit jamais vide pendant le développement. */
const orders: SeedOrder[] = [
  {
    number: "OS-000001",
    status: "DELIVERED",
    firstName: "Christelle",
    lastName: "Ondoa",
    phone: "677011111",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 21,
    items: [{ sku: "OS-VET-002-1", quantity: 1 }],
  },
  {
    number: "OS-000002",
    status: "DELIVERED",
    customerEmail: "aicha.belinga@example.cm",
    firstName: "Aïcha",
    lastName: "Belinga",
    phone: "677001122",
    deliveryMethod: "RELAY",
    city: "Yaoundé",
    daysAgo: 18,
    items: [{ sku: "OS-VET-001-1", quantity: 1 }],
  },
  {
    number: "OS-000003",
    status: "CANCELLED",
    firstName: "Blaise",
    lastName: "Fouda",
    phone: "677022222",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 15,
    items: [{ sku: "OS-SAC-001-1", quantity: 1 }],
  },
  {
    number: "OS-000004",
    status: "SHIPPED",
    customerEmail: "sandra.kamga@example.cm",
    firstName: "Sandra",
    lastName: "Kamga",
    phone: "677002233",
    deliveryMethod: "SHIPPING",
    city: "Douala",
    daysAgo: 6,
    items: [
      { sku: "OS-ACC-001-1", quantity: 15 },
      { sku: "OS-ACC-002-1", quantity: 5 },
    ],
    paymentNote: "Paiement Orange Money à la livraison, convenu par téléphone (RG-17).",
  },
  {
    number: "OS-000005",
    status: "READY",
    firstName: "Nadège",
    lastName: "Biya",
    phone: "677033333",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 2,
    items: [{ sku: "OS-SAC-002-1", quantity: 1 }],
  },
  {
    number: "OS-000006",
    status: "CONFIRMED",
    customerEmail: "jean.mballa@example.cm",
    firstName: "Jean",
    lastName: "Mballa",
    phone: "677004455",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 2,
    items: [{ sku: "OS-ACC-002-2", quantity: 1 }],
  },
  {
    number: "OS-000007",
    status: "CONFIRMED",
    firstName: "Hervé",
    lastName: "Nguema",
    phone: "677044444",
    deliveryMethod: "RELAY",
    city: "Yaoundé",
    daysAgo: 1,
    items: [{ sku: "OS-PAR-001-2", quantity: 1 }],
  },
  {
    number: "OS-000008",
    status: "NEW",
    firstName: "Odette",
    lastName: "Essomba",
    phone: "677055555",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 0,
    items: [{ sku: "OS-VET-003-3", quantity: 1 }],
  },
  {
    number: "OS-000009",
    status: "NEW",
    customerEmail: "grace.nkolo@example.cm",
    firstName: "Grace",
    lastName: "Nkolo",
    phone: "677006677",
    deliveryMethod: "SHIPPING",
    city: "Douala",
    daysAgo: 0,
    items: [{ sku: "OS-ACC-001-2", quantity: 2 }],
  },
  {
    number: "OS-000010",
    status: "NEW",
    firstName: "Roger",
    lastName: "Abanda",
    phone: "677066666",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 4,
    items: [{ sku: "OS-VET-002-4", quantity: 1 }],
    contactAttempts: 1,
    lastContactDaysAgo: 1,
    customerNote: "Merci de m'appeler avant de préparer la commande.",
  },
  {
    number: "OS-000011",
    status: "NEW",
    firstName: "Solange",
    lastName: "Ateba",
    phone: "677077777",
    deliveryMethod: "RELAY",
    city: "Yaoundé",
    daysAgo: 5,
    items: [{ sku: "OS-PAR-002-1", quantity: 1 }],
  },
  {
    number: "OS-000012",
    status: "DELIVERED",
    customerEmail: "aicha.belinga@example.cm",
    firstName: "Aïcha",
    lastName: "Belinga",
    phone: "677001122",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 9,
    items: [{ sku: "OS-PAR-001-1", quantity: 1 }],
  },
  {
    number: "OS-000013",
    status: "CONFIRMED",
    firstName: "Yves",
    lastName: "Mvondo",
    phone: "677088888",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 0,
    items: [{ sku: "OS-SAC-001-1", quantity: 1 }],
    receiptRequested: true,
  },
  {
    number: "OS-000014",
    status: "SHIPPED",
    firstName: "Carine",
    lastName: "Njoya",
    phone: "677099999",
    deliveryMethod: "SHIPPING",
    city: "Bafoussam",
    daysAgo: 3,
    items: [{ sku: "OS-VET-003-1", quantity: 2 }],
  },
  {
    number: "OS-000015",
    status: "DELIVERED",
    customerEmail: "paul.etoa@example.cm",
    firstName: "Paul",
    lastName: "Etoa",
    phone: "677005566",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 25,
    items: [{ sku: "OS-VET-003-2", quantity: 1 }],
  },
  {
    number: "OS-000016",
    status: "NEW",
    firstName: "Diane",
    lastName: "Sende",
    phone: "677010101",
    deliveryMethod: "PICKUP",
    city: "Yaoundé",
    daysAgo: 6,
    items: [{ sku: "OS-VET-001-4", quantity: 1 }],
  },
];

type Combo = { size?: string; color?: string; scent?: string };

function combinations({ sizes, colors, scents }: SeedVariantAxis): Combo[] {
  if (scents) return scents.map((scent) => ({ scent }));
  if (sizes && colors) return sizes.flatMap((size) => colors.map((color) => ({ size, color })));
  if (sizes) return sizes.map((size) => ({ size }));
  if (colors) return colors.map((color) => ({ color }));
  return [{}];
}

function daysAgoDate(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/** Étapes d'historique réalistes selon le statut final (RG-09 : transitions autorisées uniquement). */
function statusPath(status: SeedOrderStatus): SeedOrderStatus[] {
  switch (status) {
    case "NEW":
      return ["NEW"];
    case "CONFIRMED":
      return ["NEW", "CONFIRMED"];
    case "READY":
      return ["NEW", "CONFIRMED", "READY"];
    case "SHIPPED":
      return ["NEW", "CONFIRMED", "SHIPPED"];
    case "DELIVERED":
      return ["NEW", "CONFIRMED", "READY", "DELIVERED"];
    case "CANCELLED":
      return ["NEW", "CANCELLED"];
  }
}

async function main() {
  console.log("Seeding categories...");
  const parentCategories = categories.filter((c) => !c.parentSlug);
  const childCategories = categories.filter((c) => c.parentSlug);
  for (const [index, category] of parentCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: { slug: category.slug, nameFr: category.nameFr, nameEn: category.nameEn, imageUrl: category.imageUrl, position: index },
    });
  }
  for (const [index, category] of childCategories.entries()) {
    const parent = await prisma.category.findUniqueOrThrow({ where: { slug: category.parentSlug! } });
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        slug: category.slug,
        nameFr: category.nameFr,
        nameEn: category.nameEn,
        imageUrl: category.imageUrl,
        parentId: parent.id,
        position: index,
      },
    });
  }

  console.log("Seeding products and variants...");
  for (const product of products) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: product.categorySlug } });
    const combos = combinations(product.variants);

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        slug: product.slug,
        reference: product.reference,
        nameFr: product.nameFr,
        nameEn: product.nameEn,
        descriptionFr: product.descriptionFr,
        descriptionEn: product.descriptionEn,
        categoryId: category.id,
        priceRetail: product.priceRetail,
        pricePromo: product.pricePromo,
        isNew: product.isNew ?? false,
        isPopular: product.isPopular ?? false,
        status: "PUBLISHED",
        publishedAt: new Date(),
        inStock: product.stockPattern.some((s) => s > 0),
        images: {
          create: [
            {
              urlThumb: product.imageUrl,
              urlCard: product.imageUrl,
              urlFull: product.imageUrl,
              blurDataUrl: product.imageUrl,
              alt: product.nameFr,
              position: 0,
            },
          ],
        },
      },
    });

    for (const [index, combo] of combos.entries()) {
      const stock = product.stockPattern[index % product.stockPattern.length];
      const sku = `${product.reference}-${index + 1}`;
      await prisma.variant.upsert({
        where: { sku },
        update: { stock },
        create: {
          productId: created.id,
          sku,
          size: combo.size,
          color: combo.color,
          scent: combo.scent,
          stock,
          lowStockThreshold: 3,
        },
      });
    }
  }

  console.log("Seeding banners...");
  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    for (const [index, banner] of banners.entries()) {
      await prisma.banner.create({ data: { ...banner, position: index } });
    }
  }

  console.log("Seeding testimonials...");
  for (const [index, testimonial] of testimonials.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { author: testimonial.author } });
    if (!existing) {
      await prisma.testimonial.create({ data: { ...testimonial, position: index } });
    }
  }

  console.log("Seeding FAQ...");
  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    for (const [index, item] of faqItems.entries()) {
      await prisma.faqItem.create({ data: { ...item, position: index } });
    }
  }

  console.log("Seeding content pages...");
  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log("Seeding delivery zones...");
  for (const [index, zone] of deliveryZones.entries()) {
    const existing = await prisma.deliveryZone.findFirst({ where: { nameFr: zone.nameFr } });
    if (existing) {
      await prisma.deliveryZone.update({ where: { id: existing.id }, data: { ...zone, position: index } });
    } else {
      await prisma.deliveryZone.create({ data: { ...zone, position: index } });
    }
  }

  console.log("Seeding relay points...");
  for (const point of relayPoints) {
    const existing = await prisma.relayPoint.findFirst({ where: { name: point.name } });
    if (!existing) {
      await prisma.relayPoint.create({ data: point });
    }
  }

  console.log("Seeding first OWNER account...");
  const ownerEmail = "gerante@openstyle.cm";
  const ownerPassword = "OpenStyle2026!";
  const ownerPasswordHash = await bcrypt.hash(ownerPassword, 10);
  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      passwordHash: ownerPasswordHash,
      firstName: "Toko Tchazue",
      lastName: "Thérèse Doriane",
      role: "OWNER",
    },
  });
  console.log(`Compte OWNER : ${ownerEmail} / ${ownerPassword} (à changer après la première connexion)`);

  console.log("Seeding demo customer accounts (F08/F09)...");
  const customerPasswordHash = await bcrypt.hash(DEMO_CUSTOMER_PASSWORD, 10);
  const customerIdByEmail = new Map<string, string>();
  for (const customer of customers) {
    const created = await prisma.user.upsert({
      where: { email: customer.email },
      update: {},
      create: {
        email: customer.email,
        passwordHash: customerPasswordHash,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        role: "CUSTOMER",
        proStatus: customer.proStatus,
        shopName: customer.shopName ?? null,
        proCity: customer.proCity ?? null,
        proPhone: customer.proPhone ?? null,
        proDecidedAt: customer.proStatus === "APPROVED" || customer.proStatus === "REJECTED" ? daysAgoDate(10) : null,
      },
    });
    customerIdByEmail.set(customer.email, created.id);
  }
  console.log(`Comptes clients de démonstration : mot de passe commun "${DEMO_CUSTOMER_PASSWORD}"`);

  console.log("Seeding demo orders (F06/F18)...");
  const seededRelayPoints = await prisma.relayPoint.findMany({ orderBy: { name: "asc" } });
  let relayPointCursor = 0;
  for (const order of orders) {
    const existing = await prisma.order.findUnique({ where: { number: order.number } });
    if (existing) continue;

    // RG-08 : le serveur recalcule toujours le prix à partir des données réelles (mêmes fonctions que lib/actions/order.ts).
    const variantRows = await Promise.all(
      order.items.map(async (item) => {
        const variant = await prisma.variant.findUniqueOrThrow({ where: { sku: item.sku }, include: { product: true } });
        return { item, variant };
      }),
    );

    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const isApprovedPro = order.customerEmail
      ? customers.find((c) => c.email === order.customerEmail)?.proStatus === "APPROVED"
      : false;
    const tier = effectiveTier(tierForQuantity(totalQuantity), isApprovedPro);

    const itemsData = variantRows.map(({ item, variant }) => {
      const price = unitPrice(variant.product, tier);
      return {
        productId: variant.productId,
        variantId: variant.id,
        name: variant.product.nameFr,
        reference: variant.product.reference,
        size: variant.size,
        color: variant.color,
        scent: variant.scent,
        unitPrice: price,
        quantity: item.quantity,
        lineTotal: price * item.quantity,
      };
    });
    const subtotal = itemsData.reduce((sum, item) => sum + item.lineTotal, 0);

    const validMethods = availableDeliveryMethods(order.city);
    const deliveryMethod = validMethods.includes(order.deliveryMethod) ? order.deliveryMethod : validMethods[validMethods.length - 1];
    const zone = deliveryMethod === "PICKUP" ? null : await findZoneForCity(order.city);
    const fee = deliveryFee(deliveryMethod, zone, tier);
    const total = subtotal + fee;
    let relayPointId: string | null = null;
    if (deliveryMethod === "RELAY" && seededRelayPoints.length > 0) {
      relayPointId = seededRelayPoints[relayPointCursor % seededRelayPoints.length].id;
      relayPointCursor += 1;
    }

    const path = statusPath(order.status);
    const createdAt = daysAgoDate(order.daysAgo);
    const finalStatus = order.status;
    const isPostConfirmation = path.includes("CONFIRMED");
    const isDelivered = finalStatus === "DELIVERED";

    const created = await prisma.order.create({
      data: {
        number: order.number,
        status: finalStatus,
        userId: order.customerEmail ? (customerIdByEmail.get(order.customerEmail) ?? null) : null,
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        email: order.email,
        deliveryMethod,
        city: order.city,
        zoneId: zone?.id ?? null,
        relayPointId,
        address: deliveryMethod === "SHIPPING" ? `${order.city}, adresse communiquée par téléphone` : null,
        customerNote: order.customerNote,
        tier,
        subtotal,
        deliveryFee: fee,
        total,
        paymentStatus: isDelivered ? "COLLECTED" : "TO_COLLECT",
        paymentNote: order.paymentNote,
        receiptRequested: order.receiptRequested ?? false,
        contactAttempts: order.contactAttempts ?? 0,
        lastContactAt: order.lastContactDaysAgo != null ? daysAgoDate(order.lastContactDaysAgo) : null,
        confirmedAt: isPostConfirmation ? createdAt : null,
        createdAt,
        items: { create: itemsData },
        events: {
          create: path.map((status, index) => ({
            type: "STATUS_CHANGE" as const,
            fromStatus: index === 0 ? null : path[index - 1],
            toStatus: status,
            note: index === 0 ? "Commande créée" : undefined,
            userId: index === 0 ? null : owner.id,
            createdAt: daysAgoDate(Math.max(0, order.daysAgo - index * 0.3)),
          })),
        },
      },
    });

    // RG-10 : le stock est décompté au passage à CONFIRMED — on reproduit l'effet pour les commandes au-delà de NEW/CANCELLED.
    if (isPostConfirmation) {
      for (const { item, variant } of variantRows) {
        await prisma.variant.update({ where: { id: variant.id }, data: { stock: { decrement: item.quantity } } });
        await prisma.stockMovement.create({
          data: { variantId: variant.id, delta: -item.quantity, reason: "ORDER_CONFIRMED", orderId: created.id, userId: owner.id },
        });
      }
    }
  }

  // RG-26 : Product.inStock dénormalisé — recalculé après les décomptes de stock ci-dessus.
  console.log("Recomputing Product.inStock...");
  const allProducts = await prisma.product.findMany({ select: { id: true } });
  for (const product of allProducts) {
    const variants = await prisma.variant.findMany({ where: { productId: product.id, isActive: true }, select: { stock: true } });
    const inStock = variants.some((v) => v.stock > 0);
    await prisma.product.update({ where: { id: product.id }, data: { inStock } });
  }

  const [
    categoryCount,
    productCount,
    variantCount,
    testimonialCount,
    faqCount2,
    pageCount,
    userCount,
    customerCount,
    orderCount,
    deliveryZoneCount,
    relayPointCount,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.variant.count(),
    prisma.testimonial.count(),
    prisma.faqItem.count(),
    prisma.page.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count(),
    prisma.deliveryZone.count(),
    prisma.relayPoint.count(),
  ]);
  console.log({
    categoryCount,
    productCount,
    variantCount,
    testimonialCount,
    faqCount: faqCount2,
    pageCount,
    userCount,
    customerCount,
    orderCount,
    deliveryZoneCount,
    relayPointCount,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
