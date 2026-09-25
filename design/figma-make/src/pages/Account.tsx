import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../data";

const mockOrders = [
  { ref: "OS-K7P2MX", date: "12 Sep 2024", total: 63000, status: "Livrée", items: 3 },
  { ref: "OS-A1B3QR", date: "05 Sep 2024", total: 28000, status: "En préparation", items: 1 },
  { ref: "OS-X9Z4WE", date: "28 Août 2024", total: 45000, status: "Confirmée", items: 2 },
];

const statusColor: Record<string, string> = {
  "Livrée": "bg-green-100 text-green-800",
  "En préparation": "bg-yellow-100 text-yellow-800",
  "Confirmée": "bg-blue-100 text-blue-800",
  "En attente": "bg-gray-100 text-gray-600",
  "Annulée": "bg-red-100 text-red-800",
};

type Tab = "dashboard" | "commandes" | "profil" | "professionnel";

export default function Account() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [proStatus, setProStatus] = useState<"none" | "sent" | "validated">("none");

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 page-enter">
      <div className="mb-6">
        <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-1">Espace client</p>
        <h1 className="font-serif text-3xl font-bold">Mon compte</h1>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {([
              { id: "dashboard", label: "Tableau de bord", icon: "📊" },
              { id: "commandes", label: "Mes commandes", icon: "📦" },
              { id: "profil", label: "Mon profil", icon: "👤" },
              { id: "professionnel", label: "Compte pro", icon: "🏢" },
            ] as { id: Tab; label: string; icon: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm text-left whitespace-nowrap lg:whitespace-normal border-b-2 lg:border-b-0 lg:border-l-2 transition ${
                  tab === t.id
                    ? "border-[#111] font-semibold"
                    : "border-transparent text-[#6B6B6B] hover:text-[#111]"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
            <button className="flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:text-red-700 lg:mt-8 whitespace-nowrap">
              <span>🚪</span><span>Déconnexion</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div>
          {tab === "dashboard" && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-5">Bonjour, Doriane 👋</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Commandes", val: mockOrders.length },
                  { label: "En cours", val: 1 },
                  { label: "Livraisons", val: 1 },
                ].map((s) => (
                  <div key={s.label} className="border border-[#EAEAEA] p-5">
                    <p className="text-2xl font-bold">{s.val}</p>
                    <p className="text-xs text-[#6B6B6B] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-sm mb-3">Dernières commandes</h3>
              <div className="flex flex-col gap-3">
                {mockOrders.slice(0, 2).map((o) => (
                  <div key={o.ref} className="flex items-center justify-between border border-[#EAEAEA] p-4 gap-3 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold">{o.ref}</p>
                      <p className="text-xs text-[#6B6B6B]">{o.date} · {o.items} article(s)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[o.status] || ""}`}>{o.status}</span>
                      <span className="text-sm font-semibold">{formatPrice(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "commandes" && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-5">Mes commandes</h2>
              <div className="flex flex-col gap-4">
                {mockOrders.map((o) => (
                  <div key={o.ref} className="border border-[#EAEAEA] p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold">{o.ref}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{o.date} · {o.items} article(s)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[o.status] || ""}`}>{o.status}</span>
                        <span className="font-semibold">{formatPrice(o.total)}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <a
                        href={`https://wa.me/216656356687?text=Bonjour, je souhaite des infos sur ma commande ${o.ref}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs border border-[#25D366] text-[#25D366] px-3 py-1.5 hover:bg-[#25D366] hover:text-white transition"
                      >
                        Suivi WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "profil" && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-5">Mon profil</h2>
              <div className="grid gap-4 max-w-md">
                {[
                  { l: "Prénom", v: "Doriane" },
                  { l: "Nom", v: "Tchazue Thérèse" },
                  { l: "Téléphone", v: "+216 656 356 687" },
                  { l: "Email", v: "client@example.com" },
                  { l: "Ville", v: "Yaoundé" },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                    <input defaultValue={v} className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                  </div>
                ))}
                <button className="bg-[#111] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1C1C1C] transition w-fit">
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {tab === "professionnel" && (
            <div>
              <h2 className="font-serif text-xl font-bold mb-2">Compte professionnel</h2>
              <p className="text-sm text-[#6B6B6B] mb-6">Accédez aux tarifs de gros après validation de votre demande.</p>

              {proStatus === "none" && (
                <div>
                  <div className="border border-[#EAEAEA] p-6 mb-6">
                    <h3 className="font-semibold mb-1">Vous n'avez pas encore de compte professionnel</h3>
                    <p className="text-sm text-[#6B6B6B]">Remplissez le formulaire ci-dessous pour demander l'accès aux tarifs professionnels.</p>
                  </div>
                  <div className="grid gap-4 max-w-md">
                    {[
                      { l: "Nom de l'entreprise / boutique" },
                      { l: "Activité (revendeur, boutique, distributeur...)" },
                      { l: "Ville" },
                      { l: "Quantité moyenne souhaitée" },
                    ].map(({ l }) => (
                      <div key={l}>
                        <label className="block text-xs uppercase tracking-widest font-semibold mb-1.5">{l}</label>
                        <input className="w-full border border-[#EAEAEA] px-4 py-3 text-sm focus:outline-none focus:border-[#111]" />
                      </div>
                    ))}
                    <button
                      onClick={() => setProStatus("sent")}
                      className="bg-[#111] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1C1C1C] transition w-fit"
                    >
                      Envoyer la demande
                    </button>
                  </div>
                </div>
              )}

              {proStatus === "sent" && (
                <div className="border border-[#EAEAEA] p-6 text-center">
                  <p className="text-3xl mb-3">⏳</p>
                  <h3 className="font-semibold mb-2">Demande envoyée</h3>
                  <p className="text-sm text-[#6B6B6B]">Votre demande est en cours d'examen. Nous vous contacterons sous 24-48h.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
