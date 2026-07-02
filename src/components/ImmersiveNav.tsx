import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Sparkles,
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
} from 'lucide-react';
import { profile, sections } from '../data/portfolio';
import { TOOL_PAGES, pageToHash, type SitePage } from '../data/siteNav';
import { useApp } from '../context/AppContext';
import NavUtilities from './NavUtilities';
import SectionRail from './SectionRail';

const SECTION_ICONS: Record<string, typeof Home> = {
  about: User,
  experience: Briefcase,
  ventures: Rocket,
  speaking: Mic2,
  research: FlaskConical,
  training: GraduationCap,
  recognition: Award,
  contact: Mail,
};

const PORTAL_ITEMS = [
  { id: 'home', label: 'Home', href: '#home', icon: Home, accent: 'from-emerald-500/20 to-cyan-500/10' },
  ...sections.map((s) => ({
    id: s.id,
    label: s.label,
    href: `#${s.id}`,
    icon: SECTION_ICONS[s.id] ?? User,
    accent: s.number && Number(s.number) % 2 === 0 ? 'from-cyan-500/20 to-emerald-500/10' : 'from-emerald-500/20 to-violet-500/10',
  })),
];

const TOOL_ITEMS = TOOL_PAGES.map((p) => ({
  id: p.id,
  label: p.label,
  href: p.hash,
  icon: p.id === 'music' ? Music : ChefHat,
  page: p.id as SitePage,
}));

type ImmersiveNavProps = {
  activePage: SitePage;
};

const ImmersiveNav = ({ activePage }: ImmersiveNavProps) => {
  const { playTypingSound, openIntelLab } = useApp();
  const [portalOpen, setPortalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      if (activePage !== 'home') return;
      const ids = ['home', ...sections.map((s) => s.id)];
      const pos = window.scrollY + 180;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [activePage]);

  useEffect(() => {
    if (!portalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPortalOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [portalOpen]);

  const navigate = (href: string, isIntel?: boolean) => {
    playTypingSound();
    setPortalOpen(false);
    if (isIntel) {
      openIntelLab();
      return;
    }
    const id = href.replace('#', '');
    window.location.hash = id;
    if (activePage === 'home' || id === 'music' || id === 'cyberchef') {
      requestAnimationFrame(() => {
        if (id !== 'music' && id !== 'cyberchef') {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 sm:px-6 transition-all duration-300 ${
          scrolled ? 'py-2.5 bg-[rgba(1,2,8,0.92)] backdrop-blur-xl border-b border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.45)]' : 'py-3.5'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <a href={pageToHash('home')} className="pointer-events-auto flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-md group-hover:bg-cyan-500/30 transition-colors" />
              <div className="relative w-9 h-9 rounded-full border border-emerald-500/40 bg-[rgba(6,10,16,0.85)] backdrop-blur-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <span className="font-display text-sm font-bold text-readable hidden sm:block">{profile.brand}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              playTypingSound();
              setPortalOpen(true);
            }}
            className="pointer-events-auto group relative overflow-hidden px-5 py-2.5 rounded-full border border-emerald-500/30 bg-[rgba(6,10,16,0.8)] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/15 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              Explore
            </span>
          </button>

          <div className="pointer-events-auto flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-white/8 bg-[rgba(6,10,16,0.8)] backdrop-blur-xl">
            <NavUtilities />
          </div>
        </div>
      </header>

      {activePage === 'home' && <SectionRail activeSection={activeSection} />}

      <AnimatePresence>
        {portalOpen && (
          <motion.div
            className="fixed inset-0 z-[90] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#010208]/92 backdrop-blur-2xl" onClick={() => setPortalOpen(false)} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(52,211,153,0.12),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(34,211,238,0.08),transparent_50%)]" />

            <motion.div
              className="relative h-full overflow-y-auto px-4 sm:px-8 py-16 sm:py-20"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="max-w-5xl mx-auto">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-400/70 mb-2">Navigation portal</p>
                    <h2 className="font-display text-3xl sm:text-5xl font-bold text-readable">Where to?</h2>
                  </div>
                  <button type="button" onClick={() => setPortalOpen(false)} className="p-2 rounded-full border border-white/10 text-slate/50 hover:text-white" aria-label="Close">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-[10px] font-mono uppercase tracking-widest text-slate/40 mb-4">Portfolio</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
                  {PORTAL_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate(item.href)}
                        className={`group text-left p-4 rounded-2xl border border-white/10 bg-gradient-to-br ${item.accent} hover:border-emerald-500/35 hover:scale-[1.02] transition-all duration-300`}
                      >
                        <Icon className="w-5 h-5 text-emerald-400/80 mb-3 group-hover:text-emerald-300 transition-colors" />
                        <span className="block text-sm font-medium text-readable">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <p className="text-[10px] font-mono uppercase tracking-widest text-slate/40 mb-4">Tools & labs</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TOOL_ITEMS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => navigate(tool.href)}
                        className="group p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/35 text-left transition-all"
                      >
                        <Icon className="w-5 h-5 text-cyan-400 mb-2" />
                        <span className="text-sm text-readable">{tool.label}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => navigate('#intel-lab', true)}
                    className="group p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 text-left transition-all"
                  >
                    <FlaskConical className="w-5 h-5 text-violet-400 mb-2" />
                    <span className="text-sm text-readable">Intel Lab</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('#visitor-scan')}
                    className="group p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-left transition-all"
                  >
                    <Radar className="w-5 h-5 text-emerald-400 mb-2" />
                    <span className="text-sm text-readable">Scan me</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImmersiveNav;
