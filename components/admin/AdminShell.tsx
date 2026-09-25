"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Role } from "@/generated/prisma/client";
import { ADMIN_NAV_ITEMS, MOBILE_PRIMARY_HREFS, navItemsForRole, type AdminNavLabelKey } from "@/lib/admin-nav";

export default function AdminShell({
  role,
  name,
  labels,
  navLabels,
  children,
}: {
  role: Role;
  name: string;
  labels: { viewSite: string; newProduct: string; logout: string; menu: string; roleOwner: string; roleManager: string };
  navLabels: Record<AdminNavLabelKey, string>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = navItemsForRole(role);
  const mobilePrimaryHrefs = MOBILE_PRIMARY_HREFS[role];
  const mobilePrimary = mobilePrimaryHrefs
    .map((href) => ADMIN_NAV_ITEMS.find((item) => item.href === href))
    .filter((item): item is (typeof ADMIN_NAV_ITEMS)[number] => !!item);
  const mobileRest = items.filter((item) => !mobilePrimaryHrefs.includes(item.href));

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-screen lg:flex">
      {/* Barre latérale (ordinateur) */}
      <aside className="hidden w-56 flex-shrink-0 flex-col bg-os-black py-6 text-white lg:flex">
        <div className="mb-8 px-5">
          <p className="font-serif text-lg font-bold">OPENSTYLE</p>
          <p className="mt-0.5 text-xs text-white/40">Administration</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2.5 text-left text-sm transition ${
                isActive(item.href) ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {navLabels[item.labelKey]}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-white/10 px-5 pt-4">
          <p className="text-xs text-white/40">{role === "OWNER" ? labels.roleOwner : labels.roleManager}</p>
          <p className="text-sm font-medium">{name}</p>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="mt-3 text-xs text-white/60 hover:text-white">
            {labels.logout}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barre supérieure (ordinateur) */}
        <div className="hidden items-center justify-end gap-4 border-b border-os-gray bg-white px-6 py-3 lg:flex">
          <Link href="/admin/produits/nouveau" className="bg-os-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            {labels.newProduct}
          </Link>
          <a href="/fr" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-wide text-os-muted hover:text-os-black">
            {labels.viewSite}
          </a>
        </div>

        <main className="flex-1 p-4 pb-20 lg:p-8 lg:pb-8">{children}</main>
      </div>

      {/* Barre de navigation mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-os-gray bg-white lg:hidden">
        {mobilePrimary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] uppercase tracking-wide ${
              isActive(item.href) ? "text-os-black" : "text-os-muted"
            }`}
          >
            {navLabels[item.labelKey]}
          </Link>
        ))}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] uppercase tracking-wide text-os-muted"
        >
          {labels.menu}
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="flex-1 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="w-full bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">{labels.menu}</p>
              <button onClick={() => setMenuOpen(false)} className="text-xl leading-none">
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {mobileRest.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-os-gray py-3 text-sm"
                >
                  {navLabels[item.labelKey]}
                </Link>
              ))}
              <a href="/fr" target="_blank" rel="noreferrer" className="border-b border-os-gray py-3 text-sm">
                {labels.viewSite}
              </a>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="py-3 text-left text-sm text-red-700"
              >
                {labels.logout}
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
