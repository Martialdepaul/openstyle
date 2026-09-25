import { notFound } from "next/navigation";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { updateProductInfo } from "@/lib/actions/product-detail";
import PageHeader from "@/components/admin/PageHeader";
import ProductQuickActions from "@/components/admin/ProductQuickActions";
import StockEditableCell from "@/components/admin/StockEditableCell";

/**
 * Fiche produit minimale (Infos + Variantes et stock). Les onglets Photos,
 * Commandes et Mouvements de F14 restent à construire — voir docs/decisions.md.
 */
export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("OWNER", "MANAGER");
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variants: { orderBy: [{ size: "asc" }, { color: "asc" }] }, images: true },
  });
  if (!product) notFound();

  const updateWithId = updateProductInfo.bind(null, product.id);

  return (
    <div>
      <PageHeader
        title={product.nameFr}
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Produits", href: "/admin/produits" },
          { label: product.nameFr },
        ]}
        actions={
          <>
            <a
              href={`/fr/produit/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              className="border border-os-gray px-4 py-2 text-xs uppercase tracking-wide hover:border-os-black"
            >
              Voir sur le site
            </a>
            <ProductQuickActions productId={product.id} status={product.status} />
          </>
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Infos</h2>
          <form action={updateWithId} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (FR)</label>
              <input
                name="nameFr"
                defaultValue={product.nameFr}
                required
                className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Nom (EN, facultatif)</label>
              <input
                name="nameEn"
                defaultValue={product.nameEn ?? ""}
                className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Description (FR)</label>
              <textarea
                name="descriptionFr"
                defaultValue={product.descriptionFr}
                rows={4}
                maxLength={2000}
                className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Description (EN, facultatif)</label>
              <textarea
                name="descriptionEn"
                defaultValue={product.descriptionEn ?? ""}
                rows={4}
                maxLength={2000}
                className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Prix de détail</label>
                <input
                  name="priceRetail"
                  type="number"
                  min={1}
                  defaultValue={product.priceRetail}
                  required
                  className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">Prix promo (facultatif)</label>
                <input
                  name="pricePromo"
                  type="number"
                  min={1}
                  defaultValue={product.pricePromo ?? ""}
                  className="w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-press mt-2 w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
            >
              Enregistrer
            </button>
          </form>
        </section>

        <section className="border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Variantes et stock</h2>
          <div className="flex flex-col gap-3">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between border-b border-os-cream pb-3 last:border-0">
                <div className="text-sm">
                  <p className="font-mono text-xs text-os-muted">{variant.sku}</p>
                  <p>{[variant.size, variant.color, variant.scent].filter(Boolean).join(" · ") || "Par défaut"}</p>
                </div>
                <StockEditableCell variantId={variant.id} initialStock={variant.stock} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
