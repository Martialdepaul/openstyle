import Link from "next/link";

/** Section 3 : toute mention d'une commande dans l'admin passe par ce lien. */
export default function OrderLink({ id, number }: { id: string; number: string }) {
  return (
    <Link href={`/admin/commandes/${id}`} className="font-mono text-xs underline-offset-2 hover:underline">
      {number}
    </Link>
  );
}
