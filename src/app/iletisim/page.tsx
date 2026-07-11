import type { Metadata } from "next";
import Link from "next/link";

import { GeneralContactForm } from "@/components/general-contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listProperties } from "@/lib/data-store";
import { propertyTitleForLanguage } from "@/lib/property-content";
import { contactPageCopy } from "@/lib/site-copy";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";

export const metadata: Metadata = {
  title: "İletişim | Econi Invest",
  description: "Gayrimenkul yatırımı, portföy satışı, değerleme ve danışmanlık talepleriniz için Econi Invest ekibiyle iletişime geçin.",
};

export default async function IletisimPage() {
  const language = await getServerSiteLanguage();
  const copy = contactPageCopy(language);
  const properties = listProperties();

  const propertyOptions = properties.slice(0, 16).map((property) => ({
    slug: property.slug,
    title: `${propertyTitleForLanguage(property, language)} • ${property.city}/${property.district}`,
  }));

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

        <section className="frame mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <GeneralContactForm properties={propertyOptions} />

          <aside className="luxury-card p-6 sm:p-7">
            <span className="section-kicker">{copy.infoKicker}</span>
            <h2 className="mt-3 text-[2rem] leading-none font-semibold text-[var(--brand-primary)]">{copy.infoTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-600)]">
              {copy.infoBody}
            </p>

            <div className="mt-4 space-y-2 text-sm text-[var(--ink-600)]">
              <p><span className="font-semibold">{copy.phone}:</span> +90 212 900 00 01</p>
              <p><span className="font-semibold">{copy.email}:</span> info@econiinvest.com</p>
              <p><span className="font-semibold">{copy.address}:</span> Levent, İstanbul</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <a
                href="tel:+902129000001"
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-green)]"
              >
                {copy.call}
              </a>
              <Link
                href="/danismanlar"
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-green)]"
              >
                {copy.advisors}
              </Link>
            </div>
          </aside>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
