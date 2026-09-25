import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminTranslations } from "@/lib/admin-i18n";
import { prisma } from "@/lib/db";
import { updateAdminAccount } from "@/lib/actions/account";

export default async function AdminAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await requireAdminSession();
  const { saved } = await searchParams;
  const t = getAdminTranslations("Account");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  return (
    <div className="max-w-md">
      <h1 className="mb-6 font-serif text-2xl font-bold">{t("title")}</h1>
      {saved && <p className="mb-4 text-sm text-green-700">{t("saved")}</p>}
      <form action={updateAdminAccount} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("firstName")}</label>
          <input
            name="firstName"
            defaultValue={user.firstName}
            required
            className="w-full border border-os-gray bg-white px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("lastName")}</label>
          <input
            name="lastName"
            defaultValue={user.lastName}
            required
            className="w-full border border-os-gray bg-white px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("newPassword")}</label>
          <input
            name="newPassword"
            type="password"
            minLength={8}
            className="w-full border border-os-gray bg-white px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="btn-press mt-2 w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}
