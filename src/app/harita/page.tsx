import type { Metadata } from "next";
import Link from "next/link";

import { PropertyMap } from "@/components/map/property-map";
import { PriceText } from "@/components/price-text";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listAdvisors, listProperties } from "@/lib/data-store";
import { propertyTitleForLanguage } from "@/lib/property-content";
import { propertyDisplayAmount, propertyDisplayCurrency } from "@/lib/property-pricing";
import { mapPageCopy } from "@/lib/site-copy";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";

export const metadata: Metadata = {
  title: "Harita | Econi Invest",
  description: "Gayrimenkul portföylerini lokasyon, bölge ve ulaşım perspektifiyle harita üzerinde inceleyin.",
};

export default async function HaritaPage() {
  const language = await getServerSiteLanguage();
  const copy = mapPageCopy(language);
  const properties = listProperties();
  const advisors = listAdvisors();
  const advisorMap = new Map(advisors.map((advisor) => [advisor.id, advisor]));

  const mapPortfolios = properties.map((property) => ({
    id: property.id,
    slug: property.slug,
    title: propertyTitleForLanguage(property, language),
    city: property.city,
    district: property.district,
    neighborhood: property.neighborhood,
    listingRef: property.listingRef,
    price: propertyDisplayAmount(property),
    priceCurrency: propertyDisplayCurrency(property),
    latitude: property.latitude,
    longitude: property.longitude,
    advisorName: advisorMap.get(property.advisorId)?.name,
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

        <section className="frame-wide mt-7">
          <PropertyMap portfolios={mapPortfolios} />
        </section>

        <section className="frame mt-8">
          <div className="mb-4 flex items-end justify-between gap-2">
            <h2 className="text-[2rem] leading-none font-semibold text-[var(--brand-primary)]">{copy.resultsTitle}</h2>
            <Link href="/portfoyler" className="text-sm font-semibold text-[var(--brand-accent-strong)] underline">
              {copy.switchToList}
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {properties.slice(0, 6).map((property) => (
              <article key={property.id} className="luxury-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">{property.listingRef}</p>
                <h3 className="mt-1 text-2xl font-semibold leading-tight text-[var(--brand-primary)]">
                  {propertyTitleForLanguage(property, language)}
                </h3>
                <p className="mt-1 text-sm text-[var(--ink-600)]">{property.city} / {property.district} / {property.neighborhood}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--brand-accent-strong)]">
                  <PriceText
                    amount={propertyDisplayAmount(property)}
                    sourceCurrency={propertyDisplayCurrency(property)}
                  />
                </p>
                <Link href={`/ilan/${property.slug}`} className="mt-2 inline-block text-sm font-semibold underline">
                  {copy.detail}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
