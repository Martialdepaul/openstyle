"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { updateCustomerProfile, type ProfileFormState } from "@/lib/actions/customer-account";

const initialState: ProfileFormState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-press w-fit bg-os-black px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

export default function ProfileForm({
  user,
}: {
  user: { firstName: string; lastName: string; email: string; phone: string | null };
}) {
  const t = useTranslations("Account");
  const [state, formAction] = useActionState(updateCustomerProfile, initialState);

  return (
    <div className="max-w-md">
      <h2 className="mb-5 font-serif text-xl font-bold">{t("profileTitle")}</h2>
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("firstName")}</label>
          <input
            name="firstName"
            defaultValue={user.firstName}
            required
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("lastName")}</label>
          <input
            name="lastName"
            defaultValue={user.lastName}
            required
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("email")}</label>
          <input
            defaultValue={user.email}
            disabled
            className="w-full border border-os-gray bg-os-cream px-4 py-3 text-sm text-os-muted"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("phone")}</label>
          <input
            name="phone"
            defaultValue={user.phone ?? ""}
            placeholder="6XXXXXXXX"
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        {state.error && <p className="text-sm font-medium text-red-700">{state.error}</p>}
        {state.saved && !state.error && <p className="text-sm font-medium text-green-700">{t("profileSaved")}</p>}
        <SubmitButton label={t("profileSave")} />
      </form>
    </div>
  );
}
