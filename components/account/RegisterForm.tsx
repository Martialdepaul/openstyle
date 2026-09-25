"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { registerCustomer, type AuthFormState } from "@/lib/actions/customer-auth";

const initialState: AuthFormState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-press mt-1 bg-os-black py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

export default function RegisterForm() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, formAction] = useActionState(registerCustomer, initialState);
  const [isPro, setIsPro] = useState(false);

  return (
    <>
      <h1 className="mb-1 font-serif text-3xl font-bold">{t("registerTitle")}</h1>
      <p className="mb-8 text-sm text-os-muted">{t("registerSubtitle")}</p>
      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("firstName")}</label>
            <input name="firstName" required className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("lastName")}</label>
            <input name="lastName" required className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("email")}</label>
          <input name="email" type="email" required className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("phone")}</label>
          <input name="phone" placeholder="6XXXXXXXX" className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
        </div>
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

        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={isPro} onChange={(e) => setIsPro(e.target.checked)} className="mt-0.5 accent-os-black" />
          <span>{t("isProLabel")}</span>
        </label>

        {isPro && (
          <div className="grid gap-4 border-t border-os-cream pt-4">
            <input type="hidden" name="isPro" value="on" />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("shopName")}</label>
              <input name="shopName" required={isPro} className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("proCity")}</label>
              <input name="proCity" required={isPro} className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("proPhone")}</label>
              <input name="proPhone" required={isPro} placeholder="6XXXXXXXX" className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
            </div>
          </div>
        )}

        {state.error && <p className="text-sm font-medium text-red-700">{state.error}</p>}
        <SubmitButton label={t("registerSubmit")} />
      </form>
      <p className="mt-6 text-center text-sm text-os-muted">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/connexion" className="font-semibold text-os-black underline">
          {t("loginLink")}
        </Link>
      </p>
    </>
  );
}
