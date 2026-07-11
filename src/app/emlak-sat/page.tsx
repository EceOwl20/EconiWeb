import type { Metadata } from "next";
import Link from "next/link";

import { SellPropertyForm } from "@/components/sell-property-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listProperties } from "@/lib/data-store";
import { sellPageCopy } from "@/lib/site-copy";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";

export const metadata: Metadata = {
  title: "Portföyünüzü Satın | Econi Invest",
  description: "Mülkünüz için ön değerleme, doğru fiyat bandı ve profesyonel satış planı oluşturmak üzere Econi Invest ekibiyle iletişime geçin.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type EmlakSatPageProps = {
  searchParams: SearchParams;
};

function readString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function EmlakSatPage({ searchParams }: EmlakSatPageProps) {
  const language = await getServerSiteLanguage();
  const copy = sellPageCopy(language);
  const params = await searchParams;
  const intent = readString(params.intent).trim();
  const properties = listProperties();

  const cityDistrictMap = properties.reduce<Record<string, string[]>>((accumulator, property) => {
    const districts = accumulator[property.city] ?? [];
    if (!districts.includes(property.district)) {
      districts.push(property.district);
      districts.sort((a, b) => a.localeCompare(b, "tr"));
    }
    accumulator[property.city] = districts;
    return accumulator;
  }, {});

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="w-full pb-24">
        <section className="frame-wide fade-up rounded-lg border border-[var(--line)] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-10">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">{copy.heroKicker}</p>
            <h1 className="mt-3 text-[2.4rem] leading-[1.02] font-bold text-[var(--brand-primary)] sm:text-[3.8rem]">
              {copy.heroTitle}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-600)] sm:text-base">
              {copy.heroBody}
            </p>
          </div>
        </section>

        <section className="frame mt-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <SellPropertyForm cityDistrictMap={cityDistrictMap} defaultIntent={intent} />

          <aside className="space-y-4">
            <article className="luxury-card p-6 sm:p-7">
              <span className="section-kicker">{copy.planKicker}</span>
              <h2 className="mt-3 text-[2rem] leading-none font-semibold text-[var(--brand-primary)]">{copy.planTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-600)]">
                {copy.planBody}
              </p>

              <div className="mt-5 space-y-3">
                {copy.planItems.map((item) => (
                  <div key={item} className="rounded-[1rem] border border-[#e1d3be] bg-white px-4 py-3 text-sm text-[#4f463a]">
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="luxury-card p-6 sm:p-7">
              <span className="section-kicker">{copy.accessKicker}</span>
              <h2 className="mt-3 text-[1.85rem] leading-none font-semibold text-[var(--brand-primary)]">{copy.accessTitle}</h2>

              <div className="mt-4 space-y-3 text-sm text-[var(--ink-600)]">
                <p><span className="font-semibold">{copy.phone}:</span> +90 212 900 00 01</p>
                <p><span className="font-semibold">{copy.whatsapp}:</span> +90 532 111 22 33</p>
                <p><span className="font-semibold">{copy.email}:</span> sales@econiinvest.com</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                href="tel:+902129000001"
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-green)]"
              >
                  {copy.call}
                </a>
                <Link
                  href="/danismanlar"
                  className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-green)]"
                >
                  {copy.advisors}
                </Link>
              </div>
            </article>
          </aside>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
