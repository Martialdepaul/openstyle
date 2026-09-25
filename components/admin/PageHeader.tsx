import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

/** Section 3 : fil d'Ariane et actions, communs à tous les écrans admin. */
export default function PageHeader({
  title,
  breadcrumbs,
  actions,
}: {
  title: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 flex flex-wrap gap-2 text-xs text-os-muted">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-os-black">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-os-black">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold">{title}</h1>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
