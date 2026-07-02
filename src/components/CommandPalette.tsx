import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  User,
  Briefcase,
  Rocket,
  Mic2,
  FlaskConical,
  GraduationCap,
  Award,
  Mail,
  Music,
  ChefHat,
  Radar,
  X,
  Command,
} from 'lucide-react';
import { sections } from '../data/portfolio';
import { TOOL_PAGES, pageToHash, type SitePage } from '../data/siteNav';
import { useApp } from '../context/AppContext';

const SECTION_ICONS: Record<string, typeof Home> = {
  home: Home,
  about: User,
  experience: Briefcase,
  ventures: Rocket,
  speaking: Mic2,
  research: FlaskConical,
  training: GraduationCap,
  recognition: Award,
  contact: Mail,
};

export type NavDestination = {
  id: string;
  label: string;
  href: string;
  group: 'portfolio' | 'tools' | 'actions';
  icon: typeof Home;
  page: SitePage;
};

const PORTFOLIO_DESTINATIONS: NavDestination[] = [
  { id: 'home', label: 'Home', href: '#home', group: 'portfolio', icon: Home, page: 'home' },
  ...sections.map((s) => ({
    id: s.id,
    label: s.label,
    href: `#${s.id}`,
    group: 'portfolio' as const,
    icon: SECTION_ICONS[s.id] ?? User,
    page: 'home' as const,
  })),
];

const TOOL_DESTINATIONS: NavDestination[] = TOOL_PAGES.map((p) => ({
  id: p.id,
  label: p.label,
  href: p.hash,
  group: 'tools' as const,
  icon: p.id === 'music' ? Music : ChefHat,
  page: p.id,
}));

const ACTION_DESTINATIONS: NavDestination[] = [
  { id: 'intel-lab', label: 'Threat Intel Lab', href: '#intel-lab', group: 'actions', icon: FlaskConical, page: 'home' },
  { id: 'visitor-scan', label: 'Visitor Scan', href: '#visitor-scan', group: 'actions', icon: Radar, page: 'home' },
];

export const ALL_DESTINATIONS = [...PORTFOLIO_DESTINATIONS, ...TOOL_DESTINATIONS, ...ACTION_DESTINATIONS];

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  activePage: SitePage;
  activeSection: string;
  onIntelLab: () => void;
};

const CommandPalette = ({ open, onClose, activePage, activeSection, onIntelLab }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const { playTypingSound } = useApp();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const filtered = query.trim()
    ? ALL_DESTINATIONS.filter((d) =>
        d.label.toLowerCase().includes(query.toLowerCase()) ||
        d.id.includes(query.toLowerCase())
      )
    : ALL_DESTINATIONS;

  const groups = [
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'tools', label: 'Tools' },
    { key: 'actions', label: 'Quick actions' },
  ] as const;

  const handleSelect = useCallback(
    (dest: NavDestination) => {
      playTypingSound();
      onClose();
      if (dest.id === 'intel-lab') {
        onIntelLab();
        return;
      }
      const hash = dest.href.slice(1);
      if (window.location.hash.replace('#', '') !== hash) {
        window.location.hash = hash;
      }
      if (dest.page === 'home') {
        requestAnimationFrame(() => {
          const el = document.getElementById(dest.id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    },
    [onClose, onIntelLab, playTypingSound]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed left-1/2 top-[12vh] z-[81] w-[min(94vw,520px)] -translate-x-1/2 rounded-2xl border border-emerald-500/20 bg-[rgba(6,10,16,0.96)] backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65)] overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
              <Search className="w-4 h-4 text-emerald-400/70 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to section, tool, or action…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate/40 outline-none font-body"
              />
              <kbd className="hidden sm:inline text-[10px] font-mono text-slate/40 border border-white/10 rounded px-1.5 py-0.5">esc</kbd>
              <button type="button" onClick={onClose} className="p-1 text-slate/50 hover:text-white sm:hidden" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
              {groups.map((g) => {
                const items = filtered.filter((d) => d.group === g.key);
                if (items.length === 0) return null;
                return (
                  <div key={g.key} className="mb-2">
                    <p className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-slate/40">{g.label}</p>
                    <ul>
                      {items.map((dest) => {
                        const Icon = dest.icon;
                        const isActive =
                          dest.page !== 'home'
                            ? activePage === dest.page
                            : activePage === 'home' && activeSection === dest.id;
                        return (
                          <li key={dest.id}>
                            <button
                              type="button"
                              onClick={() => handleSelect(dest)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                                isActive ? 'bg-emerald-500/15 text-emerald-200' : 'text-slate/80 hover:bg-white/6 hover:text-white'
                              }`}
                            >
                              <Icon className="w-4 h-4 shrink-0 opacity-70" />
                              <span className="text-sm font-body flex-1">{dest.label}</span>
                              <span className="text-[10px] font-mono text-slate/30">{dest.href}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate/40">No matches for &ldquo;{query}&rdquo;</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
