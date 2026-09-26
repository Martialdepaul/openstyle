import Image from "next/image";
import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { formatPriceFcfa } from "@/lib/currency";
import PageHeader from "@/components/admin/PageHeader";
import ProductLink from "@/components/admin/ProductLink";
import ProductQuickActions from "@/components/admin/ProductQuickActions";
import Pagination from "@/components/admin/Pagination";
import type { Prisma, ProductStatus } from "@/generated/prisma/client";

const PAGE_SIZE = 25;

const STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string; statut?: string; page?: string }>;
}) {
  await requireRole("OWNER", "MANAGER");
  const { q, categorie, statut, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.ProductWhereInput = {};
  if (categorie) where.category = { slug: categorie };
  if (statut) where.status = statut as ProductStatus;
  if (q) {
    where.OR = [{ nameFr: { contains: q } }, { reference: { contains: q } }];
  }

  const [total, products, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: "asc" }, take: 1 }, variants: { select: { stock: true } }, category: true },
      orderBy: { nameFr: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categorie) params.set("categorie", categorie);
    if (statut) params.set("statut", statut);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/produits${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <PageHeader
        title="Produits"
        breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Produits" }]}
        actions={
          <div className="flex gap-2">
            <a href="/admin/produits/import" className="border border-os-black px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-os-black hover:text-white">
              Importer
            </a>
            <a href="/admin/produits/nouveau" className="bg-os-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
              + Produit
            </a>
          </div>
        }
      />

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Nom ou référence..."
          className="border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none"
        />
        <select name="categorie" defaultValue={categorie ?? ""} className="border border-os-gray px-3 py-2 text-sm">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nameFr}
            </option>
          ))}
        </select>
        <select name="statut" defaultValue={statut ?? ""} className="border border-os-gray px-3 py-2 text-sm">
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button type="submit" className="border border-os-black px-4 py-2 text-xs uppercase tracking-wide hover:bg-os-black hover:text-white">
          Filtrer
        </button>
      </form>

      <div className="hidden overflow-x-auto border border-os-gray bg-white lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-os-gray">
              {["Produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-os-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockTotal = product.variants.reduce((sum, v) => sum + v.stock, 0);
              const image = product.images[0];
              return (
                <tr key={product.id} className="border-b border-os-cream last:border-0 hover:bg-os-cream">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {image && (
                        <div className="relative h-12 w-10 flex-shrink-0 bg-os-cream">
                          <Image src={image.urlThumb} alt={product.nameFr} fill className="object-cover" sizes="40px" />
                        </div>
                      )}
                      <div>
                        <ProductLink id={product.id} name={product.nameFr} />
                        <p className="text-[10px] text-os-muted">{product.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-os-muted">{product.category.nameFr}</td>
                  <td className="px-4 py-3 text-xs font-semibold">{formatPriceFcfa(product.pricePromo ?? product.priceRetail)}</td>
                  <td className="px-4 py-3 text-xs">{stockTotal}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-os-gray px-2.5 py-0.5 text-xs">{STATUS_LABELS[product.status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ProductQuickActions productId={product.id} status={product.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {products.map((product) => {
          const stockTotal = product.variants.reduce((sum, v) => sum + v.stock, 0);
          return (
            <div key={product.id} className="border border-os-gray bg-white p-4">
              <ProductLink id={product.id} name={product.nameFr} />
              <p className="mt-0.5 text-xs text-os-muted">
                {product.reference} · {product.category.nameFr}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{formatPriceFcfa(product.pricePromo ?? product.priceRetail)}</span>
                <span className="text-xs text-os-muted">Stock : {stockTotal}</span>
                <span className="rounded-full bg-os-gray px-2.5 py-0.5 text-xs">{STATUS_LABELS[product.status]}</span>
              </div>
              <div className="mt-3">
                <ProductQuickActions productId={product.id} status={product.status} />
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucun produit.</p>}

      <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
