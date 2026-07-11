import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppointmentForm } from "@/components/appointment-form";
import {
  AreaFieldIcon,
  FloorFieldIcon,
  HeatingFieldIcon,
  PriceFieldIcon,
  RoomFieldIcon,
  TypeFieldIcon,
} from "@/components/panel/property-field-shell";
import { ContactForm } from "@/components/contact-form";
import { PriceText } from "@/components/price-text";
import { PropertyDetailGallery } from "@/components/property-detail-gallery";
import { PropertyInfoIcon } from "@/components/property-info-icon";
import { SiteHeader } from "@/components/site-header";
import { getAdvisorById, getPropertyBySlug } from "@/lib/data-store";
import { formatPhoneForHref } from "@/lib/format";
import { isUnoptimizedImageSrc } from "@/lib/image-src";
import {
  propertyDescriptionForLanguage,
  propertyFeaturesForLanguage,
  propertyHighlightsForLanguage,
  propertyTitleForLanguage,
} from "@/lib/property-content";
import { propertyDisplayAmount, propertyDisplayCurrency } from "@/lib/property-pricing";
import { getProjectMeta } from "@/lib/project-meta";
import {
  propertyDetailPageCopy,
  propertyDetailWhatsAppInquiry,
  translateDeliveryDate,
  translateFloorLabel,
  translateHeatingLabel,
  translatePaymentPlan,
  translateProjectLaunchType,
  translatePropertyType,
  translateRoomLabel,
} from "@/lib/site-copy";
import type { SiteLanguage } from "@/lib/site-preferences";
import { getServerSiteLanguage } from "@/lib/site-preferences-server";
import { listingMetadata, propertySchema } from "@/lib/seo";
import type { PropertyInfoIconKey, PropertyInfoItem } from "@/lib/types";

type PropertyDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PropertyDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const property = getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    return { title: "İlan Bulunamadı | Econi Invest" };
  }

  return listingMetadata(property);
}

export default async function PropertyDetailPage({ params }: PropertyDetailProps) {
  const language = await getServerSiteLanguage();
  const copy = propertyDetailPageCopy(language);
  const resolvedParams = await params;

  const property = getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  const advisor = getAdvisorById(property.advisorId);
  const projectMeta = getProjectMeta(property);
  const listingSchema = propertySchema(property);
  const propertyTitle = propertyTitleForLanguage(property, language);
  const propertyDescription = propertyDescriptionForLanguage(property, language);
  const propertyHighlights = propertyHighlightsForLanguage(property, language);
  const propertyFeatures = propertyFeaturesForLanguage(property, language);
  const hasFloor = property.floor.trim().length > 0;
  const locationLabel =
    property.country && property.country !== "Türkiye"
      ? [property.country, property.city, property.district, property.neighborhood].join(" / ")
      : [property.city, property.district, property.neighborhood].join(" / ");

  const phoneHref = advisor ? `tel:${formatPhoneForHref(advisor.phone)}` : null;
  const whatsappHref = advisor
    ? `https://wa.me/${formatPhoneForHref(advisor.whatsapp)}?text=${encodeURIComponent(
        propertyDetailWhatsAppInquiry(language, propertyTitle, property.listingRef),
      )}`
    : null;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6">
        <Link href="/" className="text-sm font-semibold text-[#6f6558] transition hover:text-[#2a241c]">
          {copy.back}
        </Link>

        <section className="luxury-card mt-4 overflow-hidden">
          <PropertyDetailGallery
            title={propertyTitle}
            listingRef={property.listingRef}
            locationLabel={locationLabel}
            coverImage={property.coverImage}
            galleryImages={property.galleryImages}
            imageLabels={property.imageLabels}
          />

          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  label={copy.labels.price}
                  value={
                    <PriceText
                      amount={propertyDisplayAmount(property)}
                      sourceCurrency={propertyDisplayCurrency(property)}
                    />
                  }
                  icon={<PriceFieldIcon />}
                  highlight
                />
                <DetailItem label={copy.labels.type} value={translatePropertyType(property.type, language)} icon={<TypeFieldIcon />} />
                <DetailItem label={copy.labels.rooms} value={translateRoomLabel(property.rooms, language)} icon={<RoomFieldIcon />} />
                <DetailItem label={copy.labels.area} value={String(property.areaM2)} icon={<AreaFieldIcon />} />
                {hasFloor ? (
                  <DetailItem label={copy.labels.floor} value={translateFloorLabel(property.floor, language)} icon={<FloorFieldIcon />} />
                ) : null}
                <DetailItem label={copy.labels.heating} value={translateHeatingLabel(property.heating, language)} icon={<HeatingFieldIcon />} />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <DetailItem label={copy.labels.launch} value={translateProjectLaunchType(projectMeta.launchType, language)} icon={<TypeFieldIcon />} compact />
                <DetailItem label={copy.labels.paymentPlan} value={translatePaymentPlan(projectMeta.paymentPlan, language)} icon={<PriceFieldIcon />} compact />
                <DetailItem label={copy.labels.delivery} value={translateDeliveryDate(projectMeta.deliveryDate, language)} icon={<PropertyInfoIcon icon="calendar" />} compact />
              </div>

              {property.infoItems?.length ? (
                <PropertyInfoGrid items={property.infoItems} language={language} />
              ) : null}

              <p className="mt-6 text-sm leading-7 text-[var(--ink-600)]">{propertyDescription}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoList title={copy.highlights} items={propertyHighlights} />
                <InfoList title={copy.features} items={propertyFeatures} />
              </div>
            </div>

            <div className="space-y-4">
              {advisor ? (
                <aside className="rounded-lg border border-[var(--line)] bg-white p-5">
                  <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-center sm:justify-between">
                    <div className="flex justify-center sm:justify-end">
                      <div className="rounded-lg border border-[var(--line)] bg-white p-3">
                        <Image
                          src={advisor.image}
                          alt={advisor.name}
                          fetchPriority="low"
                          unoptimized={isUnoptimizedImageSrc(advisor.image)}
                          width={128}
                          height={128}
                          sizes="128px"
                          className="h-32 w-32 rounded-full border border-white/70 object-cover shadow-[0_4px_18px_rgba(0,0,0,0.12)]"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <h2 className="text-[1.8rem] font-semibold leading-none text-[var(--brand-primary)]">{copy.advisorTitle}</h2>
                      <p className="mt-2 text-sm font-semibold text-[var(--brand-primary)]">{advisor.name}</p>
                      <p className="text-sm text-[var(--ink-600)]">{advisor.title}</p>
                      <p className="mt-2 text-sm text-[var(--ink-600)]">{copy.specialty}: {advisor.focusArea}</p>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm">
                        {phoneHref ? (
                          <a
                            href={phoneHref}
                            className="rounded-lg border border-[var(--line)] bg-white px-4 py-2 font-semibold text-[var(--brand-primary)] transition hover:border-[var(--brand-green)]"
                          >
                            {copy.call}
                          </a>
                        ) : null}
                        {whatsappHref ? (
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-[rgba(102,165,87,0.32)] bg-[rgba(102,165,87,0.1)] px-4 py-2 font-semibold text-[var(--brand-accent-strong)] transition hover:bg-[rgba(102,165,87,0.16)]"
                          >
                            WhatsApp
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </aside>
              ) : null}

              <AppointmentForm propertySlug={property.slug} propertyTitle={propertyTitle} />
              <ContactForm propertySlug={property.slug} propertyTitle={propertyTitle} />
            </div>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
        />
      </main>
    </div>
  );
}

type DetailItemProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  highlight?: boolean;
  compact?: boolean;
};

