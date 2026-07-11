import Image from "next/image";

type BrandLogoProps = {
  inverse?: boolean;
  compact?: boolean;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ inverse = false, compact = false, className = "", priority = false }: BrandLogoProps) {
  return (
    <span
      className={`relative inline-flex items-center ${compact ? "w-[9.5rem]" : "w-[12.5rem]"} ${className}`}
      aria-label="Econi Invest"
      role="img"
    >
      <Image
        src="/brand/econi-invest-green.webp"
        alt=""
        width={1761}
        height={211}
        priority={priority}
        sizes={compact ? "152px" : "200px"}
        className={`h-full w-full object-contain object-left ${inverse ? "brightness-0 invert" : ""}`}
      />
    </span>
  );
}
