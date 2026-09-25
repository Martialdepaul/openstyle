import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useCartStore } from "../store";

const navLinks = [
  { to: "/", label: "Accueil" },
  { to: "/boutique", label: "Boutique" },
  { to: "/boutique?cat=Vêtements", label: "Vêtements" },
  { to: "/boutique?cat=Sacs", label: "Sacs" },
  { to: "/boutique?cat=Accessoires", label: "Accessoires" },
  { to: "/boutique?cat=Parfums", label: "Parfums" },
  { to: "/promotions", label: "Promotions" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
        }`}
      >
        {/* Top bar */}
        <div className="border-b border-[#EAEAEA] py-1.5 px-4 text-center text-xs text-[#6B6B6B] tracking-widest uppercase">
          Livraison partout au Cameroun · WhatsApp : +216 656 356 687
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between px-4 lg:px-8 py-3">
          {/* Mobile: hamburger */}
          <button
            className="lg:hidden p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <rect width="22" height="2" rx="1" fill="#111" />
              <rect y="7" width="22" height="2" rx="1" fill="#111" />
              <rect y="14" width="14" height="2" rx="1" fill="#111" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo className="h-10 w-auto lg:h-12" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm tracking-wide font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`hover:text-[#6B6B6B] transition-colors whitespace-nowrap ${
                  location.pathname === l.to ? "border-b border-[#111]" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {searchOpen ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/boutique?q=${searchVal}`;
                }}
                className="flex items-center border-b border-[#111] pb-0.5"
              >
                <input
                  autoFocus
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Rechercher..."
                  className="outline-none text-sm w-32 bg-transparent"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 text-[#6B6B6B]">
                  ✕
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} aria-label="Rechercher" className="p-1 hover:opacity-60 transition">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="7.5" cy="7.5" r="6" stroke="#111" strokeWidth="1.5" />
                  <path d="M12 12l4 4" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}

            {/* Account */}
            <Link to="/compte" aria-label="Mon compte" className="p-1 hover:opacity-60 transition">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3.5" stroke="#111" strokeWidth="1.5" />
                <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>

            {/* Cart */}
            <button onClick={openCart} aria-label="Panier" className="p-1 hover:opacity-60 transition relative">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1h2.5l2 9.5h9l2-7H5" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="7" cy="15" r="1.2" fill="#111" />
                <circle cx="13" cy="15" r="1.2" fill="#111" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div className="bg-black/40 flex-1 overlay-fade" onClick={() => setMenuOpen(false)} />
          <div className="bg-white w-72 h-full flex flex-col p-6 overflow-y-auto menu-panel">
            <div className="flex items-center justify-between mb-8">
              <Logo className="h-9 w-auto" />
              <button onClick={() => setMenuOpen(false)} className="text-2xl leading-none">✕</button>
            </div>
            <nav className="flex flex-col gap-5">
              {navLinks.map((l) => (
                <Link key={l.label} to={l.to} className="text-base font-medium border-b border-[#EAEAEA] pb-3 hover:text-[#6B6B6B]">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-[#EAEAEA]">
              <a
                href="https://wa.me/216656356687"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[#25D366]"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 1.763.463 3.414 1.27 4.845L0 20l5.284-1.247A9.953 9.953 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm5.197 14.203c-.22.614-1.088 1.124-1.777 1.271-.473.1-1.09.18-3.167-.68-2.658-1.08-4.37-3.77-4.502-3.944-.13-.172-1.067-1.42-1.067-2.71 0-1.29.675-1.922.915-2.183.24-.26.522-.325.696-.325h.5c.16 0 .378-.06.59.45.22.523.74 1.812.805 1.943.065.13.108.282.02.455-.086.172-.13.28-.26.43-.13.15-.274.336-.39.452-.13.13-.266.27-.114.53.152.26.674 1.11 1.447 1.797.994.887 1.831 1.162 2.09 1.29.26.13.41.108.562-.065.152-.172.65-.758.824-1.018.173-.26.347-.217.585-.13.238.087 1.52.717 1.78.848.26.13.433.195.497.303.063.107.063.62-.158 1.236z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-[88px]" />
    </>
  );
}
