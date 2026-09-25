import { create } from "zustand";
import type { Product } from "./data";

interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  variant?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, qty?: number, size?: string, color?: string, variant?: string) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product, qty = 1, size, color, variant) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, { product, quantity: qty, size, color, variant }], isOpen: true };
    });
  },
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.product.id !== id) })),
  updateQty: (id, qty) =>
    set((state) => ({
      items: qty <= 0
        ? state.items.filter((i) => i.product.id !== id)
        : state.items.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)),
    })),
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
