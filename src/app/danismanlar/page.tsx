import type { Metadata } from "next";
import Image from "next/image";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listAdvisors, listProperties } from "@/lib/data-store";
import { formatPhoneForHref } from "@/lib/format";
import { isUnoptimizedImageSrc } from "@/lib/image-src";
import { advisorsPageCopy } from "@/lib/site-copy";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";

export const metadata: Metadata = {
  title: "Danışmanlar | Econi Invest",
  description: "Portföy segmentlerine ve bölgelere göre uzmanlaşmış Econi Invest danışman ekibi.",
};

export default async function DanismanlarPage() {
  const language = await getServerSiteLanguage();
  const copy = advisorsPageCopy(language);
  const advisors = listAdvisors();
  const properties = listProperties();

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
          {advisors.map((advisor) => {
            const propertyCount = properties.filter((property) => property.advisorId === advisor.id).length;
            const phoneHref = `tel:${formatPhoneForHref(advisor.phone)}`;
            const whatsappHref = `https://wa.me/${formatPhoneForHref(advisor.whatsapp)}`;

            return (
              <article key={advisor.id} className="luxury-card overflow-hidden p-5">
                <div className="mb-5 overflow-hidden rounded-lg border border-[var(--line)] bg-white">
                  <Image
                    src={advisor.image}
                    alt={advisor.name}
                    fetchPriority="low"
                    unoptimized={isUnoptimizedImageSrc(advisor.image)}
                    width={900}
                    height={720}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="h-72 w-full object-cover"
                  />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-strong)]">{copy.advisorLabel}</p>
                <h2 className="mt-2 text-[2rem] leading-none font-semibold text-[var(--brand-primary)]">{advisor.name}</h2>
                <p className="mt-1 text-sm text-[var(--ink-600)]">{advisor.title}</p>
                <p className="mt-2 text-sm text-[var(--ink-600)]">{copy.specialty}: {advisor.focusArea}</p>
                <p className="mt-2 text-sm text-[var(--ink-600)]">{copy.activeListings}: {propertyCount}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <a
                    href={phoneHref}
                    className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-green)]"
                  >
                    {copy.call}
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-[rgba(102,165,87,0.32)] bg-[rgba(102,165,87,0.1)] px-4 py-2 font-semibold text-[var(--brand-accent-strong)] transition hover:bg-[rgba(102,165,87,0.16)]"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${advisor.email}`}
                    className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-green)]"
                  >
                    {copy.email}
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
