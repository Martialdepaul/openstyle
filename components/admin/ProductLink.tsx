import Link from "next/link";

/** Section 3 : toute mention d'un produit dans l'admin passe par ce lien. */
export default function ProductLink({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/admin/produits/${id}`} className="hover:underline">
      {name}
    </Link>
  );
}
