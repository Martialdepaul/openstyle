import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 page-enter">
      <div className="mb-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">Nous sommes là</p>
        <h1 className="font-serif text-4xl font-bold">Contactez-nous</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <div className="flex flex-col gap-6 mb-8">
            {[
              { icon: "📍", t: "Adresse", d: "Yaoundé, Mokolo, Elobi\nCentre commercial Dubaï Market" },
              { icon: "📞", t: "Téléphone", d: "+216 656 356 687", href: "tel:+216656356687" },
              { icon: "✉️", t: "Email", d: "Openstyle911@gmail.com", href: "mailto:Openstyle911@gmail.com" },
              { icon: "🕐", t: "Horaires", d: "Lundi – Samedi : 08h00 – 18h30" },
            ].map((c) => (
              <div key={c.t} className="flex gap-4">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-0.5">{c.t}</p>
                  {c.href ? (
                    <a href={c.href} className="text-sm text-[#6B6B6B] hover:text-[#111] whitespace-pre-line">{c.d}</a>
                  ) : (
                    <p className="text-sm text-[#6B6B6B] whitespace-pre-line">{c.d}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <a
              href="tel:+216656356687"
              className="flex-1 border border-[#111] text-center text-sm font-semibold py-3 hover:bg-[#111] hover:text-white transition"
            >
              Appeler
            </a>
            <a
              href="https://wa.me/216656356687"
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-[#25D366] text-white text-center text-sm font-semibold py-3 hover:bg-[#20c05a] transition"
            >
              WhatsApp
            </a>
          </div>

          {/* Map placeholder */}
          <div className="mt-8 bg-[#F7F7F5] h-48 flex items-center justify-center border border-[#EAEAEA]">
            <div className="text-center text-[#6B6B6B]">
              <p className="text-3xl mb-2">📍</p>
              <p className="text-sm">Yaoundé, Mokolo</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Centre commercial Dubaï Market</p>
            </div>
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 border border-[#EAEAEA] p-8">
            <div className="text-5xl">✅</div>
            <h3 className="font-serif text-2xl font-bold">Message envoyé !</h3>
            <p className="text-[#6B6B6B] text-sm">Nous vous répondrons dans les plus brefs délais.</p>
            <button onClick={() => setSent(false)} className="text-sm underline">Envoyer un autre message</button>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {["Prénom", "Nom"].map((l) => (
                <div key={l}>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                  <input required className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                </div>
              ))}
            </div>
            {[
              { l: "Téléphone / WhatsApp", t: "tel" },
              { l: "Email", t: "email" },
            ].map(({ l, t }) => (
              <div key={l}>
                <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                <input type={t} className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
              </div>
            ))}
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">Objet</label>
              <select className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111] bg-white">
                <option>Question sur un produit</option>
                <option>Suivi de commande</option>
                <option>Tarifs professionnels</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">Message *</label>
              <textarea
                required
                rows={5}
                className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111] resize-none"
              />
            </div>
            <button type="submit" className="bg-[#111] text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#1C1C1C] transition">
              Envoyer le message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
