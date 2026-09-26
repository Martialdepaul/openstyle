"use client";

import { useState } from "react";
import { updatePage } from "@/lib/actions/page";

type PageData = { titleFr: string; titleEn: string; bodyFr: string; bodyEn: string };

export default function PageContentForm({ slug, label, initial }: { slug: string; label: string; initial: PageData }) {
  const [bodyFr, setBodyFr] = useState(initial.bodyFr);
  const [bodyEn, setBodyEn] = useState(initial.bodyEn);
  const [preview, setPreview] = useState(false);
  const updateWithSlug = updatePage.bind(null, slug);

  return (
    <details className="border border-os-gray bg-white p-6">
      <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold uppercase tracking-widest">
        {label}
        <a
          href={`/fr/${slug}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-normal normal-case underline"
        >
          Voir sur le site
        </a>
      </summary>
      <form action={updateWithSlug} className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Titre (FR)</label>
            <input name="titleFr" defaultValue={initial.titleFr} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Titre (EN, facultatif)</label>
            <input name="titleEn" defaultValue={initial.titleEn} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-os-muted">
            Contenu — balises autorisées : h2, h3, p, ul, ol, li, strong, em, a, br
          </p>
          <button type="button" onClick={() => setPreview((p) => !p)} className="text-xs underline">
            {preview ? "Éditer" : "Aperçu"}
          </button>
        </div>

        {preview ? (
          <div className="border border-os-gray p-4 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-os-muted">Aperçu (FR)</p>
            <div dangerouslySetInnerHTML={{ __html: bodyFr }} />
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Contenu (FR)</label>
            <textarea
              name="bodyFr"
              value={bodyFr}
              onChange={(e) => setBodyFr(e.target.value)}
              rows={8}
              required
              className="w-full border border-os-gray px-3 py-2 font-mono text-xs focus:border-os-black focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Contenu (EN, facultatif)</label>
          <textarea
            name="bodyEn"
            value={bodyEn}
            onChange={(e) => setBodyEn(e.target.value)}
            rows={8}
            className="w-full border border-os-gray px-3 py-2 font-mono text-xs focus:border-os-black focus:outline-none"
          />
        </div>

        <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
          Enregistrer
        </button>
      </form>
    </details>
  );
}
