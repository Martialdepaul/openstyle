import { useState } from "react";
import { products, formatPrice } from "../data";

type AdminTab = "dashboard" | "produits" | "commandes" | "clients" | "stocks";

const mockOrders = [
  { ref: "OS-K7P2MX", client: "Aïcha M.", date: "12 Sep", total: 63000, status: "Livrée", mode: "Orange Money" },
  { ref: "OS-A1B3QR", client: "Sandra K.", date: "05 Sep", total: 28000, status: "En préparation", mode: "MTN MoMo" },
  { ref: "OS-X9Z4WE", client: "Marie T.", date: "28 Août", total: 45000, status: "Confirmée", mode: "À la livraison" },
  { ref: "OS-P5R8TY", client: "Joëlle N.", date: "20 Août", total: 18500, status: "En attente", mode: "Orange Money" },
  { ref: "OS-C2L6UV", client: "Carole B.", date: "15 Août", total: 35000, status: "Annulée", mode: "MTN MoMo" },
];

const statusColor: Record<string, string> = {
  "Livrée": "bg-green-100 text-green-800",
  "En préparation": "bg-yellow-100 text-yellow-800",
  "Confirmée": "bg-blue-100 text-blue-800",
  "En attente": "bg-gray-100 text-gray-600",
  "Annulée": "bg-red-100 text-red-800",
};

