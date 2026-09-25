import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "../data";
import { useCartStore } from "../store";
import ProductCard from "../components/ProductCard";

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">😔</p>
        <p className="font-serif text-2xl mb-4">Produit introuvable</p>
        <Link to="/boutique" className="underline text-sm">Retour à la boutique</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addItem(product, qty, selectedSize, selectedColor, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 page-enter">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#6B6B6B] mb-8 flex gap-2">
        <Link to="/" className="hover:text-[#111]">Accueil</Link>
        <span>/</span>
        <Link to="/boutique" className="hover:text-[#111]">Boutique</Link>
        <span>/</span>
        <Link to={`/boutique?cat=${product.category}`} className="hover:text-[#111]">{product.category}</Link>
        <span>/</span>
        <span className="text-[#111]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] bg-[#F7F7F5] overflow-hidden mb-3">
            <img
              src={product.images[mainImg] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`w-16 h-20 bg-[#F7F7F5] overflow-hidden border-2 transition ${mainImg === i ? "border-[#111]" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.badge && (
            <span className={`text-xs font-semibold tracking-widest px-2.5 py-1 mb-4 inline-block ${
              product.badge === "Promo" ? "bg-[#111] text-white" : "border border-[#111]"
            }`}>
              {product.badge === "Promo" ? "SOLDES" : "NOUVEAU"}
            </span>
          )}
          <p className="text-xs tracking-widest uppercase text-[#6B6B6B] mb-1">{product.category}</p>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-xs text-[#6B6B6B] mb-4">Réf. {product.ref}</p>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.priceOld && (
              <span className="text-base text-[#6B6B6B] line-through">{formatPrice(product.priceOld)}</span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-400" : "bg-red-500"}`} />
            <span className="text-xs text-[#6B6B6B]">
              {product.stock > 5 ? "En stock" : product.stock > 0 ? `Plus que ${product.stock} en stock` : "Épuisé"}
            </span>
          </div>

          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">{product.description}</p>

          {/* Sizes */}
          {product.sizes && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest font-semibold mb-2">Taille {selectedSize && `— ${selectedSize}`}</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs border transition ${selectedSize === s ? "bg-[#111] text-white border-[#111]" : "border-[#EAEAEA] hover:border-[#111]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest font-semibold mb-2">Couleur {selectedColor && `— ${selectedColor}`}</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 text-xs border transition ${selectedColor === c ? "bg-[#111] text-white border-[#111]" : "border-[#EAEAEA] hover:border-[#111]"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest font-semibold mb-2">Format {selectedVariant && `— ${selectedVariant}`}</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 text-xs border transition ${selectedVariant === v ? "bg-[#111] text-white border-[#111]" : "border-[#EAEAEA] hover:border-[#111]"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add */}
          <div className="flex gap-3 mt-6 flex-wrap">
            <div className="flex items-center border border-[#EAEAEA]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-[#F7F7F5]">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-12 flex items-center justify-center hover:bg-[#F7F7F5]">+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 py-3 text-sm font-semibold tracking-widest uppercase transition ${
                added ? "bg-green-600 text-white" : "bg-[#111] text-white hover:bg-[#1C1C1C]"
              } disabled:opacity-40`}
            >
              {added ? "Ajouté ✓" : product.stock === 0 ? "Épuisé" : "Ajouter au panier"}
            </button>
          </div>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/216656356687?text=Bonjour, je suis intéressé(e) par : ${product.name} (Réf. ${product.ref})`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full border border-[#25D366] text-[#25D366] py-3 text-sm font-semibold mt-3 hover:bg-[#25D366] hover:text-white transition"
          >
            Commander via WhatsApp
          </a>

          {/* Reassurance */}
          <div className="mt-8 border-t border-[#EAEAEA] pt-6 grid grid-cols-2 gap-4">
            {[
              { icon: "🚚", t: "Livraison au Cameroun" },
              { icon: "💬", t: "Assistance WhatsApp" },
              { icon: "🔄", t: "Échange possible" },
              { icon: "✅", t: "Qualité garantie" },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-2">
                <span>{r.icon}</span>
                <span className="text-xs text-[#6B6B6B]">{r.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold mb-6">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
