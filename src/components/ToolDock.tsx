import { motion } from 'framer-motion';
import { Music, ChefHat, FlaskConical, Radar, LayoutGrid } from 'lucide-react';
import { TOOL_PAGES, pageToHash, type SitePage } from '../data/siteNav';
import { useApp } from '../context/AppContext';

const DOCK_TOOLS = [
  { id: 'palette' as const, label: 'Menu', icon: LayoutGrid, href: null },
  ...TOOL_PAGES.map((p) => ({
    id: p.id as SitePage,
    label: p.label,
    icon: p.id === 'music' ? Music : ChefHat,
    href: p.hash,
  })),
  { id: 'intel' as const, label: 'Intel', icon: FlaskConical, href: null },
  { id: 'scan' as const, label: 'Scan', icon: Radar, href: '#visitor-scan' },
];

type ToolDockProps = {
  activePage: SitePage;
  onOpenPalette: () => void;
};

const ToolDock = ({ activePage, onOpenPalette }: ToolDockProps) => {
  const { playTypingSound, openIntelLab } = useApp();

  return (
    <motion.nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[55] pointer-events-auto"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.4 }}
      aria-label="Quick tools"
    >
      <div className="flex items-center gap-1 px-2 py-2 rounded-2xl border border-white/12 bg-[rgba(6,10,16,0.88)] backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(52,211,153,0.08)]">
        {DOCK_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.id === activePage;
          const isTool = tool.id === 'music' || tool.id === 'cyberchef';

          if (tool.id === 'palette') {
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  playTypingSound();
                  onOpenPalette();
                }}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-slate/60 hover:text-emerald-300 hover:bg-white/6 transition-colors"
                title="Open command palette (⌘K)"
              >
                <Icon className="w-4 h-4" />
                <span className="text-[8px] font-mono uppercase tracking-wider">{tool.label}</span>
              </button>
            );
          }

          if (tool.id === 'intel') {
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  playTypingSound();
                  openIntelLab();
                }}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-slate/60 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                title="Threat Intel Lab"
              >
                <Icon className="w-4 h-4" />
                <span className="text-[8px] font-mono uppercase tracking-wider">{tool.label}</span>
              </button>
            );
          }

          return (
            <a
              key={tool.id}
              href={tool.href ?? pageToHash('home')}
              onClick={() => playTypingSound()}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive && isTool
                  ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/25'
                  : 'text-slate/60 hover:text-emerald-300 hover:bg-white/6'
              }`}
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[8px] font-mono uppercase tracking-wider">{tool.label}</span>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default ToolDock;
