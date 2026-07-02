interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeader = ({ number, title, subtitle, align = 'left' }: SectionHeaderProps) => (
  <div className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
    <div className={`flex items-center gap-3 mb-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className="font-mono text-[11px] tracking-[0.18em] text-emerald-400 font-medium">
        {number}
      </span>
      <div className="h-px w-10 bg-white/15" />
    </div>
    <h2 className="font-display text-3xl md:text-[2.25rem] font-bold text-readable tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-readable max-w-2xl text-base md:text-[1.0625rem] leading-relaxed font-body drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
