"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm({
  labels,
}: {
  labels: { email: string; password: string; submit: string; error: string };
}) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (!result || result.error) {
      setError(true);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{labels.email}</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest">{labels.password}</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border border-os-gray px-4 py-3 text-sm focus:border-os-black focus:outline-none"
        />
      </div>
      {error && <p className="text-xs text-red-700">{labels.error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-press bg-os-black py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-os-black2 disabled:opacity-50"
      >
        {labels.submit}
      </button>
    </form>
  );
}