function DetailItem({ label, value, icon, highlight = false, compact = false }: DetailItemProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? "border-[rgba(102,165,87,0.36)] bg-white" : "border-[var(--line)] bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <span
            className={`flex shrink-0 items-center justify-center rounded-full border ${
              compact ? "h-9 w-9" : "h-10 w-10"
            } ${
              highlight ? "border-[rgba(102,165,87,0.36)] bg-white text-[var(--brand-accent-strong)]" : "border-[var(--line)] bg-white text-[var(--ink-600)]"
            }`}
          >
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-500)]">{label}</p>
          <p
            className={`mt-1 font-semibold ${compact ? "text-base" : "text-xl"} ${
              highlight ? "text-[var(--brand-accent-strong)]" : "text-[var(--brand-primary)]"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

type InfoListProps = {
  title: string;
  items: string[];
};

function InfoList({ title, items }: InfoListProps) {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-[var(--ink-600)]">
        {items.map((item) => (
          <li key={item} className="rounded bg-white px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function PropertyInfoGrid({ items, language }: { items: PropertyInfoItem[]; language: SiteLanguage }) {
  return (
    <section className="mt-6 rounded-lg border border-[var(--line)] bg-white p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a8d78]">
        {translateInfoHeading(language)}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article key={`${item.icon}-${item.value}-${index}`} className="rounded-lg border border-[var(--line)] bg-white px-4 py-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--brand-accent-strong)]">
              <PropertyInfoIcon icon={item.icon} />
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-strong)]">
              {translateInfoLabel(item.icon, language)}
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-primary)]">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function translateInfoHeading(language: SiteLanguage) {
  switch (language) {
    case "EN":
      return "General Information";
    case "RU":
      return "Общая информация";
    case "AR":
      return "معلومات عامة";
    default:
      return "Genel Bilgiler";
  }
}

function translateInfoLabel(icon: PropertyInfoIconKey, language: SiteLanguage) {
  const labels = {
    TR: {
      commission: "Komisyon",
      location: "Konum",
      building: "Bina",
      rooms: "Oda",
      bath: "Banyo",
      pool: "Havuz",
      calendar: "Tarih",
      plane: "Havalimanı",
      beach: "Sahil",
      area: "Alan",
    },
    EN: {
      commission: "Commission",
      location: "Location",
      building: "Building",
      rooms: "Rooms",
      bath: "Bathroom",
      pool: "Pool",
      calendar: "Date",
      plane: "Airport",
      beach: "Beach",
      area: "Area",
    },
    RU: {
      commission: "Комиссия",
      location: "Локация",
      building: "Здание",
      rooms: "Комнаты",
      bath: "Ванная",
      pool: "Бассейн",
      calendar: "Дата",
      plane: "Аэропорт",
      beach: "Пляж",
      area: "Площадь",
    },
    AR: {
      commission: "العمولة",
      location: "الموقع",
      building: "المبنى",
      rooms: "الغرف",
      bath: "الحمام",
      pool: "المسبح",
      calendar: "التاريخ",
      plane: "المطار",
      beach: "الشاطئ",
      area: "المساحة",
    },
  } satisfies Record<SiteLanguage, Record<PropertyInfoIconKey, string>>;

  return labels[language][icon];
}
