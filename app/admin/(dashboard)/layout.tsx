import type { ReactNode } from "react";
import { requireRole } from "@/lib/admin-auth";
import { getAdminTranslations } from "@/lib/admin-i18n";
import AdminShell from "@/components/admin/AdminShell";
import type { AdminNavLabelKey } from "@/lib/admin-nav";

const NAV_KEYS: AdminNavLabelKey[] = [
  "home",
  "orders",
  "products",
  "stocks",
  "categories",
  "clients",
  "delivery",
  "content",
  "exports",
  "settings",
  "team",
  "journal",
  "myAccount",
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // F08 : le fournisseur d'identifiants accepte désormais aussi les comptes CUSTOMER (espace client) —
  // ce garde-fou empêche qu'un tel compte atteigne la coque admin, où seul le rôle compte ensuite.
  const session = await requireRole("OWNER", "MANAGER");
  const tNav = getAdminTranslations("Nav");

  const navLabels = Object.fromEntries(NAV_KEYS.map((key) => [key, tNav(key)])) as Record<AdminNavLabelKey, string>;

  return (
    <AdminShell
      role={session.user.role}
      name={session.user.name ?? ""}
      labels={{
        viewSite: tNav("viewSite"),
        newProduct: tNav("newProduct"),
        logout: tNav("logout"),
        menu: tNav("menu"),
        roleOwner: tNav("roleOwner"),
        roleManager: tNav("roleManager"),
      }}
      navLabels={navLabels}
    >
      {children}
    </AdminShell>
  );
}
