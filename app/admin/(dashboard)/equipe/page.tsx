import { requireRole } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import TeamQuickActions from "@/components/admin/TeamQuickActions";
import { createAdminAccount } from "@/lib/actions/team";

const inputClass = "w-full border border-os-gray px-3 py-2 text-sm focus:border-os-black focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-widest";

export default async function AdminTeamPage() {
  const session = await requireRole("OWNER");

  const members = await prisma.user.findMany({
    where: { role: { in: ["OWNER", "MANAGER"] } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <PageHeader title="Équipe" breadcrumbs={[{ label: "Accueil", href: "/admin" }, { label: "Équipe" }]} />

      <div className="flex flex-col gap-6">
        <section className="max-w-lg border border-os-gray bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">Nouveau compte</h2>
          <form action={createAdminAccount} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prénom</label>
                <input name="firstName" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nom</label>
                <input name="lastName" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input name="email" type="email" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Rôle</label>
              <select name="role" defaultValue="MANAGER" className={inputClass}>
                <option value="OWNER">OWNER — Gérante</option>
                <option value="MANAGER">MANAGER — Gestionnaire</option>
              </select>
            </div>
            <button type="submit" className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2">
              Créer
            </button>
            <p className="text-xs text-os-muted">
              Aucun mot de passe n'est communiqué ici : un lien pour en choisir un est journalisé côté serveur (e-mail non envoyé, Resend non branché).
            </p>
          </form>
        </section>

        <div className="overflow-x-auto border border-os-gray bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-os-gray">
                {["Nom", "E-mail", "Rôle", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-os-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-os-cream align-top last:border-0 hover:bg-os-cream">
                  <td className="px-4 py-3">
                    {member.firstName} {member.lastName}
                    {member.id === session.user.id && <span className="ml-2 text-xs text-os-muted">(vous)</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-os-muted">{member.email}</td>
                  <td className="px-4 py-3 text-xs">{member.role}</td>
                  <td className="px-4 py-3 text-xs">
                    {member.isActive ? "Actif" : <span className="text-red-700">Désactivé</span>}
                  </td>
                  <td className="px-4 py-3">
                    <TeamQuickActions
                      userId={member.id}
                      role={member.role}
                      isActive={member.isActive}
                      isSelf={member.id === session.user.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
