"use client";

/** F18 : déclenche l'impression navigateur (ou "Enregistrer en PDF") de la page courante. */
export default function PrintReceiptButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-press mb-6 w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2 print:hidden"
    >
      Imprimer
    </button>
  );
}
