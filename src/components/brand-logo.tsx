type BrandLogoProps = {
  inverse?: boolean;
  compact?: boolean;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ inverse = false, compact = false, className = "" }: BrandLogoProps) {
  return (
    <span
      className={`inline-flex flex-col justify-center leading-[0.82] ${compact ? "min-w-[7.5rem]" : "min-w-[10rem]"} ${
        inverse ? "text-white" : "text-[var(--brand-primary)]"
      } ${className}`}
      aria-label="Econi Invest"
      role="img"
    >
      <span className={`${compact ? "text-[1.15rem]" : "text-[1.42rem]"} font-black tracking-[0.01em]`}>
        Econi<span className="text-[var(--brand-green)]">.</span>
      </span>
      <span className={`${compact ? "text-[1.15rem]" : "text-[1.42rem]"} font-black tracking-[0.01em]`}>
        Invest
      </span>
    </span>
  );
}
