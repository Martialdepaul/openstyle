import { Link } from "@/i18n/navigation";
import LogoutButton from "./LogoutButton";

export type AccountTab = "dashboard" | "commandes" | "profil" | "pro";

export default function AccountShell({
  active,
  labels,
  children,
}: {
  active: AccountTab;
  labels: { dashboard: string; orders: string; profile: string; pro: string; logout: string; title: string };
  children: React.ReactNode;
}) {
  const tabs: { id: AccountTab; label: string }[] = [
    { id: "dashboard", label: labels.dashboard },
    { id: "commandes", label: labels.orders },
    { id: "profil", label: labels.profile },
    { id: "pro", label: labels.pro },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">{labels.title}</h1>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex flex-row gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={{ pathname: "/compte", query: tab.id === "dashboard" ? undefined : { onglet: tab.id } }}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-left text-sm transition lg:border-b-0 lg:border-l-2 ${
                  active === tab.id ? "border-os-black font-semibold" : "border-transparent text-os-muted hover:text-os-black"
                }`}
              >
                {tab.label}
              </Link>
            ))}
            <div className="lg:mt-8">
              <LogoutButton label={labels.logout} />
            </div>
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
