import { requireRole } from "@/lib/admin-auth";
import PageHeader from "@/components/admin/PageHeader";
import ProductImportWizard from "@/components/admin/ProductImportWizard";

export default async function AdminProductImportPage() {
  await requireRole("OWNER", "MANAGER");

  return (
    <div>
      <PageHeader
        title="Importer des produits"
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Produits", href: "/admin/produits" },
          { label: "Importer" },
        ]}
      />
      <ProductImportWizard />
    </div>
  );
}
