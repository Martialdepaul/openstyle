import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="bg-white inline-block p-2 rounded mb-4">
            <Logo className="h-10 w-auto" />
          </div>
          <p className="text-sm text-[#6B6B6B] leading-relaxed mt-3">
            Un style qui s'accorde à votre identité. Vêtements, sacs, accessoires et parfums soigneusement sélectionnés pour vous.
          </p>
          <div className="flex gap-3 mt-5">
            {["facebook", "instagram", "tiktok"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center hover:border-white transition text-xs uppercase"
              >
                {s[0].toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-5 text-[#EAEAEA]">Navigation</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#6B6B6B]">
            {[
              { to: "/", l: "Accueil" },
              { to: "/boutique", l: "La Boutique" },
              { to: "/promotions", l: "Promotions" },
              { to: "/nouveautes", l: "Nouveautés" },
              { to: "/a-propos", l: "À propos" },
              { to: "/contact", l: "Contact" },
            ].map(({ to, l }) => (
              <li key={l}><Link to={to} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Catégories */}
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-5 text-[#EAEAEA]">Catégories</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#6B6B6B]">
            {["Vêtements", "Sacs", "Accessoires", "Parfums"].map((c) => (
              <li key={c}>
                <Link to={`/boutique?cat=${c}`} className="hover:text-white transition">{c}</Link>
              </li>
            ))}
          </ul>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-5 mt-8 text-[#EAEAEA]">Informations</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#6B6B6B]">
            {[
              { to: "/livraison", l: "Livraison" },
              { to: "/faq", l: "FAQ" },
              { to: "/retours", l: "Retours & Échanges" },
            ].map(({ to, l }) => (
              <li key={l}><Link to={to} className="hover:text-white transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-5 text-[#EAEAEA]">Contact</h4>
          <ul className="flex flex-col gap-4 text-sm text-[#6B6B6B]">
            <li className="flex gap-2">
              <span>📍</span>
              <span>Yaoundé, Mokolo, Elobi<br />Centre commercial Dubaï Market</span>
            </li>
            <li>
              <a href="tel:+216656356687" className="hover:text-white transition">📞 +216 656 356 687</a>
            </li>
            <li>
              <a href="mailto:Openstyle911@gmail.com" className="hover:text-white transition">✉️ Openstyle911@gmail.com</a>
            </li>
            <li>🕐 08h00 – 18h30</li>
          </ul>
          <a
            href="https://wa.me/216656356687"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2.5 rounded hover:bg-[#20c05a] transition"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.477 0 0 4.477 0 10c0 1.763.463 3.414 1.27 4.845L0 20l5.284-1.247A9.953 9.953 0 0010 20c5.523 0 10-4.477 10-10S15.523 0 10 0zm5.197 14.203c-.22.614-1.088 1.124-1.777 1.271-.473.1-1.09.18-3.167-.68-2.658-1.08-4.37-3.77-4.502-3.944-.13-.172-1.067-1.42-1.067-2.71 0-1.29.675-1.922.915-2.183.24-.26.522-.325.696-.325h.5c.16 0 .378-.06.59.45.22.523.74 1.812.805 1.943.065.13.108.282.02.455-.086.172-.13.28-.26.43-.13.15-.274.336-.39.452-.13.13-.266.27-.114.53.152.26.674 1.11 1.447 1.797.994.887 1.831 1.162 2.09 1.29.26.13.41.108.562-.065.152-.172.65-.758.824-1.018.173-.26.347-.217.585-.13.238.087 1.52.717 1.78.848.26.13.433.195.497.303.063.107.063.62-.158 1.236z" />
            </svg>
            Commander via WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#6B6B6B]">
        <span>© {new Date().getFullYear()} OPENSTYLE. Tous droits réservés.</span>
        <div className="flex gap-5">
          <Link to="/cgv" className="hover:text-white transition">CGV</Link>
          <Link to="/confidentialite" className="hover:text-white transition">Confidentialité</Link>
          <Link to="/retours" className="hover:text-white transition">Retours</Link>
        </div>
      </div>
    </footer>
  );
}