const stats = [
  { label: "Chiffre d'affaires", val: "1 842 500 FCFA", sub: "Septembre 2024", icon: "💰" },
  { label: "Commandes", val: "47", sub: "+12 cette semaine", icon: "📦" },
  { label: "En attente", val: "8", sub: "À traiter", icon: "⏳" },
  { label: "Ruptures de stock", val: "2", sub: "Produits épuisés", icon: "⚠️" },
];

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [editProduct, setEditProduct] = useState<number | null>(null);

  const navItems = [
    { id: "dashboard", l: "Tableau de bord", icon: "📊" },
    { id: "produits", l: "Produits", icon: "👗" },
    { id: "commandes", l: "Commandes", icon: "📦" },
    { id: "clients", l: "Clients", icon: "👥" },
    { id: "stocks", l: "Stocks", icon: "📦" },
  ] as { id: AdminTab; l: string; icon: string }[];

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#111] text-white flex flex-col py-6 flex-shrink-0 min-h-screen">
        <div className="px-5 mb-8">
          <p className="font-serif text-lg font-bold">OPENSTYLE</p>
          <p className="text-xs text-white/40 mt-0.5">Administration</p>
        </div>
        <nav className="flex flex-col gap-1 px-2 flex-1">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm text-left rounded transition ${
                tab === n.id ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{n.icon}</span>
              <span>{n.l}</span>
            </button>
          ))}
        </nav>
        <div className="px-5 mt-8 border-t border-white/10 pt-4">
          <p className="text-xs text-white/40">Gérante</p>
          <p className="text-sm font-medium text-white">Toko T. Doriane</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-6 overflow-auto">
        {tab === "dashboard" && (
          <div>
            <h1 className="font-serif text-2xl font-bold mb-6">Tableau de bord</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-white p-5 border border-[#EAEAEA]">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-xs text-[#6B6B6B] uppercase tracking-wide">{s.label}</p>
                    <span className="text-lg">{s.icon}</span>
                  </div>
                  <p className="text-xl font-bold text-[#111]">{s.val}</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Bar chart simulation */}
            <div className="bg-white border border-[#EAEAEA] p-6 mb-6">
              <h3 className="font-semibold text-sm mb-4">Ventes — 7 derniers jours</h3>
              <div className="flex items-end gap-3 h-24">
                {[65, 80, 45, 90, 70, 110, 95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[#111] transition-all"
                      style={{ height: `${(h / 110) * 80}px` }}
                    />
                    <span className="text-[10px] text-[#6B6B6B]">{["L","M","M","J","V","S","D"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white border border-[#EAEAEA] p-6">
              <h3 className="font-semibold text-sm mb-4">Dernières commandes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#EAEAEA]">
                      <th className="text-left py-2 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide pb-3">Référence</th>
                      <th className="text-left py-2 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide pb-3">Client</th>
                      <th className="text-left py-2 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide pb-3">Date</th>
                      <th className="text-left py-2 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide pb-3">Montant</th>
                      <th className="text-left py-2 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide pb-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((o) => (
                      <tr key={o.ref} className="border-b border-[#F7F7F5] hover:bg-[#F7F7F5] transition">
                        <td className="py-3 font-mono text-xs">{o.ref}</td>
                        <td className="py-3">{o.client}</td>
                        <td className="py-3 text-[#6B6B6B]">{o.date}</td>
                        <td className="py-3 font-semibold">{formatPrice(o.total)}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[o.status] || ""}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "produits" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-2xl font-bold">Produits</h1>
              <button className="bg-[#111] text-white px-4 py-2 text-sm font-semibold">+ Ajouter un produit</button>
            </div>
            <div className="bg-white border border-[#EAEAEA] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#EAEAEA]">
                    {["Produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[#F7F7F5] hover:bg-[#F7F7F5] transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover bg-[#F7F7F5]" />
                          <div>
                            <p className="font-medium text-xs">{p.name}</p>
                            <p className="text-[10px] text-[#6B6B6B]">{p.ref}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B6B6B]">{p.category}</td>
                      <td className="px-4 py-3 text-xs font-semibold">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${p.stock > 5 ? "text-green-600" : p.stock > 0 ? "text-yellow-600" : "text-red-600"}`}>
                          {p.stock} unités
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Actif</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="text-xs text-[#6B6B6B] hover:text-[#111]">Modifier</button>
                          <button className="text-xs text-red-400 hover:text-red-600">Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "commandes" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-2xl font-bold">Commandes</h1>
              <button className="border border-[#EAEAEA] bg-white text-sm px-4 py-2 hover:border-[#111]">
                Exporter CSV
              </button>
            </div>
            <div className="bg-white border border-[#EAEAEA] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#EAEAEA]">
                    {["Référence", "Client", "Date", "Montant", "Paiement", "Statut", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((o) => (
                    <tr key={o.ref} className="border-b border-[#F7F7F5] hover:bg-[#F7F7F5] transition">
                      <td className="px-4 py-3 font-mono text-xs">{o.ref}</td>
                      <td className="px-4 py-3">{o.client}</td>
                      <td className="px-4 py-3 text-[#6B6B6B]">{o.date}</td>
                      <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3 text-xs text-[#6B6B6B]">{o.mode}</td>
                      <td className="px-4 py-3">
                        <select className="text-xs border border-[#EAEAEA] px-2 py-1 bg-white focus:outline-none">
                          {["En attente", "Confirmée", "En préparation", "Expédiée", "Livrée", "Annulée"].map((s) => (
                            <option key={s} value={s} selected={s === o.status}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-[#6B6B6B] hover:text-[#111]">Détail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "clients" && (
          <div>
            <h1 className="font-serif text-2xl font-bold mb-6">Clients</h1>
            <div className="grid gap-4 mb-8">
              <div className="bg-white border border-[#EAEAEA] p-6">
                <h3 className="font-semibold text-sm mb-4">Demandes professionnelles</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { name: "Mode Elite SARL", city: "Douala", date: "10 Sep", status: "En attente" },
                    { name: "Boutique Chic", city: "Bafoussam", date: "08 Sep", status: "Validée" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between border-b border-[#F7F7F5] pb-3">
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-[#6B6B6B]">{c.city} · {c.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "Validée" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {c.status}
                        </span>
                        {c.status === "En attente" && (
                          <button className="text-xs bg-[#111] text-white px-2 py-1">Valider</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "stocks" && (
          <div>
            <h1 className="font-serif text-2xl font-bold mb-6">Gestion des stocks</h1>
            <div className="bg-white border border-[#EAEAEA] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#EAEAEA]">
                    {["Produit", "Catégorie", "Stock", "Seuil d'alerte", "État"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-[#6B6B6B] font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[#F7F7F5] hover:bg-[#F7F7F5] transition">
                      <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-xs text-[#6B6B6B]">{p.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${p.stock > 10 ? "bg-green-500" : p.stock > 5 ? "bg-yellow-400" : p.stock > 0 ? "bg-orange-400" : "bg-red-500"}`}
                              style={{ width: `${Math.min(100, (p.stock / 25) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">{p.stock}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B6B6B]">5 unités</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.stock === 0 ? "bg-red-100 text-red-800" :
                          p.stock <= 5 ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {p.stock === 0 ? "Épuisé" : p.stock <= 5 ? "Stock faible" : "OK"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
