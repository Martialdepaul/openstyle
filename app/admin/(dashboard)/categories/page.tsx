import { Fragment } from "react";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import CategoryQuickActions from "@/components/admin/CategoryQuickActions";

export default async function AdminCategoriesPage() {
  await requireRole("OWNER", "MANAGER");

  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { position: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  const topLevel = categories.filter((c) => !c.parentId);
  const childrenOf = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  function Row({ category, indent }: { category: (typeof categories)[number]; indent: boolean }) {
    const siblings = categories.filter((c) => c.parentId === category.parentId).sort((a, b) => a.position - b.position);
    const index = siblings.findIndex((s) => s.id === category.id);

    return (
      <tr className="border-b border-os-cream last:border-0 hover:bg-os-cream">
        <td className={`px-4 py-3 ${indent ? "pl-10" : ""}`}>
          <a href={`/admin/categories/${category.id}`} className="hover:underline">
            {category.nameFr}
          </a>
          {!category.isActive && <span className="ml-2 rounded-full bg-os-gray px-2 py-0.5 text-[10px] uppercase">Désactivée</span>}
        </td>
        <td className="px-4 py-3 text-xs text-os-muted">{category.slug}</td>
        <td className="px-4 py-3 text-xs">
          <a href={`/admin/produits?categorie=${category.slug}`} className="hover:underline">
            {category._count.products}
          </a>
        </td>
        <td className="px-4 py-3">
          <CategoryQuickActions
            categoryId={category.id}
            isActive={category.isActive}
            canMoveUp={index > 0}
            canMoveDown={index < siblings.length - 1}
          />
        </td>
      </tr>
    );
  }

  return (
    <div>
      <PageHeader
        title="Catégories"
        breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Catégories" }]}
        actions={
          <a href="/admin/categories/nouvelle" className="bg-os-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            + Catégorie
          </a>
        }
      />

      <div className="overflow-x-auto border border-os-gray bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-os-gray">
              {["Nom", "Slug", "Produits", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-os-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topLevel.map((category) => (
              <Fragment key={category.id}>
                <Row category={category} indent={false} />
                {childrenOf(category.id).map((child) => (
                  <Row key={child.id} category={child} indent />
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucune catégorie.</p>}
    </div>
  );
}
