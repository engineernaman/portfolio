import { ExternalLink, ChefHat, ArrowLeft } from 'lucide-react';
import { pageToHash } from '../data/siteNav';

const CYBERCHEF_URL = 'https://gchq.github.io/CyberChef/';

const CyberChefPage = () => (
  <div className="fixed inset-0 z-10 flex flex-col pointer-events-auto bg-[#0c0f14] pt-[52px] pb-[72px]">
    <header className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-2 border-b border-white/8 bg-[rgba(6,10,16,0.95)] backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <a
          href={pageToHash('home')}
          className="flex items-center gap-1.5 text-xs font-mono text-slate/50 hover:text-emerald-300 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back</span>
        </a>
        <span className="w-px h-4 bg-white/10 shrink-0" aria-hidden />
        <div className="flex items-center gap-2 min-w-0">
          <ChefHat className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm font-display font-semibold text-readable truncate">CyberChef</span>
          <span className="hidden md:inline text-[10px] font-mono text-slate/40 truncate">GCHQ data workbench</span>
        </div>
      </div>
      <a
        href={CYBERCHEF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-cyan-500/25 text-cyan-300/90 hover:bg-cyan-500/10 transition-colors shrink-0"
      >
        Full screen <ExternalLink className="w-3 h-3" />
      </a>
    </header>

    <iframe
      title="CyberChef — data transformation workbench"
      src={CYBERCHEF_URL}
      className="flex-1 w-full min-h-0 border-0 bg-[#1a1a1a]"
      allow="clipboard-read; clipboard-write; fullscreen"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
);

export default CyberChefPage;
