"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useCartStore } from "@/lib/cart-store";
import { localizedText } from "@/lib/i18n-helpers";
import Logo from "./Logo";

export default function Header({
  categories,
  isCustomerLoggedIn,
}: {
  categories: { slug: string; nameFr: string; nameEn: string | null }[];
  isCustomerLoggedIn: boolean;
}) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const routeParams = useParams<{ categorie?: string; slug?: string; numero?: string; token?: string }>();
  const cartCount = useCartStore((s) => s.count());

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // Le serveur ne connaît jamais le panier (localStorage) : n'afficher le
  // badge qu'une fois monté côté client, pour ne jamais désaccorder le HTML
  // serveur et le premier rendu client (erreur d'hydratation sinon).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push({ pathname: "/boutique", query: searchValue ? { q: searchValue } : undefined });
    setSearchOpen(false);
  }

  function switchLocale(nextLocale: string) {
    // usePathname() renvoie le gabarit ("/boutique/[categorie]", "/produit/[slug]")
    // pour les routes dynamiques : il faut alors fournir les params explicitement.
    if (pathname === "/boutique/[categorie]") {
      if (routeParams.categorie) {
        router.replace(
          { pathname: "/boutique/[categorie]", params: { categorie: routeParams.categorie } },
          { locale: nextLocale },
        );
      }
      return;
    }
    if (pathname === "/produit/[slug]") {
      if (routeParams.slug) {
        router.replace({ pathname: "/produit/[slug]", params: { slug: routeParams.slug } }, { locale: nextLocale });
      }
      return;
    }
    if (pathname === "/commande/confirmation/[numero]") {
      if (routeParams.numero) {
        router.replace(
          { pathname: "/commande/confirmation/[numero]", params: { numero: routeParams.numero } },
          { locale: nextLocale },
        );
      }
      return;
    }
    if (pathname === "/compte/commandes/[numero]") {
      if (routeParams.numero) {
        router.replace(
          { pathname: "/compte/commandes/[numero]", params: { numero: routeParams.numero } },
          { locale: nextLocale },
        );
      }
      return;
    }
    if (pathname === "/reinitialiser-mot-de-passe/[token]") {
      if (routeParams.token) {
        router.replace(
          { pathname: "/reinitialiser-mot-de-passe/[token]", params: { token: routeParams.token } },
          { locale: nextLocale },
        );
      }
      return;
    }
    router.replace(pathname, { locale: nextLocale });
  }

  function NavItems({ activeClassName, inactiveClassName }: { activeClassName: string; inactiveClassName: string }) {
    const linkClass = (active: boolean) => (active ? activeClassName : inactiveClassName);
    const isCategoryActive = (slug: string) => pathname === "/boutique/[categorie]" && routeParams.categorie === slug;

    return (
      <>
        <Link href="/" className={linkClass(pathname === "/")}>
          {t("home")}
        </Link>
        <Link href="/boutique" className={linkClass(pathname === "/boutique")}>
          {t("shop")}
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={{ pathname: "/boutique/[categorie]", params: { categorie: category.slug } }}
            className={linkClass(isCategoryActive(category.slug))}
          >
            {localizedText(locale, category.nameFr, category.nameEn)}
          </Link>
        ))}
        <Link href="/promotions" className={linkClass(pathname === "/promotions")}>
          {t("promotions")}
        </Link>
        <Link href="/nouveautes" className={linkClass(pathname === "/nouveautes")}>
          {t("newArrivals")}
        </Link>
      </>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-os-white/95 shadow-sm backdrop-blur-sm" : "bg-os-white"
        }`}
      >
        <div className="border-b border-os-gray py-1.5 px-4 text-center text-xs uppercase tracking-widest text-os-muted">
          {t("topBar")}
        </div>

        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          <button
            className="p-1 xl:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label={t("openMenu")}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
              <rect width="22" height="2" rx="1" fill="#111" />
              <rect y="7" width="22" height="2" rx="1" fill="#111" />
              <rect y="14" width="14" height="2" rx="1" fill="#111" />
            </svg>
          </button>

          <Link href="/" className="flex items-center">
            <Logo className="h-10 lg:h-12" />
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium tracking-wide xl:flex">
            <NavItems
              activeClassName="whitespace-nowrap border-b border-os-black font-semibold text-os-black"
              inactiveClassName="whitespace-nowrap text-os-muted transition-colors hover:text-os-black"
            />
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 text-xs font-semibold tracking-wide sm:flex">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  aria-current={locale === loc}
                  className={`px-1 uppercase transition ${
                    locale === loc ? "text-os-black" : "text-os-muted hover:text-os-black"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center border-b border-os-black pb-0.5">
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-32 bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label={t("closeSearch")}
                  className="ml-1 text-os-muted"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label={t("search")}
                className="p-1 transition hover:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="7.5" cy="7.5" r="6" stroke="#111" strokeWidth="1.5" />
                  <path d="M12 12l4 4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}

            <Link href={isCustomerLoggedIn ? "/compte" : "/connexion"} aria-label={t("account")} className="p-1 transition hover:opacity-60">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="6" r="3.5" stroke="#111" strokeWidth="1.5" />
                <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>

            <Link href="/panier" aria-label={t("cart")} className="relative p-1 transition hover:opacity-60">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M1 1h2.5l2 9.5h9l2-7H5"
                  stroke="#111"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="7" cy="15" r="1.2" fill="#111" />
                <circle cx="13" cy="15" r="1.2" fill="#111" />
              </svg>
              {mounted && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-os-black text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="overlay-fade flex-1 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="menu-panel flex h-full w-72 flex-col overflow-y-auto bg-os-white p-6">
            <div className="mb-8 flex items-center justify-between">
              <Logo className="h-9" />
              <button onClick={() => setMenuOpen(false)} aria-label={t("closeMenu")} className="text-2xl leading-none">
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              <NavItems
                activeClassName="border-b border-os-gray pb-3 text-base font-semibold text-os-black"
                inactiveClassName="border-b border-os-gray pb-3 text-base font-medium text-os-muted hover:text-os-black"
              />
            </nav>
            <div className="mt-auto flex items-center gap-2 border-t border-os-gray pt-6 text-xs font-semibold tracking-wide">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={`px-1 uppercase transition ${
                    locale === loc ? "text-os-black" : "text-os-muted hover:text-os-black"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="h-[88px]" />
    </>
  );
}
