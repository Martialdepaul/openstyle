"use client";

import { useState } from "react";
import { previewImport, processImportBatch, type ImportPreview } from "@/lib/actions/product-import";

/** Base64 par blocs : évite un dépassement de pile sur un gros fichier avec String.fromCharCode(...bytes). */
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * F15 : import CSV ou XLSX en deux temps — aperçu (rien n'est écrit) puis
 * confirmation, traitée par lots de 200 produits avec barre de progression
 * (chaque lot est un appel serveur séparé, pour rester sous le délai de la
 * fonction serveur même sur un fichier de plusieurs centaines de lignes).
 */
export default function ProductImportWizard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ processed: number; total: number } | null>(null);
  const [done, setDone] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(null);
    setProgress(null);
    setDone(false);
    setIsAnalyzing(true);

    const isXlsx = /\.xlsx$/i.test(file.name);
    const result = isXlsx
      ? await previewImport({ kind: "xlsx", base64: await fileToBase64(file) })
      : await previewImport({ kind: "csv", text: await file.text() });
    setIsAnalyzing(false);

    if (result.error) setError(result.error);
    else setPreview(result);
  }

  async function handleConfirm() {
    if (!preview) return;
    setError(null);
    setProgress({ processed: 0, total: preview.groups.length });

    let offset = 0;
    while (offset < preview.groups.length) {
      const result = await processImportBatch(preview.groups, offset);
      if (result.error) {
        setError(`${result.error} (${result.processed} produit(s) importé(s) avant l'erreur)`);
        setProgress({ processed: result.processed, total: result.total });
        return;
      }
      setProgress({ processed: result.processed, total: result.total });
      offset = result.processed;
      if (result.done) break;
    }
    setDone(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="max-w-xl border border-os-gray bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">1. Choisir un fichier</h2>
        <p className="mb-3 text-xs text-os-muted">
          Fichier CSV ou XLSX (Excel).{" "}
          <a href="/modele-import-produits.csv" download className="underline">
            Télécharger le modèle
          </a>
          .
        </p>
        <input
          type="file"
          accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileChange}
          disabled={isAnalyzing}
          className="text-sm"
        />
        {isAnalyzing && <p className="mt-2 text-xs text-os-muted">Analyse en cours…</p>}
      </section>

      {error && (
        <section className="max-w-xl border border-red-700 bg-white p-6">
          <p className="text-sm text-red-700">{error}</p>
        </section>
      )}

      {preview && !error && (
        <section className="max-w-xl border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">2. Aperçu</h2>
          <ul className="flex flex-col gap-1 text-sm">
            <li>{preview.totalRows} ligne(s) lue(s)</li>
            <li>{preview.toCreate} produit(s) à créer</li>
            <li>{preview.toUpdate} produit(s) à mettre à jour</li>
            <li className={preview.errors.length > 0 ? "text-red-700" : ""}>{preview.errors.length} ligne(s) en erreur</li>
          </ul>

          {preview.errors.length > 0 && (
            <div className="mt-4 max-h-48 overflow-y-auto border-t border-os-gray pt-3">
              {preview.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-700">
                  Ligne {err.row}
                  {err.reference ? ` (${err.reference})` : ""} : {err.reason}
                </p>
              ))}
            </div>
          )}

          {preview.groups.length > 0 && !progress && (
            <button
              onClick={handleConfirm}
              className="btn-press mt-4 w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
            >
              Confirmer l'import ({preview.groups.length} produit{preview.groups.length > 1 ? "s" : ""})
            </button>
          )}

          {progress && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-os-gray">
                <div
                  className="h-full bg-os-black transition-all"
                  style={{ width: `${Math.round((progress.processed / progress.total) * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-os-muted">
                {progress.processed} / {progress.total}
              </p>
            </div>
          )}

          {done && (
            <p className="mt-4 text-sm font-semibold">
              Import terminé.{" "}
              <a href="/admin/produits" className="underline">
                Voir les produits
              </a>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
