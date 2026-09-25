"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

/** F06 : une fois la commande enregistrée, le panier du navigateur est vidé. */
export default function ClearCartOnMount() {
  const clear = useCartStore((state) => state.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
