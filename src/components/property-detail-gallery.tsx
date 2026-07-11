"use client";

import Image from "next/image";
import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";

import { ImageLightbox, type ImageLightboxItem } from "@/components/image-lightbox";
import { useSitePreferences } from "@/components/use-site-preferences";
import { isUnoptimizedImageSrc } from "@/lib/image-src";
import { propertyDetailGalleryCopy } from "@/lib/site-copy";

type PropertyDetailGalleryProps = {
  title: string;
  listingRef: string;
  locationLabel: string;
  coverImage: string;
  galleryImages: string[];
  imageLabels: string[];
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d={direction === "left" ? "M11.75 4.5 6.25 10l5.5 5.5" : "M8.25 4.5 13.75 10l-5.5 5.5"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PropertyDetailGallery({
  title,
  listingRef,
  locationLabel,
  coverImage,
  galleryImages,
  imageLabels,
}: PropertyDetailGalleryProps) {
  const { language } = useSitePreferences();
  const copy = propertyDetailGalleryCopy(language);
  const gallery = useMemo(() => {
    const images = [coverImage, ...galleryImages].filter((image) => Boolean(image?.trim()));
    return Array.from(new Set(images));
  }, [coverImage, galleryImages]);
  const lightboxImages = useMemo<ImageLightboxItem[]>(
    () =>
      gallery.map((image, index) => {
        const label = imageLabels[index - 1] ?? (index === 0 ? copy.cover : `${copy.image} ${index + 1}`);

        return {
          src: image,
          alt: `${title} - ${label}`,
          label,
        };
      }),
    [copy.cover, copy.image, gallery, imageLabels, title],
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = gallery[activeImageIndex] ?? coverImage;
  const activeLabel =
    imageLabels[activeImageIndex - 1] ??
    (activeImageIndex === 0 ? copy.cover : `${copy.image} ${activeImageIndex + 1}`);

  function stepGallery(direction: -1 | 1) {
    if (gallery.length <= 1) {
      return;
    }

    setActiveImageIndex((current) => {
      const next = current + direction;
      if (next < 0) {
        return gallery.length - 1;
      }

      if (next >= gallery.length) {
        return 0;
      }

      return next;
    });
  }

  function handleGalleryStep(event: MouseEvent<HTMLButtonElement>, direction: -1 | 1) {
    event.stopPropagation();
    stepGallery(direction);
  }

  function openGallery(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    setLightboxOpen(true);
  }

  function handleGalleryKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      setLightboxOpen(true);
    }
  }

  function openThumbnail(index: number) {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      <div className="relative overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${title} ${copy.openGallery}`}
        onClick={openGallery}
        onKeyDown={handleGalleryKeyDown}
        className="relative h-[320px] cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-[rgba(102,165,87,0.5)] focus-visible:ring-inset sm:h-[430px]"
      >
        <Image
          src={activeImage}
          alt={`${title} - ${activeLabel}`}
          fetchPriority="high"
          unoptimized={isUnoptimizedImageSrc(activeImage)}
          fill
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="absolute inset-0 object-cover transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18120c]/85 via-[#18120c]/25 to-[#18120c]/18" />

        {gallery.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => handleGalleryStep(event, -1)}
              aria-label={copy.previous}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/42 bg-[#0b0f14]/34 text-white backdrop-blur transition hover:bg-[#0b0f14]/52"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={(event) => handleGalleryStep(event, 1)}
              aria-label={copy.next}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/42 bg-[#0b0f14]/34 text-white backdrop-blur transition hover:bg-[#0b0f14]/52"
            >
              <ArrowIcon direction="right" />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-kicker border-white/35 bg-white/15 text-white">{listingRef}</span>
            <span className="rounded border border-white/26 bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              {activeLabel}
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl text-[2.4rem] leading-[1.02] font-semibold sm:text-[3.2rem]">{title}</h1>
          <p className="mt-2 text-sm text-white/80">{locationLabel}</p>
        </div>
      </div>

      {gallery.length > 1 ? (
        <div className="grid gap-3 border-t border-[var(--line)] bg-white p-4 sm:grid-cols-4">
          {gallery.map((image, index) => {
            const label = imageLabels[index - 1] ?? (index === 0 ? copy.cover : `${copy.image} ${index + 1}`);

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => openThumbnail(index)}
                className={`overflow-hidden rounded-lg border text-left transition ${
                  index === activeImageIndex
                    ? "border-[var(--brand-green)] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.08)]"
                    : "border-[var(--line)] bg-white hover:border-[var(--brand-green)]"
                }`}
              >
                <div className="relative h-24">
                  <Image
                    src={image}
                    alt={`${title} ${copy.thumbAlt} ${index + 1}`}
                    fill
                    unoptimized={isUnoptimizedImageSrc(image)}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <p className="px-3 py-2 text-xs font-semibold text-[var(--brand-primary)]">{label}</p>
              </button>
            );
          })}
        </div>
      ) : null}
      </div>

      <ImageLightbox
        images={lightboxImages}
        activeIndex={activeImageIndex}
        open={lightboxOpen}
        title={title}
        previousLabel={copy.previous}
        nextLabel={copy.next}
        closeLabel={copy.closeGallery}
        onActiveIndexChange={setActiveImageIndex}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}
