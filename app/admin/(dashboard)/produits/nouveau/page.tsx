import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { createProduct } from "@/lib/actions/product-create";
import PageHeader from "@/components/admin/PageHeader";
import ProductVariantRows from "@/components/admin/ProductVariantRows";

/**
 * F14 : création d'un produit. Les photos ne sont pas encore prises en
 * charge ici (pipeline de compression/WebP à construire séparément) : un
 * produit créé reste donc en brouillon tant qu'aucune photo n'est ajoutée
 * (RG « un produit sans photo ne peut pas être publié ») — voir decisions.md.
 */
export default async function NewProductPage() {
  await requireRole("OWNER", "MANAGER");
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { position: "asc" } });

  return (
    <div>
      <PageHeader
        title="Nouveau produit"
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Produits", href: "/admin/produits" },
          { label: "Nouveau" },
        ]}
      />

      <form action={createProduct} className="flex max-w-2xl flex-col gap-4 border border-os-gray bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (FR)</label>
            <input name="nameFr" required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (EN, facultatif)</label>
            <input name="nameEn" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Référence (facultatif)</label>
            <input
              name="reference"
              placeholder="Générée automatiquement si vide"
              className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Catégorie</label>
            <select name="categoryId" required className="w-full border border-os-gray px-3 py-2 text-sm">
              <option value="">— Choisir —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameFr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Marque (facultatif)</label>
          <input name="brand" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Description (FR)</label>
          <textarea name="descriptionFr" rows={3} maxLength={2000} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Description (EN, facultatif)</label>
          <textarea name="descriptionEn" rows={3} maxLength={2000} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Prix de détail</label>
            <input name="priceRetail" type="number" min={1} required className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Prix promo (facultatif)</label>
            <input name="pricePromo" type="number" min={1} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Prix semi-gros (facultatif)</label>
            <input name="priceSemi" type="number" min={1} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Prix gros (facultatif)</label>
            <input name="priceWholesale" type="number" min={1} className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isNew" className="accent-os-black" /> Nouveau
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPopular" className="accent-os-black" /> Populaire
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" className="accent-os-black" /> Mis en avant
          </label>
        </div>

        <div>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest">Variantes</h2>
          <p className="mb-3 text-xs text-os-muted">Laissez tout vide pour créer une variante par défaut (RG-22).</p>
          <ProductVariantRows />
        </div>

        <p className="text-xs text-os-muted">
          Le produit est créé en brouillon. Il faudra ajouter au moins une photo avant de pouvoir le publier.
        </p>

        <button
          type="submit"
          className="btn-press mt-2 w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
        >
          Créer le produit
        </button>
      </form>
    </div>
  );
}
