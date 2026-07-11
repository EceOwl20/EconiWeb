import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function AuthorizedLoginPage({ searchParams }: LoginPageProps) {
  const [params, currentUser] = await Promise.all([searchParams, getCurrentUser()]);

  const candidate = firstValue(params.next);
  const nextPath = candidate.startsWith("/") ? candidate : "/yonetim-ofisi";

  if (currentUser) {
    redirect(nextPath);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-6xl justify-center px-4 pb-16 pt-10 sm:px-6 lg:pt-16">
        <LoginForm nextPath={nextPath} />
      </main>
    </div>
  );
}
