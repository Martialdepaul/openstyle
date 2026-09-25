export type Category = "Vêtements" | "Sacs" | "Accessoires" | "Parfums";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  priceOld?: number;
  priceWholesale?: number;
  description: string;
  image: string;
  images: string[];
  badge?: "Nouveau" | "Promo";
  sizes?: string[];
  colors?: string[];
  variants?: string[];
  stock: number;
  ref: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Robe Midi Élégante",
    category: "Vêtements",
    price: 28000,
    priceOld: 35000,
    priceWholesale: 22000,
    description: "Une robe midi fluide et élégante, parfaite pour toutes les occasions. Tissu de qualité supérieure avec une coupe impeccable qui met en valeur la silhouette.",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Promo",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Noir", "Blanc", "Beige"],
    stock: 12,
    ref: "OS-VET-001",
  },
  {
    id: 2,
    name: "Blazer Structuré",
    category: "Vêtements",
    price: 42000,
    priceWholesale: 34000,
    description: "Blazer tailored au tombé parfait. Une pièce versatile qui se porte aussi bien au bureau qu'en soirée.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4f8e83?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4f8e83?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Nouveau",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Noir", "Gris anthracite"],
    stock: 8,
    ref: "OS-VET-002",
  },
  {
    id: 3,
    name: "Ensemble Pantalon Tailleur",
    category: "Vêtements",
    price: 55000,
    priceWholesale: 44000,
    description: "Ensemble tailleur deux pièces d'une élégance absolue. Coupe moderne et tissu premium pour une allure irréprochable.",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=800&fit=crop&auto=format",
    ],
    sizes: ["S", "M", "L"],
    colors: ["Noir", "Crème"],
    stock: 5,
    ref: "OS-VET-003",
  },
  {
    id: 4,
    name: "Chemise Oversize",
    category: "Vêtements",
    price: 18500,
    priceOld: 22000,
    priceWholesale: 14000,
    description: "Chemise oversize tendance en coton doux. Coupe décontractée qui s'associe parfaitement avec un jean ou un pantalon slim.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Promo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blanc", "Bleu ciel", "Beige"],
    stock: 20,
    ref: "OS-VET-004",
  },
  {
    id: 5,
    name: "Sac Cabas Cuir",
    category: "Sacs",
    price: 35000,
    priceWholesale: 28000,
    description: "Grand cabas en cuir synthétique de qualité. Spacieux et fonctionnel, il accompagne toutes vos journées avec style.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Nouveau",
    colors: ["Noir", "Caramel", "Blanc"],
    stock: 15,
    ref: "OS-SAC-001",
  },
  {
    id: 6,
    name: "Mini Sac Bandoulière",
    category: "Sacs",
    price: 22000,
    priceOld: 27000,
    priceWholesale: 17000,
    description: "Mini sac bandoulière chic et compact. Parfait pour les soirées et les sorties, avec une chaîne dorée élégante.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Promo",
    colors: ["Noir", "Rose nude", "Bordeaux"],
    stock: 10,
    ref: "OS-SAC-002",
  },
  {
    id: 7,
    name: "Sac à Main Structuré",
    category: "Sacs",
    price: 48000,
    priceWholesale: 38000,
    description: "Sac à main structuré au design épuré et professionnel. Une pièce iconique pour les femmes actives.",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=800&fit=crop&auto=format",
    ],
    colors: ["Noir", "Blanc cassé"],
    stock: 6,
    ref: "OS-SAC-003",
  },
  {
    id: 8,
    name: "Ceinture Cuir Dorée",
    category: "Accessoires",
    price: 12000,
    priceWholesale: 9000,
    description: "Ceinture fine en cuir avec boucle dorée. L'accessoire indispensable pour sublimer toutes vos tenues.",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Nouveau",
    sizes: ["S/M", "M/L", "L/XL"],
    colors: ["Noir", "Marron"],
    stock: 25,
    ref: "OS-ACC-001",
  },
  {
    id: 9,
    name: "Foulard Soie Imprimé",
    category: "Accessoires",
    price: 9500,
    priceOld: 12000,
    priceWholesale: 7000,
    description: "Foulard en soie légère avec motif graphique moderne. Se porte autour du cou, dans les cheveux ou sur le sac.",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Promo",
    colors: ["Noir & Blanc", "Multicolore"],
    stock: 18,
    ref: "OS-ACC-002",
  },
  {
    id: 10,
    name: "Lunettes de Soleil Cat Eye",
    category: "Accessoires",
    price: 15000,
    priceWholesale: 11000,
    description: "Lunettes cat eye tendance avec monture fine. Protection UV400 et look résolument chic.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=800&fit=crop&auto=format",
    ],
    colors: ["Noir", "Écaille"],
    stock: 14,
    ref: "OS-ACC-003",
  },
  {
    id: 11,
    name: "Élixir Nuit - Parfum Femme",
    category: "Parfums",
    price: 25000,
    priceWholesale: 19000,
    description: "Une fragrance envoûtante aux notes de rose, vanille et musc. Tenue longue durée, idéale pour les soirées.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Nouveau",
    variants: ["30ml", "50ml", "100ml"],
    stock: 20,
    ref: "OS-PAR-001",
  },
  {
    id: 12,
    name: "Signature Homme",
    category: "Parfums",
    price: 28000,
    priceWholesale: 22000,
    description: "Eau de parfum masculine aux notes boisées et épicées. Caractère affirmé et élégance naturelle.",
    image: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600&h=800&fit=crop&auto=format",
    ],
    variants: ["50ml", "100ml"],
    stock: 15,
    ref: "OS-PAR-002",
  },
  {
    id: 13,
    name: "Lumière d'Or - Unisexe",
    category: "Parfums",
    price: 32000,
    priceOld: 38000,
    priceWholesale: 25000,
    description: "Parfum unisexe aux notes d'ambre, oud et fleur d'oranger. Une composition raffinée qui transcende les genres.",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Promo",
    variants: ["50ml", "100ml"],
    stock: 9,
    ref: "OS-PAR-003",
  },
  {
    id: 14,
    name: "Top Brodé Épaules",
    category: "Vêtements",
    price: 16000,
    priceWholesale: 12000,
    description: "Top élégant avec détails brodés sur les épaules. Une touche de féminité raffinée pour sublimer toutes les silhouettes.",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Nouveau",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blanc", "Ivoire", "Noir"],
    stock: 16,
    ref: "OS-VET-005",
  },
  {
    id: 15,
    name: "Jupe Plissée Mi-Longue",
    category: "Vêtements",
    price: 21000,
    priceWholesale: 16000,
    description: "Jupe plissée fluide et légère. Un basique élégant qui se porte du matin au soir.",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&h=800&fit=crop&auto=format",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Noir", "Beige", "Terracotta"],
    stock: 11,
    ref: "OS-VET-006",
  },
  {
    id: 16,
    name: "Sac Clutch Soirée",
    category: "Sacs",
    price: 18000,
    priceOld: 22000,
    priceWholesale: 14000,
    description: "Pochette clutch idéale pour les soirées et événements. Finitions soignées et fermeture aimantée.",
    image: "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?w=600&h=800&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?w=600&h=800&fit=crop&auto=format",
    ],
    badge: "Promo",
    colors: ["Noir", "Or", "Argent"],
    stock: 8,
    ref: "OS-SAC-004",
  },
];

export const categories: { name: Category; image: string; count: number }[] = [
  {
    name: "Vêtements",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop&auto=format",
    count: 6,
  },
  {
    name: "Sacs",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop&auto=format",
    count: 4,
  },
  {
    name: "Accessoires",
    image: "https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=600&h=800&fit=crop&auto=format",
    count: 3,
  },
  {
    name: "Parfums",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=800&fit=crop&auto=format",
    count: 3,
  },
];

export const formatPrice = (price: number) =>
  price.toLocaleString("fr-FR") + " FCFA";
