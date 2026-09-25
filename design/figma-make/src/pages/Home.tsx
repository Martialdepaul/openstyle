import { useEffect } from "react";
import { Link } from "react-router-dom";
import { products, categories, formatPrice } from "../data";
import ProductCard from "../components/ProductCard";
import { useRevealAll } from "../hooks/useReveal";

const trustItems = [
  "✦ Produits soigneusement sélectionnés",
  "🚚 Livraison partout au Cameroun",
  "💳 Paiement flexible",
  "💬 Service client WhatsApp",
  "✦ Produits soigneusement sélectionnés",
  "🚚 Livraison partout au Cameroun",
  "💳 Paiement flexible",
  "💬 Service client WhatsApp",
];

const testimonials = [
  { name: "Aïcha M.", city: "Yaoundé", text: "Qualité exceptionnelle, robe arrivée rapidement et conforme aux photos. Je recommande vivement !" },
  { name: "Sandra K.", city: "Douala", text: "Le service est impeccable. J'ai commandé via WhatsApp et tout s'est passé parfaitement." },
  { name: "Marie T.", city: "Bafoussam", text: "Des pièces vraiment élégantes à des prix accessibles. Ma boutique préférée !" },
];

export default function Home() {
  useRevealAll();

  const newProducts = products.filter((p) => p.badge === "Nouveau").slice(0, 4);
  const promoProducts = products.filter((p) => p.badge === "Promo").slice(0, 4);
  const popularProducts = products.filter((p) => p.category === "Vêtements" || p.category === "Sacs").slice(0, 4);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#F7F7F5]">
        <div className="absolute inset-0 hero-img">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&h=1000&fit=crop&auto=format"
            alt="OPENSTYLE collection"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24">
          <div className="max-w-xl">
            <p className="hero-label text-xs tracking-[0.35em] uppercase text-[#6B6B6B] mb-5">Collection 2024</p>
            <h1 className="hero-title font-serif text-5xl lg:text-7xl font-bold leading-tight text-[#111] mb-5">
              Votre style,<br />
              <em className="font-normal">votre identité.</em>
            </h1>
            <p className="hero-sub text-base text-[#6B6B6B] leading-relaxed mb-8 max-w-md">
              Découvrez une sélection de vêtements, sacs, accessoires et parfums soigneusement choisis pour accompagner votre quotidien.
            </p>
            <div className="hero-cta flex flex-wrap gap-3">
              <Link
                to="/boutique"
                className="btn-press bg-[#111] text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1C1C1C] transition-colors"
              >
                Découvrir la boutique
              </Link>
              <Link
                to="/nouveautes"
                className="btn-press border border-[#111] text-[#111] px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#111] hover:text-white transition-colors"
              >
                Voir les nouveautés
              </Link>
            </div>
          </div>
        </div>
        {/* Animated scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-cta">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B]">Découvrir</span>
          <div className="w-px h-8 bg-[#6B6B6B] animate-bounce" />
        </div>
      </section>

      {/* Trust band — marquee */}
      <section className="bg-[#111] text-white py-4 overflow-hidden">
        <div className="marquee-track whitespace-nowrap">
          {[...trustItems, ...trustItems].map((t, i) => (
            <span key={i} className="text-xs font-medium tracking-widest mx-10 flex-shrink-0">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div className="reveal">
            <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Explorer par</p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">Nos catégories</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 stagger">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/boutique?cat=${cat.name}`}
              className="reveal group relative aspect-[3/4] overflow-hidden bg-[#F7F7F5]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-serif text-xl font-semibold">{cat.name}</h3>
                <p className="text-xs text-white/70 mt-0.5">{cat.count} produits</p>
                <div className="mt-2 overflow-hidden h-px">
                  <div className="h-px bg-white/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                </div>
                <span className="text-xs tracking-widest uppercase mt-2 inline-block opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Découvrir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nouveautés */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-8">
          <div className="reveal">
            <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Fraîchement arrivé</p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">Nouveautés</h2>
          </div>
          <Link to="/nouveautes" className="reveal text-sm underline-reveal hidden sm:block">Voir tout</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger">
          {newProducts.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative my-14 mx-4 lg:mx-8 overflow-hidden min-h-[340px] flex items-center bg-[#111] reveal">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&h=600&fit=crop&auto=format"
          alt="Promotions"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative max-w-7xl mx-auto px-8 py-16 text-white">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">Offres limitées</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4">Les pièces du moment</h2>
          <p className="text-white/60 max-w-md mb-6 text-sm">Profitez de nos meilleures offres avant qu'il ne soit trop tard.</p>
          <Link
            to="/promotions"
            className="btn-press inline-block border border-white text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-[#111] transition-colors duration-300"
          >
            Découvrir les offres
          </Link>
        </div>
      </section>

      {/* Populaires */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-8">
          <div className="reveal">
            <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Les plus aimés</p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold">Produits populaires</h2>
          </div>
          <Link to="/boutique" className="reveal text-sm underline-reveal hidden sm:block">Voir tout</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger">
          {popularProducts.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Promos */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-end justify-between mb-8">
            <div className="reveal">
              <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Prix réduits</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold">Promotions</h2>
            </div>
            <Link to="/promotions" className="reveal text-sm underline-reveal hidden sm:block">Voir tout</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger">
            {promoProducts.map((p) => (
              <div key={p.id} className="reveal">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wholesale CTA */}
      <section className="bg-[#F7F7F5] my-14 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-3">Revendeurs & Professionnels</p>
          <h2 className="font-serif text-3xl font-bold mb-4">Vous achetez en quantité ?</h2>
          <p className="text-[#6B6B6B] mb-7 max-w-md mx-auto text-sm">
            Accédez à nos tarifs professionnels après validation de votre compte. Commandes à partir de 10 pièces.
          </p>
          <Link
            to="/professionnel"
            className="btn-press inline-block border border-[#111] text-[#111] px-8 py-3.5 text-sm font-semibold tracking-widest uppercase hover:bg-[#111] hover:text-white transition-colors duration-300"
          >
            Demander un accès professionnel
          </Link>
        </div>
      </section>

      {/* À propos */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal-left">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-3">Notre histoire</p>
          <h2 className="font-serif text-4xl font-bold mb-5 leading-tight">
            Élégance,<br />qualité,<br /><em className="font-normal">accessibilité.</em>
          </h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-6 text-sm">
            Chez OPENSTYLE, nous sélectionnons des pièces qui associent élégance, qualité et accessibilité, pour permettre à chacun de construire un style qui lui ressemble.
          </p>
          <Link to="/a-propos" className="text-sm font-semibold underline-reveal tracking-wide">En savoir plus →</Link>
        </div>
        <div className="reveal-right grid grid-cols-2 gap-3">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&auto=format"
            alt="Boutique OPENSTYLE"
            className="aspect-[3/4] object-cover w-full hover:scale-105 transition-transform duration-500"
          />
          <img
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=500&fit=crop&auto=format"
            alt="Mode OPENSTYLE"
            className="aspect-[3/4] object-cover w-full mt-8 hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#111] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">Ce qu'ils disent</p>
            <h2 className="font-serif text-3xl font-bold">Avis clients</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="reveal border border-white/10 p-7 hover:border-white/30 transition-colors duration-300"
              >
                <div className="flex gap-0.5 mb-4 text-yellow-400">
                  {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14 text-center">
        <div className="reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Suivez-nous</p>
          <h2 className="font-serif text-3xl font-bold mb-2">@openstyle_cm</h2>
          <p className="text-[#6B6B6B] text-sm mb-8">Instagram · TikTok · Facebook</p>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 stagger">
          {[
            "photo-1469334031218-e382a71b716b",
            "photo-1483985988355-763728e1935b",
            "photo-1509631179647-0177331693ae",
            "photo-1551232864-3f0890e580d9",
            "photo-1490481651871-ab68de25d43d",
            "photo-1558769132-cb1aea458c5e",
          ].map((id) => (
            <div key={id} className="reveal img-zoom aspect-square bg-[#F7F7F5] cursor-pointer">
              <img
                src={`https://images.unsplash.com/${id}?w=300&h=300&fit=crop&auto=format`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
