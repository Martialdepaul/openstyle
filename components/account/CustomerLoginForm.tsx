"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { loginCustomer, type AuthFormState } from "@/lib/actions/customer-auth";

const initialState: AuthFormState = { error: null };

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

export default function CustomerLoginForm() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, formAction] = useActionState(loginCustomer, initialState);

  return (
    <>
      <h1 className="mb-1 font-serif text-3xl font-bold">{t("loginTitle")}</h1>
      <p className="mb-8 text-sm text-os-muted">{t("loginSubtitle")}</p>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("email")}</label>
          <input name="email" type="email" required autoComplete="username" className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("password")}</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
          />
        </div>
        <Link href="/mot-de-passe-oublie" className="text-right text-xs text-os-muted hover:text-os-black">
          {t("forgotPasswordLink")}
        </Link>
        {state.error && <p className="text-sm font-medium text-red-700">{state.error}</p>}
        <SubmitButton label={t("loginSubmit")} />
      </form>
      <p className="mt-6 text-center text-sm text-os-muted">
        {t("noAccountYet")}{" "}
        <Link href="/inscription" className="font-semibold text-os-black underline">
          {t("createAccountLink")}
        </Link>
      </p>
    </>
  );
}
