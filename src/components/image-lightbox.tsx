"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo } from "react";

import { isUnoptimizedImageSrc } from "@/lib/image-src";

export type ImageLightboxItem = {
  src: string;
  alt: string;
  label?: string;
};

type ImageLightboxProps = {
  images: ImageLightboxItem[];
  activeIndex: number;
  open: boolean;
  title?: string;
  previousLabel: string;
  nextLabel: string;
  closeLabel: string;
  onActiveIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
      <path d="m5.25 5.25 9.5 9.5M14.75 5.25l-9.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ImageLightbox({
  images,
  activeIndex,
  open,
  title,
  previousLabel,
  nextLabel,
  closeLabel,
  onActiveIndexChange,
  onOpenChange,
}: ImageLightboxProps) {
  const normalizedImages = useMemo(() => images.filter((image) => image.src.trim().length > 0), [images]);
  const imageCount = normalizedImages.length;
  const safeActiveIndex = imageCount > 0 ? Math.min(Math.max(activeIndex, 0), imageCount - 1) : 0;
  const activeImage = normalizedImages[safeActiveIndex];

  const moveImage = useCallback((direction: -1 | 1) => {
    if (imageCount <= 1) {
      return;
    }

    onActiveIndexChange((safeActiveIndex + direction + imageCount) % imageCount);
  }, [imageCount, onActiveIndexChange, safeActiveIndex]);

  useEffect(() => {
    if (!open || imageCount === 0 || activeIndex === safeActiveIndex) {
      return;
    }

    onActiveIndexChange(safeActiveIndex);
  }, [activeIndex, imageCount, onActiveIndexChange, open, safeActiveIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveImage(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveImage(1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [moveImage, onOpenChange, open]);

  if (!open || !activeImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 cursor-default bg-[rgba(7,10,14,0.78)] backdrop-blur-sm"
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? activeImage.alt}
          className="pointer-events-auto flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/12 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.42)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-4 py-3 sm:px-5">
            <div className="min-w-0">
              {title ? <p className="truncate text-sm font-semibold text-[var(--brand-primary)]">{title}</p> : null}
              <p className="mt-0.5 text-xs font-medium text-[var(--ink-500)]">
                {activeImage.label ? `${activeImage.label} · ` : null}
                {safeActiveIndex + 1} / {imageCount}
              </p>
            </div>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => onOpenChange(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--brand-primary)] transition hover:border-[var(--brand-green)] hover:text-[var(--brand-accent-strong)]"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="relative h-[58vh] min-h-[280px] bg-[#07090d] sm:h-[68vh]">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              unoptimized={isUnoptimizedImageSrc(activeImage.src)}
              sizes="100vw"
              className="object-contain"
            />

            {imageCount > 1 ? (
              <>
                <button
                  type="button"
                  aria-label={previousLabel}
                  onClick={() => moveImage(-1)}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg border border-white/36 bg-[#0b0f14]/52 text-white backdrop-blur transition hover:bg-[#0b0f14]/72 sm:left-5"
                >
                  <ArrowIcon direction="left" />
                </button>
                <button
                  type="button"
                  aria-label={nextLabel}
                  onClick={() => moveImage(1)}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg border border-white/36 bg-[#0b0f14]/52 text-white backdrop-blur transition hover:bg-[#0b0f14]/72 sm:right-5"
                >
                  <ArrowIcon direction="right" />
                </button>
              </>
            ) : null}
          </div>

          {imageCount > 1 ? (
            <div className="flex gap-2 overflow-x-auto border-t border-[var(--line)] bg-white p-3">
              {normalizedImages.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => onActiveIndexChange(index)}
                  aria-label={image.label ?? image.alt}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition ${
                    index === safeActiveIndex
                      ? "border-[var(--brand-green)] ring-2 ring-[rgba(102,165,87,0.24)]"
                      : "border-[var(--line)] hover:border-[var(--brand-green)]"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized={isUnoptimizedImageSrc(image.src)}
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
