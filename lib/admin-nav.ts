import type { Role } from "@/generated/prisma/client";

export type AdminNavLabelKey =
  | "home"
  | "orders"
  | "products"
  | "stocks"
  | "categories"
  | "clients"
  | "delivery"
  | "content"
  | "exports"
  | "settings"
  | "team"
  | "journal"
  | "myAccount";

export type AdminNavItem = {
  href: string;
  labelKey: AdminNavLabelKey;
  roles: Role[];
};

/** Section 8.1 : plan des pages, droits par rôle (section 4). */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", labelKey: "home", roles: ["OWNER", "MANAGER"] },
  { href: "/admin/commandes", labelKey: "orders", roles: ["OWNER"] },
  { href: "/admin/produits", labelKey: "products", roles: ["OWNER", "MANAGER"] },
  { href: "/admin/stocks", labelKey: "stocks", roles: ["OWNER", "MANAGER"] },
  { href: "/admin/categories", labelKey: "categories", roles: ["OWNER", "MANAGER"] },
  { href: "/admin/clients", labelKey: "clients", roles: ["OWNER"] },
  { href: "/admin/livraison", labelKey: "delivery", roles: ["OWNER"] },
  { href: "/admin/contenus", labelKey: "content", roles: ["OWNER", "MANAGER"] },
  { href: "/admin/exports", labelKey: "exports", roles: ["OWNER"] },
  { href: "/admin/parametres", labelKey: "settings", roles: ["OWNER"] },
  { href: "/admin/equipe", labelKey: "team", roles: ["OWNER"] },
  { href: "/admin/journal", labelKey: "journal", roles: ["OWNER"] },
  { href: "/admin/mon-compte", labelKey: "myAccount", roles: ["OWNER", "MANAGER"] },
];

/** Section 8.1 : les 4 entrées de la barre mobile diffèrent par rôle. */
export const MOBILE_PRIMARY_HREFS: Record<Role, string[]> = {
  OWNER: ["/admin", "/admin/commandes", "/admin/produits", "/admin/stocks"],
  MANAGER: ["/admin", "/admin/produits", "/admin/stocks", "/admin/contenus"],
  CUSTOMER: [],
};

export function navItemsForRole(role: Role) {
  return ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role));
}
