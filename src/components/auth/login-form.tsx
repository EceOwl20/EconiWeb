"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useSitePreferences } from "@/components/use-site-preferences";
import { loginFormCopy } from "@/lib/site-copy";

type LoginFormProps = {
  nextPath: string;
};

type Status = { type: "idle" } | { type: "loading" } | { type: "error"; message: string };

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const { language } = useSitePreferences();
  const copy = loginFormCopy(language);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [credentials, setCredentials] = useState<{ identifier: string; password: string }>({
    identifier: "",
    password: "",
  });

  const actionLabel = useMemo(
    () => (status.type === "loading" ? copy.submitting : copy.submit),
    [copy.submit, copy.submitting, status.type],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ type: "loading" });

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: data.get("identifier") ?? credentials.identifier,
        password: data.get("password") ?? credentials.password,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setStatus({ type: "error", message: payload?.message ?? copy.fallbackError });
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden min-h-[28rem] overflow-hidden border-r border-[var(--line)] bg-[linear-gradient(135deg,#ffffff_0%,#f8fbf7_100%)] p-8 lg:block">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--brand-accent-strong)]">Econi Invest</p>
              <h2 className="mt-10 max-w-xs text-4xl font-bold leading-tight text-[var(--brand-primary)]">
                Geleceğinize güvenle yatırım yapın.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--ink-600)]">
                Portföy, danışman ve müşteri akışını tek bir güvenli panelden yönetin.
              </p>
            </div>

            <div className="grid gap-3">
              {["Güvenli oturum", "Rol bazlı yetki", "Portföy onay akışı"].map((item) => (
                <div key={item} className="rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--brand-primary)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)]">{copy.title}</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--ink-600)]">
            {copy.body}
          </p>

        <div className="mt-6 space-y-3">
          <input
            required
            type="email"
            name="identifier"
            value={credentials.identifier}
            onChange={(event) =>
              setCredentials((previous) => ({
                ...previous,
                identifier: event.target.value,
              }))
            }
            placeholder={copy.email}
            className="w-full rounded-lg border border-[var(--line-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[rgba(102,165,87,0.12)]"
          />
          <input
            required
            type="password"
            name="password"
            value={credentials.password}
            onChange={(event) =>
              setCredentials((previous) => ({
                ...previous,
                password: event.target.value,
              }))
            }
            placeholder={copy.password}
            className="w-full rounded-lg border border-[var(--line-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[rgba(102,165,87,0.12)]"
          />
        </div>

        <button
          type="submit"
          disabled={status.type === "loading"}
          className="mt-5 min-h-12 w-full cursor-pointer rounded-lg bg-[var(--brand-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-accent-strong)] disabled:cursor-not-allowed disabled:bg-[var(--ink-400)]"
        >
          {actionLabel}
        </button>

        {status.type === "error" ? <p className="mt-3 text-sm text-rose-700">{status.message}</p> : null}
      </form>
      </div>
    </div>
  );
}
