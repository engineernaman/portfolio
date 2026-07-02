import { ExternalLink, ChefHat } from 'lucide-react';
import PageShell from '../components/PageShell';

const CYBERCHEF_URL = 'https://gchq.github.io/CyberChef/';

const CyberChefPage = () => (
  <PageShell
    title="CyberChef"
    subtitle="GCHQ's data transformation workbench — encode, decode, hash, encrypt, and analyze payloads without leaving the portfolio."
    accent="cyan"
  >
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-black/20">
      <div className="flex items-center gap-2 text-xs font-mono text-cyan-300/80">
        <ChefHat className="w-4 h-4" />
        Embedded from GCHQ CyberChef
      </div>
      <a
        href={CYBERCHEF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate/60 hover:text-cyan-300 transition-colors"
      >
        Open full tab <ExternalLink className="w-3 h-3" />
      </a>
    </div>
    <iframe
      title="CyberChef — data transformation workbench"
      src={CYBERCHEF_URL}
      className="w-full border-0 bg-[#0a0e16]"
      style={{ height: 'min(75vh, 720px)' }}
      allow="clipboard-read; clipboard-write"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </PageShell>
);

export default CyberChefPage;
