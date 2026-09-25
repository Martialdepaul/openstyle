"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/cart-store";
import { formatPriceFcfa } from "@/lib/currency";
import type { ProductWithRelations } from "@/lib/products";

type Axis = "size" | "color" | "scent";
type Selection = Partial<Record<Axis, string>>;
type VariantRow = ProductWithRelations["variants"][number];

/** Une combinaison correspond si chaque axe utilisé par le produit est égal (RG-22/23). */
function matches(variant: VariantRow, selection: Selection, axes: Axis[]) {
  return axes.every((axis) => (variant[axis] ?? undefined) === selection[axis]);
}

function isValueAvailable(variants: VariantRow[], axis: Axis, value: string, selection: Selection, axes: Axis[]) {
  const otherAxes = axes.filter((a) => a !== axis);
  return variants.some(
    (v) => (v[axis] ?? undefined) === value && v.stock > 0 && otherAxes.every((a) => (v[a] ?? undefined) === selection[a]),
  );
}

export default function ProductDetailInteractive({ product }: { product: ProductWithRelations }) {
  const t = useTranslations("Product");
  const addLine = useCartStore((s) => s.addLine);

  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size).filter((v): v is string => !!v))),
    [product.variants],
  );
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color).filter((v): v is string => !!v))),
    [product.variants],
  );
  const scents = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.scent).filter((v): v is string => !!v))),
    [product.variants],
  );

  const axes: Axis[] = [
    ...(sizes.length ? (["size"] as const) : []),
    ...(colors.length ? (["color"] as const) : []),
    ...(scents.length ? (["scent"] as const) : []),
  ];

  const [selection, setSelection] = useState<Selection>({
    size: sizes[0],
    color: colors[0],
    scent: scents[0],
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants.find((v) => matches(v, selection, axes));
  const price = product.pricePromo ?? product.priceRetail;
  const available = !!selectedVariant && selectedVariant.stock > 0;
  const maxQuantity = selectedVariant?.stock ?? 0;

  function select(axis: Axis, value: string) {
    setSelection((prev) => ({ ...prev, [axis]: value }));
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!selectedVariant || selectedVariant.stock === 0) return;
    addLine({ productSlug: product.slug, size: selection.size, color: selection.color, scent: selection.scent }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function renderAxis(axis: Axis, values: string[], label: string) {
    if (values.length === 0) return null;
    return (
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest">
          {label} {selection[axis] && `— ${selection[axis]}`}
        </p>
        <div className="flex flex-wrap gap-2">
          {values.map((value) => {
            const isSelected = selection[axis] === value;
            const isAvailable = isValueAvailable(product.variants, axis, value, selection, axes);
            return (
              <button
                key={value}
                onClick={() => select(axis, value)}
                disabled={!isAvailable}
                className={`border px-3 py-1.5 text-xs transition ${
                  isSelected
                    ? "border-os-black bg-os-black text-white"
                    : isAvailable
                      ? "border-os-gray hover:border-os-black"
                      : "border-os-gray text-os-muted line-through opacity-50"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderAxis("size", sizes, t("sizeLabel"))}
      {renderAxis("color", colors, t("colorLabel"))}
      {renderAxis("scent", scents, t("scentLabel"))}

      <div className="mt-6 flex flex-wrap gap-3 pb-24 lg:pb-0">
        <div className="flex items-center border border-os-gray">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-12 w-10 items-center justify-center hover:bg-os-cream"
            aria-label="-"
          >
            −
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            disabled={!available}
            className="flex h-12 w-10 items-center justify-center hover:bg-os-cream disabled:opacity-40"
            aria-label="+"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!available}
          className={`btn-press flex-1 py-3 text-sm font-semibold uppercase tracking-widest transition disabled:opacity-40 ${
            added ? "bg-green-700 text-white" : "bg-os-black text-white hover:bg-os-black2"
          }`}
        >
          {added ? t("added") : available ? t("addToCart") : t("soldOut")}
        </button>
      </div>

      {/* Barre d'achat collante mobile (F04) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-os-gray bg-os-white p-3 lg:hidden">
        <span className="text-sm font-semibold">{formatPriceFcfa(price)}</span>
        <button
          onClick={handleAddToCart}
          disabled={!available}
          className={`btn-press flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition disabled:opacity-40 ${
            added ? "bg-green-700 text-white" : "bg-os-black text-white hover:bg-os-black2"
          }`}
        >
          {added ? t("added") : available ? t("addToCart") : t("soldOut")}
        </button>
      </div>
    </div>
  );
}
