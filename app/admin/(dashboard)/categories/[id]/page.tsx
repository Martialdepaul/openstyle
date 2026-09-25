import { notFound } from "next/navigation";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { updateCategory } from "@/lib/actions/category";
import PageHeader from "@/components/admin/PageHeader";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("OWNER", "MANAGER");
  const { id } = await params;

  const [category, parents] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({ where: { parentId: null }, orderBy: { position: "asc" } }),
  ]);
  if (!category) notFound();

  const updateWithId = updateCategory.bind(null, category.id);

  return (
    <div>
      <PageHeader
        title={category.nameFr}
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Catégories", href: "/admin/categories" },
          { label: category.nameFr },
        ]}
        actions={
          <a
            href={`/fr/boutique/${category.slug}`}
            target="_blank"
            rel="noreferrer"
            className="border border-os-gray px-4 py-2 text-xs uppercase tracking-wide hover:border-os-black"
          >
            Voir sur le site
          </a>
        }
      />

      <form action={updateWithId} className="flex max-w-lg flex-col gap-4 border border-os-gray bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (FR)</label>
            <input
              name="nameFr"
              defaultValue={category.nameFr}
              required
              className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (EN, facultatif)</label>
            <input
              name="nameEn"
              defaultValue={category.nameEn ?? ""}
              className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Catégorie parente (facultatif)</label>
          <select name="parentId" defaultValue={category.parentId ?? ""} className="w-full border border-os-gray px-3 py-2 text-sm">
            <option value="">— Aucune (niveau 1) —</option>
            {parents
              .filter((p) => p.id !== category.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameFr}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Image (URL, facultatif)</label>
          <input
            name="imageUrl"
            defaultValue={category.imageUrl ?? ""}
            className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="btn-press mt-2 w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
