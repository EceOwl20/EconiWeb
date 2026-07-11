import type { Metadata } from "next";
import Link from "next/link";

import { PropertyCard } from "@/components/property-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listAdvisors, listCities, listProperties, listRoomOptions, listTypes } from "@/lib/data-store";
import { getExchangeRateSnapshot } from "@/lib/exchange-rates";
import { convertAmountBetweenCurrencies } from "@/lib/exchange-rates-shared";
import { portfolioPageCopy, translatePropertyType, translateRoomLabel } from "@/lib/site-copy";
import { getServerSiteLanguage, getServerSitePreferences } from "@/lib/site-preferences-server";

export const metadata: Metadata = {
  title: "Portföyler | Econi Invest",
  description: "Seçili gayrimenkul portföylerini lokasyon, tip, oda sayısı ve bütçe kriterlerine göre filtreleyin.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type PortfoylerPageProps = {
  searchParams: SearchParams;
};

function readString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function toNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function PortfoylerPage({ searchParams }: PortfoylerPageProps) {
  const [language, preferences, exchangeRateSnapshot] = await Promise.all([
    getServerSiteLanguage(),
    getServerSitePreferences(),
    getExchangeRateSnapshot(),
  ]);
  const copy = portfolioPageCopy(language);
  const params = await searchParams;

  const query = readString(params.q).trim();
  const city = readString(params.city).trim();
  const type = readString(params.type).trim();
  const rooms = readString(params.rooms).trim();
  const minPriceValue = readString(params.minPrice);
  const maxPriceValue = readString(params.maxPrice);
  const minPrice = toNumber(minPriceValue);
  const maxPrice = toNumber(maxPriceValue);

  const properties = listProperties({
    query: query || undefined,
    city: city || undefined,
    type: type || undefined,
    rooms: rooms || undefined,
    minPrice:
      typeof minPrice === "number"
        ? Math.ceil(convertAmountBetweenCurrencies(minPrice, preferences.currency, "TRY", exchangeRateSnapshot.rates))
        : undefined,
    maxPrice:
      typeof maxPrice === "number"
        ? Math.floor(convertAmountBetweenCurrencies(maxPrice, preferences.currency, "TRY", exchangeRateSnapshot.rates))
        : undefined,
  });

  const advisors = listAdvisors();
  const advisorMap = new Map(advisors.map((advisor) => [advisor.id, advisor]));

  const cities = listCities();
  const types = listTypes();
  const roomOptions = listRoomOptions();

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

        <section className="frame mt-8">
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="h-fit rounded-lg border border-[var(--line)] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-5 xl:sticky xl:top-24">
              <div className="border-b border-[var(--line)] pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent-strong)]">{copy.filterKicker}</p>
                <h2 className="mt-2 text-[1.75rem] leading-none font-bold text-[var(--brand-primary)]">{copy.filterTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-600)]">
                  {copy.filterBody}
                </p>
              </div>

              <form className="mt-5 grid gap-3" method="GET">
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={copy.searchPlaceholder}
                  className="input"
                />

                <select name="city" defaultValue={city} className="input">
                  <option value="">{copy.cityPlaceholder}</option>
                  {cities.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select name="type" defaultValue={type} className="input">
                  <option value="">{copy.typePlaceholder}</option>
                  {types.map((item) => (
                    <option key={item} value={item}>
                      {translatePropertyType(item, language)}
                    </option>
                  ))}
                </select>

                <select name="rooms" defaultValue={rooms} className="input">
                  <option value="">{copy.roomPlaceholder}</option>
                  {roomOptions.map((item) => (
                    <option key={item} value={item}>
                      {translateRoomLabel(item, language)}
                    </option>
                  ))}
                </select>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <input
                    name="minPrice"
                    defaultValue={minPriceValue}
                    type="number"
                    min={0}
                    placeholder={copy.minPricePlaceholder}
                    className="input"
                  />
                  <input
                    name="maxPrice"
                    defaultValue={maxPriceValue}
                    type="number"
                    min={0}
                    placeholder={copy.maxPricePlaceholder}
                    className="input"
                  />
                </div>

                <button type="submit" className="btn-gold mt-2 cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold transition">
                  {copy.submit}
                </button>
              </form>

              <div className="mt-5 rounded-lg border border-[var(--line)] bg-white p-4 text-sm text-[var(--ink-600)]">
                <p>
                  {copy.activeResults}: <strong className="text-[var(--brand-primary)]">{properties.length}</strong>
                </p>
                <Link href="/harita" className="mt-2 inline-flex font-semibold text-[var(--brand-accent-strong)] underline">
                  {copy.mapView}
                </Link>
              </div>
            </aside>

            <div className="min-w-0">
              {properties.length === 0 ? (
                <div className="luxury-card p-8 text-center text-sm text-[#645b50]">
                  {copy.noResults}
                </div>
              ) : (
                <div className="grid gap-5">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} advisor={advisorMap.get(property.advisorId)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
