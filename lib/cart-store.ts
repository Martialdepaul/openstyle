"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Panier (F05) : stocké dans le navigateur (localStorage), pas de table en
 * base. Une ligne référence un produit par son slug plus les options
 * choisies (taille/couleur/parfum) ; le prix et la disponibilité réels sont
 * relus via lib/actions/cart.ts (Prisma) à l'affichage, jamais stockés dans
 * le panier lui-même — RG F05 : "le panier est revalidé côté serveur (prix,
 * disponibilité)".
 */
export type CartLine = {
  productSlug: string;
  size?: string;
  color?: string;
  scent?: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity">, quantity: number) => void;
  removeLine: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clear: () => void;
  count: () => number;
};

function sameVariant(a: CartLine, b: Omit<CartLine, "quantity">) {
  return a.productSlug === b.productSlug && a.size === b.size && a.color === b.color && a.scent === b.scent;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addLine: (line, quantity) => {
        set((state) => {
          const existingIndex = state.lines.findIndex((l) => sameVariant(l, line));
          if (existingIndex >= 0) {
            const lines = [...state.lines];
            lines[existingIndex] = {
              ...lines[existingIndex],
              quantity: lines[existingIndex].quantity + quantity,
            };
            return { lines };
          }
          return { lines: [...state.lines, { ...line, quantity }] };
        });
      },
      removeLine: (index) => set((state) => ({ lines: state.lines.filter((_, i) => i !== index) })),
      updateQuantity: (index, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((_, i) => i !== index)
              : state.lines.map((l, i) => (i === index ? { ...l, quantity } : l)),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "openstyle-cart" },
  ),
);
