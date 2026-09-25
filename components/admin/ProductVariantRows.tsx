"use client";

import { useState } from "react";

type Row = { size: string; color: string; scent: string; stock: string };

const EMPTY_ROW: Row = { size: "", color: "", scent: "", stock: "0" };

export default function ProductVariantRows() {
  const [rows, setRows] = useState<Row[]>([{ ...EMPTY_ROW }]);

  function updateRow(index: number, field: keyof Row, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeRow(index: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_1fr_1fr_80px_28px] gap-2 text-[10px] font-semibold uppercase tracking-widest text-os-muted">
        <span>Taille</span>
        <span>Couleur</span>
        <span>Parfum</span>
        <span>Stock</span>
        <span />
      </div>
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_1fr_80px_28px] gap-2">
          <input
            name="variantSize"
            value={row.size}
            onChange={(e) => updateRow(index, "size", e.target.value)}
            className="border border-os-gray px-2 py-1.5 text-sm focus:border-os-black focus:outline-none"
          />
          <input
            name="variantColor"
            value={row.color}
            onChange={(e) => updateRow(index, "color", e.target.value)}
            className="border border-os-gray px-2 py-1.5 text-sm focus:border-os-black focus:outline-none"
          />
          <input
            name="variantScent"
            value={row.scent}
            onChange={(e) => updateRow(index, "scent", e.target.value)}
            className="border border-os-gray px-2 py-1.5 text-sm focus:border-os-black focus:outline-none"
          />
          <input
            name="variantStock"
            type="number"
            min={0}
            value={row.stock}
            onChange={(e) => updateRow(index, "stock", e.target.value)}
            className="border border-os-gray px-2 py-1.5 text-sm focus:border-os-black focus:outline-none"
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            aria-label="Retirer cette variante"
            className="text-sm text-os-muted hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="mt-1 w-fit border border-os-gray px-3 py-1.5 text-xs uppercase tracking-wide hover:border-os-black"
      >
        + Ajouter une variante
      </button>
    </div>
  );
}
