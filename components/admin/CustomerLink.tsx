import Link from "next/link";

/** Section 3 : toute mention d'un client dans l'admin passe par ce lien. */
export default function CustomerLink({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/admin/clients/${id}`} className="hover:underline">
      {name}
    </Link>
  );
}
