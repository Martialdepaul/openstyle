"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { requestProUpgrade, type ProRequestState } from "@/lib/actions/customer-account";

const initialState: ProRequestState = { error: null };

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

export default function ProRequestForm() {
  const t = useTranslations("Account");
  const [state, formAction] = useActionState(requestProUpgrade, initialState);

  return (
    <div>
      <div className="mb-6 border border-os-gray p-6">
        <h3 className="font-semibold">{t("proNoneTitle")}</h3>
        <p className="mt-1 text-sm text-os-muted">{t("proNoneBody")}</p>
      </div>
      <form action={formAction} className="flex max-w-md flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("shopName")}</label>
          <input name="shopName" required className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("proCity")}</label>
          <input name="proCity" required className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("proPhone")}</label>
          <input name="proPhone" required placeholder="6XXXXXXXX" className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
        </div>
        {state.error && <p className="text-sm font-medium text-red-700">{state.error}</p>}
        <SubmitButton label={t("proSubmit")} />
      </form>
    </div>
  );
}
