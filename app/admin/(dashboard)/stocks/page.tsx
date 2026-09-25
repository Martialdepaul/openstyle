import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import ProductLink from "@/components/admin/ProductLink";
import Pagination from "@/components/admin/Pagination";
import StockEditableCell from "@/components/admin/StockEditableCell";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 25;

export default async function AdminStocksPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string; page?: string }>;
}) {
  await requireRole("OWNER", "MANAGER");
  const { filtre, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.VariantWhereInput = { isActive: true };
  if (filtre === "epuise") where.stock = 0;
  // "stock bas" : sous le seuil, non nul (RG-24). Comparaison faite en mémoire
  // ci-dessous car le seuil varie par variante (pas de champ constant à comparer côté SQL).

  const allMatching = await prisma.variant.findMany({
    where,
    include: { product: { select: { id: true, nameFr: true, reference: true } } },
    orderBy: { product: { nameFr: "asc" } },
  });

  const filtered = filtre === "bas" ? allMatching.filter((v) => v.stock > 0 && v.stock <= v.lowStockThreshold) : allMatching;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const variants = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (filtre) params.set("filtre", filtre);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return `/admin/stocks${qs ? `?${qs}` : ""}`;
  };

  const filters = [
    { key: undefined, label: "Tout" },
    { key: "bas", label: "Stock bas" },
    { key: "epuise", label: "Épuisé" },
  ];

  return (
    <div>
      <PageHeader title="Stocks" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Stocks" }]} />

      <div className="mb-4 flex gap-2">
        {filters.map((f) => (
          <a
            key={f.label}
            href={f.key ? `/admin/stocks?filtre=${f.key}` : "/admin/stocks"}
            className={`border px-3 py-1.5 text-xs uppercase tracking-wide transition ${
              filtre === f.key ? "border-os-black bg-os-black text-white" : "border-os-gray hover:border-os-black"
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="hidden overflow-x-auto border border-os-gray bg-white lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-os-gray">
              {["Produit", "Référence", "Taille", "Couleur", "Stock", "Seuil", "État"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-os-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.id} className="border-b border-os-cream last:border-0 hover:bg-os-cream">
                <td className="px-4 py-3">
                  <ProductLink id={variant.product.id} name={variant.product.nameFr} />
                </td>
                <td className="px-4 py-3 font-mono text-xs">{variant.product.reference}</td>
                <td className="px-4 py-3">{variant.size ?? "—"}</td>
                <td className="px-4 py-3">{variant.color ?? "—"}</td>
                <td className="px-4 py-3">
                  <StockEditableCell variantId={variant.id} initialStock={variant.stock} />
                </td>
                <td className="px-4 py-3 text-os-muted">{variant.lowStockThreshold}</td>
                <td className="px-4 py-3">
                  {variant.stock === 0 ? (
                    <span className="rounded-full bg-os-black px-2.5 py-0.5 text-xs text-white">Épuisé</span>
                  ) : variant.stock <= variant.lowStockThreshold ? (
                    <span className="rounded-full bg-os-gray px-2.5 py-0.5 text-xs">Stock bas</span>
                  ) : (
                    <span className="text-xs text-os-muted">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 lg:hidden">
        {variants.map((variant) => (
          <div key={variant.id} className="border border-os-gray bg-white p-4">
            <ProductLink id={variant.product.id} name={variant.product.nameFr} />
            <p className="mt-0.5 text-xs text-os-muted">
              {variant.product.reference} · {[variant.size, variant.color].filter(Boolean).join(" · ") || "—"}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <StockEditableCell variantId={variant.id} initialStock={variant.stock} />
              {variant.stock === 0 ? (
                <span className="rounded-full bg-os-black px-2.5 py-0.5 text-xs text-white">Épuisé</span>
              ) : variant.stock <= variant.lowStockThreshold ? (
                <span className="rounded-full bg-os-gray px-2.5 py-0.5 text-xs">Stock bas</span>
              ) : (
                <span className="text-xs text-os-muted">OK</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {variants.length === 0 && <p className="py-10 text-center text-sm text-os-muted">Aucune variante.</p>}

      <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
