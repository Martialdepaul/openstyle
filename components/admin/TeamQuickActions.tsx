"use client";

import { useState, useTransition } from "react";
import { changeAdminRole, sendAdminResetLink, toggleAdminActive } from "@/lib/actions/team";
import type { Role } from "@/generated/prisma/client";

export default function TeamQuickActions({
  userId,
  role,
  isActive,
  isSelf,
}: {
  userId: string;
  role: Role;
  isActive: boolean;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleRoleChange(formData: FormData) {
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      const result = await changeAdminRole(userId, formData);
      if (result.error) setError(result.error);
    });
  }

  function handleToggleActive() {
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      const result = await toggleAdminActive(userId);
      if (result.error) setError(result.error);
    });
  }

  function handleSendReset() {
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      const result = await sendAdminResetLink(userId);
      if (result.error) setError(result.error);
      else setFeedback("Lien journalisé côté serveur (e-mail non envoyé, Resend non branché).");
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <form action={handleRoleChange} className="flex items-center gap-2">
        <select
          name="role"
          defaultValue={role}
          disabled={isPending}
          className="border border-os-gray px-2 py-1.5 text-xs focus:border-os-black focus:outline-none"
        >
          <option value="OWNER">OWNER</option>
          <option value="MANAGER">MANAGER</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="border border-os-black px-3 py-1.5 text-xs uppercase tracking-wide transition hover:bg-os-black hover:text-white disabled:opacity-50"
        >
          Changer
        </button>
      </form>
      <div className="flex flex-wrap gap-3 text-xs">
        <button
          disabled={isPending || isSelf}
          onClick={handleToggleActive}
          className="text-os-muted transition hover:text-red-700 disabled:opacity-30"
        >
          {isActive ? "Désactiver" : "Activer"}
        </button>
        <button disabled={isPending} onClick={handleSendReset} className="text-os-muted transition hover:text-os-black disabled:opacity-50">
          Envoyer un lien de réinitialisation
        </button>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
      {feedback && <p className="text-xs text-os-muted">{feedback}</p>}
    </div>
  );
}
