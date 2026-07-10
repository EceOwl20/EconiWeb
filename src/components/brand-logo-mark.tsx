type BrandLogoMarkProps = {
  className?: string;
};

export function BrandLogoMark({ className = "" }: BrandLogoMarkProps) {
  return (
    <span
      aria-hidden
      className={`relative flex items-center justify-center rounded-[0.35rem] bg-[var(--brand-green)] text-white shadow-[0_18px_34px_-26px_rgba(102,165,87,0.62)] ${className}`}
    >
      <span className="absolute bottom-[16%] right-[16%] h-[17%] w-[17%] bg-white" />
    </span>
  );
}
