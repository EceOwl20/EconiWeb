import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { servicesPageCopy } from "@/lib/site-copy";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";

export const metadata: Metadata = {
  title: "Hizmetler | Econi Invest",
  description: "Satın alma, satış, yatırım danışmanlığı ve portföy yönetimi süreçlerinde Econi Invest hizmet modeli.",
};

export default async function HizmetlerPage() {
  const language = await getServerSiteLanguage();
  const copy = servicesPageCopy(language);

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

        <section className="frame mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {copy.items.map((service) => (
            <article key={service.title} className="luxury-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-strong)]">{copy.serviceLabel}</p>
              <h2 className="mt-2 text-[1.8rem] leading-none font-semibold text-[var(--brand-primary)]">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-600)]">{service.text}</p>
            </article>
          ))}
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
