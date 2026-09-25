"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { resetPassword, type ResetPasswordState } from "@/lib/actions/password-reset";

const initialState: ResetPasswordState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-press bg-os-black py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

export default function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, formAction] = useActionState(resetPassword, initialState);

  return (
    <>
      <h1 className="mb-1 font-serif text-3xl font-bold">{t("resetTitle")}</h1>
      <p className="mb-8 text-sm text-os-muted">{t("resetSubtitle")}</p>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="locale" value={locale} />
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("password")}</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
          <p className="mt-1 text-xs text-os-muted">{t("passwordHint")}</p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("passwordConfirm")}</label>
          <input
            name="passwordConfirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        {state.error && <p className="text-sm font-medium text-red-700">{state.error}</p>}
        <SubmitButton label={t("resetSubmit")} />
      </form>
    </>
  );
}
