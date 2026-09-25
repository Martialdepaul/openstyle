"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { requestPasswordReset, type ResetRequestState } from "@/lib/actions/password-reset";

const initialState: ResetRequestState = { sent: false };

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

export default function ForgotPasswordForm() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <>
      <h1 className="mb-1 font-serif text-3xl font-bold">{t("forgotTitle")}</h1>
      <p className="mb-8 text-sm text-os-muted">{t("forgotSubtitle")}</p>

      {state.sent ? (
        <p className="border border-os-gray bg-os-cream p-4 text-sm">{t("forgotSent")}</p>
      ) : (
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="locale" value={locale} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{t("email")}</label>
            <input name="email" type="email" required className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none" />
          </div>
          <SubmitButton label={t("forgotSubmit")} />
        </form>
      )}

      <p className="mt-6 text-center text-sm text-os-muted">
        <Link href="/connexion" className="underline">
          {t("backToLogin")}
        </Link>
      </p>
    </>
  );
}
