interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeader = ({ number, title, subtitle, align = 'left' }: SectionHeaderProps) => (
  <div className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : ''}`}>
    <div className={`flex items-center gap-3 mb-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-400/90">
        {number}
      </span>
      <div className="h-px w-10 bg-white/10" />
    </div>
    <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 text-slate/60 max-w-2xl text-sm md:text-base leading-relaxed font-body">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeader;
