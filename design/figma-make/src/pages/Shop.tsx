import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, type Category, formatPrice } from "../data";
import ProductCard from "../components/ProductCard";

const allCategories: Category[] = ["Vêtements", "Sacs", "Accessoires", "Parfums"];
const sortOptions = [
  { value: "default", label: "Pertinence" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "new", label: "Nouveautés" },
];

export default function Shop() {
  const [params] = useSearchParams();
  const catParam = params.get("cat") as Category | null;
  const qParam = params.get("q") || "";

  const [selectedCat, setSelectedCat] = useState<Category | null>(catParam);
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [search, setSearch] = useState(qParam);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat) list = list.filter((p) => p.category === selectedCat);
    if (onlyPromo) list = list.filter((p) => p.badge === "Promo");
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "new") list = list.filter((p) => p.badge === "Nouveau").concat(list.filter((p) => p.badge !== "Nouveau"));
    return list;
  }, [selectedCat, sort, priceRange, onlyPromo, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 page-enter">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-[#6B6B6B] mb-2">OPENSTYLE</p>
        <h1 className="font-serif text-4xl font-bold">La boutique</h1>
        <p className="text-[#6B6B6B] mt-2 text-sm">Vêtements, sacs, accessoires et parfums soigneusement sélectionnés</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full border border-[#EAEAEA] px-4 py-3 text-sm pr-10 focus:outline-none focus:border-[#111]"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" width="16" height="16" viewBox="0 0 18 18" fill="none">
          <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters - Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-28">
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Catégories</h3>
            <ul className="flex flex-col gap-2 mb-6">
              <li>
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`text-sm ${!selectedCat ? "font-semibold" : "text-[#6B6B6B] hover:text-[#111]"}`}
                >
                  Tout ({products.length})
                </button>
              </li>
              {allCategories.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setSelectedCat(c)}
                    className={`text-sm ${selectedCat === c ? "font-semibold" : "text-[#6B6B6B] hover:text-[#111]"}`}
                  >
                    {c} ({products.filter((p) => p.category === c).length})
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4">Prix</h3>
            <div className="mb-6">
              <input
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full accent-[#111]"
              />
              <div className="flex justify-between text-xs text-[#6B6B6B] mt-1">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            <h3 className="text-xs tracking-widest uppercase font-semibold mb-3">Filtres</h3>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={onlyPromo}
                onChange={(e) => setOnlyPromo(e.target.checked)}
                className="accent-[#111]"
              />
              Promotions uniquement
            </label>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                className="lg:hidden border border-[#EAEAEA] px-4 py-2 text-xs uppercase tracking-wide"
                onClick={() => setFilterOpen(true)}
              >
                Filtres
              </button>
              {/* Category pills */}
              <button
                onClick={() => setSelectedCat(null)}
                className={`px-3 py-1.5 text-xs border transition ${!selectedCat ? "bg-[#111] text-white border-[#111]" : "border-[#EAEAEA] hover:border-[#111]"}`}
              >
                Tout
              </button>
              {allCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCat(c)}
                  className={`px-3 py-1.5 text-xs border transition ${selectedCat === c ? "bg-[#111] text-white border-[#111]" : "border-[#EAEAEA] hover:border-[#111]"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B6B6B]">{filtered.length} produits</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-[#EAEAEA] text-xs px-3 py-2 focus:outline-none focus:border-[#111] bg-white"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-[#6B6B6B]">Aucun produit trouvé</p>
              <button onClick={() => { setSelectedCat(null); setSearch(""); }} className="mt-3 text-sm underline">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-[200] flex lg:hidden">
          <div className="bg-black/40 flex-1" onClick={() => setFilterOpen(false)} />
          <div className="bg-white w-72 h-full p-6 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="font-semibold">Filtres</h3>
              <button onClick={() => setFilterOpen(false)}>✕</button>
            </div>
            <h4 className="text-xs tracking-widest uppercase font-semibold mb-3">Catégories</h4>
            <ul className="flex flex-col gap-2 mb-6">
              <li>
                <button onClick={() => { setSelectedCat(null); setFilterOpen(false); }} className={`text-sm ${!selectedCat ? "font-semibold" : "text-[#6B6B6B]"}`}>
                  Tout
                </button>
              </li>
              {allCategories.map((c) => (
                <li key={c}>
                  <button onClick={() => { setSelectedCat(c); setFilterOpen(false); }} className={`text-sm ${selectedCat === c ? "font-semibold" : "text-[#6B6B6B]"}`}>
                    {c}
                  </button>
                </li>
              ))}
            </ul>
            <h4 className="text-xs tracking-widest uppercase font-semibold mb-3">Promotions</h4>
            <label className="flex items-center gap-2 text-sm cursor-pointer mb-6">
              <input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} className="accent-[#111]" />
              Promotions uniquement
            </label>
            <button
              onClick={() => setFilterOpen(false)}
              className="w-full bg-[#111] text-white py-3 text-sm font-semibold"
            >
              Voir {filtered.length} produits
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
