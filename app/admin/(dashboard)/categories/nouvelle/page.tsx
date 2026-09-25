import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { createCategory } from "@/lib/actions/category";
import PageHeader from "@/components/admin/PageHeader";

export default async function NewCategoryPage() {
  await requireRole("OWNER", "MANAGER");
  const parents = await prisma.category.findMany({ where: { parentId: null }, orderBy: { position: "asc" } });

  return (
    <div>
      <PageHeader
        title="Nouvelle catégorie"
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Catégories", href: "/admin/categories" },
          { label: "Nouvelle" },
        ]}
      />

      <form action={createCategory} className="flex max-w-lg flex-col gap-4 border border-os-gray bg-white p-6">
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

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Catégorie parente (facultatif)</label>
          <select name="parentId" defaultValue="" className="w-full border border-os-gray px-3 py-2 text-sm">
            <option value="">— Aucune (niveau 1) —</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameFr}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-os-muted">Deux niveaux maximum : une sous-catégorie ne peut pas avoir de parent.</p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Image (URL, facultatif)</label>
          <input name="imageUrl" className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none" />
        </div>

        <button
          type="submit"
          className="btn-press mt-2 w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
        >
          Créer la catégorie
        </button>
      </form>
    </div>
  );
}
