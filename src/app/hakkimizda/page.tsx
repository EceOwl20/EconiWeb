import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dashboardSummary } from "@/lib/data-store";
import { aboutPageCopy } from "@/lib/site-copy";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";

export const metadata: Metadata = {
  title: "Hakkımızda | Econi Invest",
  description: "Econi Invest'in veri, danışmanlık ve şeffaf süreç yönetimine dayalı gayrimenkul yatırım yaklaşımı.",
};

export default async function HakkimizdaPage() {
  const language = await getServerSiteLanguage();
  const copy = aboutPageCopy(language);
  const summary = dashboardSummary();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="w-full pb-24">
        <section className="frame-wide fade-up rounded-lg border border-[var(--line)] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">{copy.heroKicker}</p>
          <h1 className="mt-3 text-[2.4rem] leading-[1.02] font-bold text-[var(--brand-primary)] sm:text-[3.8rem]">{copy.heroTitle}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-600)] sm:text-base">
            {copy.heroBody}
          </p>
        </section>

        <section className="frame mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: copy.metrics.activeListings, value: String(summary.propertyCount) },
            { label: copy.metrics.advisors, value: String(summary.advisorCount) },
            { label: copy.metrics.cities, value: String(summary.cityCount) },
            { label: copy.metrics.leads, value: String(summary.leadCount) },
          ].map((item) => (
            <article key={item.label} className="luxury-card p-5 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-strong)]">{item.label}</p>
              <p className="mt-2 text-[2rem] font-semibold text-[var(--brand-primary)]">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="frame mt-8 grid gap-4 xl:grid-cols-2">
          <article className="luxury-card p-6 sm:p-7">
            <span className="section-kicker">{copy.visionKicker}</span>
            <h2 className="mt-3 text-[2rem] leading-none font-semibold text-[var(--brand-primary)]">{copy.visionTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-600)]">
              {copy.visionBody}
            </p>
          </article>

          <article className="luxury-card p-6 sm:p-7">
            <span className="section-kicker">{copy.approachKicker}</span>
            <h2 className="mt-3 text-[2rem] leading-none font-semibold text-[var(--brand-primary)]">{copy.approachTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-600)]">
              {copy.approachBody}
            </p>
          </article>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
