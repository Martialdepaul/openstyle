import { Link } from "react-router-dom";
import { useCartStore } from "../store";
import { formatPrice } from "../data";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="bg-black/40 flex-1 overlay-fade" onClick={closeCart} />
      <div className="bg-white w-full max-w-md flex flex-col h-full shadow-2xl cart-panel">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAEAEA]">
          <h2 className="font-serif text-lg font-semibold">Panier ({items.length})</h2>
          <button onClick={closeCart} className="text-xl leading-none hover:opacity-60">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-5xl">🛒</div>
              <p className="text-[#6B6B6B]">Votre panier est vide</p>
              <button onClick={closeCart} className="text-sm underline">Continuer mes achats</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 py-4 border-b border-[#EAEAEA]">
                  <Link to={`/produit/${item.product.id}`} onClick={closeCart}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover bg-[#F7F7F5]"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#6B6B6B] uppercase tracking-wide">{item.product.category}</p>
                    <p className="text-sm font-medium leading-tight mt-0.5">{item.product.name}</p>
                    {item.size && <p className="text-xs text-[#6B6B6B] mt-0.5">Taille : {item.size}</p>}
                    {item.color && <p className="text-xs text-[#6B6B6B]">Couleur : {item.color}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#EAEAEA]">
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm hover:bg-[#F7F7F5]"
                        >−</button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-sm hover:bg-[#F7F7F5]"
                        >+</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#6B6B6B] hover:text-[#111] text-lg leading-none"
                        >×</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#EAEAEA]">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-[#6B6B6B]">Sous-total</span>
              <span className="text-sm font-semibold">{formatPrice(total())}</span>
            </div>
            <p className="text-xs text-[#6B6B6B] mb-4">Frais de livraison calculés au checkout</p>
            <Link
              to="/commande"
              onClick={closeCart}
              className="block w-full bg-[#111] text-white text-center text-sm font-semibold tracking-wider uppercase py-4 hover:bg-[#1C1C1C] transition mb-3"
            >
              Passer la commande
            </Link>
            <a
              href={`https://wa.me/216656356687?text=Bonjour, je souhaite commander : ${items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full border border-[#25D366] text-[#25D366] text-sm font-semibold py-3 hover:bg-[#25D366] hover:text-white transition"
            >
              Commander via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
