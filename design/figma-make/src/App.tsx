import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import CartDrawer from "./components/CartDrawer";
import ScrollProgress from "./components/ScrollProgress";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Delivery from "./pages/Delivery";
import Login from "./pages/Login";

// Pages that don't use main layout
const BARE_PATHS = ["/connexion", "/admin"];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const bare = BARE_PATHS.some((p) => pathname.startsWith(p));

  if (bare) return <>{children}</>;

  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </>
  );
}

// Simple filter pages reusing Shop
import { products } from "./data";
import ProductCard from "./components/ProductCard";
function FilteredPage({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  const filtered = products.filter((p) => p.badge === badge);
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">OPENSTYLE</p>
        <h1 className="font-serif text-4xl font-bold">{title}</h1>
        <p className="text-[#6B6B6B] mt-2 text-sm">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {filtered.length === 0 && (
        <div className="py-20 text-center text-[#6B6B6B]">Aucun produit pour le moment</div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boutique" element={<Shop />} />
          <Route path="/produit/:id" element={<Product />} />
          <Route path="/commande" element={<Checkout />} />
          <Route path="/compte" element={<Account />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/livraison" element={<Delivery />} />
          <Route
            path="/nouveautes"
            element={<FilteredPage badge="Nouveau" title="Nouveautés" subtitle="Découvrez nos dernières arrivées" />}
          />
          <Route
            path="/promotions"
            element={<FilteredPage badge="Promo" title="Promotions" subtitle="Nos meilleures offres du moment" />}
          />
          <Route
            path="/professionnel"
            element={
              <div className="max-w-xl mx-auto px-4 py-16 text-center">
                <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-3">Revendeurs</p>
                <h1 className="font-serif text-4xl font-bold mb-4">Compte professionnel</h1>
                <p className="text-[#6B6B6B] mb-8">Connectez-vous ou créez un compte pour faire votre demande d'accès aux tarifs professionnels.</p>
                <a href="/connexion" className="inline-block bg-[#111] text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1C1C1C] transition">
                  Se connecter
                </a>
              </div>
            }
          />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <p className="font-serif text-6xl font-bold">404</p>
                <p className="text-[#6B6B6B]">Page introuvable</p>
                <a href="/" className="underline text-sm">Retour à l'accueil</a>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
