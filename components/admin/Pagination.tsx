import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-xs">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className="border border-os-gray px-3 py-1.5 hover:border-os-black">
          Précédent
        </Link>
      ) : (
        <span className="border border-os-gray px-3 py-1.5 text-os-muted opacity-40">Précédent</span>
      )}
      <span className="text-os-muted">
        Page {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className="border border-os-gray px-3 py-1.5 hover:border-os-black">
          Suivant
        </Link>
      ) : (
        <span className="border border-os-gray px-3 py-1.5 text-os-muted opacity-40">Suivant</span>
      )}
    </div>
  );
}
