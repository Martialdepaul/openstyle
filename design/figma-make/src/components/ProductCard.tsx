import { Link } from "react-router-dom";
import type { Product } from "../data";
import { formatPrice } from "../data";
import { useCartStore } from "../store";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group relative bg-white">
      {/* Image */}
      <Link to={`/produit/${product.id}`} className="block overflow-hidden bg-[#F7F7F5] aspect-[3/4] relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-semibold tracking-wider px-2.5 py-1 ${
            product.badge === "Promo" ? "bg-[#111] text-white" : "bg-white text-[#111] border border-[#111]"
          }`}>
            {product.badge === "Promo" ? "SOLDES" : "NOUVEAU"}
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-semibold tracking-widest uppercase text-[#6B6B6B]">Épuisé</span>
          </div>
        )}
        {/* Quick add on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out bg-[#111] text-white text-center py-3 text-xs font-semibold tracking-widest uppercase">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-full"
            disabled={product.stock === 0}
          >
            Ajouter au panier
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-3 pb-1">
        <p className="text-[10px] tracking-widest uppercase text-[#6B6B6B] mb-1">{product.category}</p>
        <Link to={`/produit/${product.id}`} className="text-sm font-medium hover:underline leading-tight block">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.priceOld && (
            <span className="text-xs text-[#6B6B6B] line-through">{formatPrice(product.priceOld)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
