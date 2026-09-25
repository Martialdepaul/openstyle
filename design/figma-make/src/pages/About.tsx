import { useEffect } from "react";
import { useRevealAll } from "../hooks/useReveal";

export default function About() {
  useRevealAll();
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative bg-[#111] text-white py-20 px-4 overflow-hidden min-h-[50vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=700&fit=crop&auto=format"
          alt="Boutique OPENSTYLE"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">Notre histoire</p>
          <h1 className="font-serif text-5xl font-bold mb-5 leading-tight">À propos<br /><em className="font-normal">d'OPENSTYLE</em></h1>
          <p className="text-white/70 text-base max-w-xl mx-auto">Une boutique née en 2023 à Yaoundé, construite autour d'une passion pour l'élégance et l'accessibilité.</p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-4 lg:px-8 py-16 grid lg:grid-cols-2 gap-14 items-center">
        <div className="reveal-left">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-3">2023 — Yaoundé</p>
          <h2 className="font-serif text-3xl font-bold mb-5 leading-tight">Un projet né d'une vision</h2>
          <p className="text-[#6B6B6B] leading-relaxed mb-4">
            OPENSTYLE a été fondée en 2023 par Toko Tchazue Thérèse Doriane avec une mission simple : permettre à chacun d'accéder à des pièces élégantes, de qualité, à des prix justes.
          </p>
          <p className="text-[#6B6B6B] leading-relaxed mb-4">
            Basée à Yaoundé, au cœur du marché Mokolo et Elobi, la boutique s'est imposée comme une référence pour toute personne en quête d'un style affirmé, qu'il s'agisse de vêtements, de sacs, d'accessoires ou de parfums.
          </p>
          <p className="text-[#6B6B6B] leading-relaxed">
            Aujourd'hui, OPENSTYLE livre partout au Cameroun et continue de grandir, animée par les mêmes valeurs fondatrices : qualité, élégance, satisfaction et confiance.
          </p>
        </div>
        <div className="reveal-right grid grid-cols-2 gap-3">
          <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=500&fit=crop&auto=format" alt="" className="aspect-[3/4] object-cover w-full hover:scale-105 transition-transform duration-500" />
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop&auto=format" alt="" className="aspect-[3/4] object-cover w-full mt-8 hover:scale-105 transition-transform duration-500" />
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F7F7F5] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-3 text-center">Ce en quoi nous croyons</p>
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Nos valeurs</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {[
              { icon: "✦", title: "Qualité", desc: "Chaque pièce est soigneusement sélectionnée pour sa qualité et sa durabilité." },
              { icon: "◆", title: "Élégance", desc: "Un style épuré, contemporain, adapté à toutes les morphologies et occasions." },
              { icon: "❤", title: "Satisfaction", desc: "Votre satisfaction est notre priorité, du choix jusqu'à la livraison." },
              { icon: "✓", title: "Confiance", desc: "Une relation honnête et transparente avec chacun de nos clients." },
            ].map((v) => (
              <div key={v.title} className="reveal text-center p-6">
                <div className="text-2xl mb-3">{v.icon}</div>
                <h3 className="font-serif text-lg font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: "📍", t: "Localisation", d: "Yaoundé, Mokolo, Elobi\nCentre commercial Dubaï Market" },
          { icon: "📞", t: "Contact", d: "+216 656 356 687\nOpenstyle911@gmail.com" },
          { icon: "🕐", t: "Horaires", d: "Lundi – Samedi\n08h00 – 18h30" },
        ].map((i) => (
          <div key={i.t} className="border border-[#EAEAEA] p-6">
            <span className="text-2xl block mb-3">{i.icon}</span>
            <h4 className="font-semibold mb-2">{i.t}</h4>
            <p className="text-sm text-[#6B6B6B] whitespace-pre-line">{i.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
