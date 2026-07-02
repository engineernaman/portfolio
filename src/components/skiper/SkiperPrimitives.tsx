import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SkiperLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'slide' | 'center' | 'height';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
};

/** Skiper UI–inspired animated link (skiper40 pattern) */
export function SkiperLink({ href, children, variant = 'slide', className, onClick, target, rel }: SkiperLinkProps) {
  const base = 'relative inline-block font-mono text-sm tracking-wide text-emerald-300 hover:text-emerald-200 transition-colors';

  if (variant === 'center') {
    return (
      <a href={href} onClick={onClick} target={target} rel={rel} className={cn(base, 'group', className)}>
        <span className="relative z-10">{children}</span>
        <span className="absolute bottom-0 left-1/2 w-0 h-px bg-emerald-400 group-hover:w-full group-hover:left-0 transition-all duration-300" />
      </a>
    );
  }

  if (variant === 'height') {
    return (
      <a href={href} onClick={onClick} target={target} rel={rel} className={cn(base, 'group overflow-hidden', className)}>
        <span className="block transition-transform duration-300 group-hover:-translate-y-full">{children}</span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-cyan-300">
          {children}
        </span>
      </a>
    );
  }

  return (
    <a href={href} onClick={onClick} className={cn(base, 'group', className)}>
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:w-full transition-all duration-300 ease-out" />
    </a>
  );
}

interface SkiperMarqueeProps {
  items: string[];
  className?: string;
}

/** Skiper-style horizontal marquee strip */
export function SkiperMarquee({ items, className }: SkiperMarqueeProps) {
  const row = [...items, ...items];
  return (
    <div className={cn('overflow-hidden border-y border-white/10 bg-[rgba(6,10,16,0.95)] py-3', className)}>
      <div className="flex animate-marquee whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="mx-8 text-xs font-mono tracking-[0.2em] text-readable-dim uppercase">
            {item}
            <span className="mx-8 text-emerald-500/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
