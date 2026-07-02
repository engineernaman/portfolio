import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { pageToHash } from '../data/siteNav';

type PageShellProps = {
  title: string;
  subtitle: string;
  accent?: 'emerald' | 'cyan' | 'amber';
  children: ReactNode;
};

const accentMap = {
  emerald: {
    border: 'border-emerald-500/25',
    glow: 'shadow-[0_0_60px_rgba(52,211,153,0.08)]',
    label: 'text-emerald-400/80',
    dot: 'bg-emerald-400',
  },
  cyan: {
    border: 'border-cyan-500/25',
    glow: 'shadow-[0_0_60px_rgba(34,211,238,0.08)]',
    label: 'text-cyan-400/80',
    dot: 'bg-cyan-400',
  },
  amber: {
    border: 'border-amber-500/25',
    glow: 'shadow-[0_0_60px_rgba(251,191,36,0.08)]',
    label: 'text-amber-400/80',
    dot: 'bg-amber-400',
  },
};

const PageShell = ({ title, subtitle, accent = 'emerald', children }: PageShellProps) => {
  const a = accentMap[accent];

  return (
    <main className="min-h-screen pt-24 pb-16 pointer-events-auto">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <a
          href={pageToHash('home')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate/60 hover:text-emerald-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to portfolio
        </a>

        <header className="mb-8">
          <p className={`text-[10px] font-mono uppercase tracking-[0.28em] ${a.label} mb-2`}>
            SoumySec · Tools
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-readable mb-2">{title}</h1>
          <p className="text-readable-muted font-body text-sm sm:text-base max-w-2xl">{subtitle}</p>
        </header>

        <div
          className={`rounded-2xl border ${a.border} bg-[rgba(6,10,16,0.72)] backdrop-blur-xl ${a.glow} overflow-hidden`}
        >
          {children}
        </div>
      </div>
    </main>
  );
};

export default PageShell;
