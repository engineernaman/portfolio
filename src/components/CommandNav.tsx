import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Command, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';
import { pageToHash, type SitePage } from '../data/siteNav';
import { useApp } from '../context/AppContext';
import NavUtilities from './NavUtilities';
import CommandPalette from './CommandPalette';
import ToolDock from './ToolDock';
import SectionRail from './SectionRail';

type CommandNavProps = {
  activePage: SitePage;
};

const PAGE_LABELS: Record<SitePage, string> = {
  home: 'Portfolio',
  music: 'Music Studio',
  cyberchef: 'CyberChef',
};

const CommandNav = ({ activePage }: CommandNavProps) => {
  const { playTypingSound, openIntelLab } = useApp();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (activePage !== 'home') return;
      const ids = ['home', 'about', 'experience', 'ventures', 'speaking', 'research', 'training', 'recognition', 'contact'];
      const pos = window.scrollY + 160;
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

  const locationLabel =
    activePage === 'home'
      ? activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
      : PAGE_LABELS[activePage];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-colors duration-300 ${
          scrolled || activePage !== 'home' ? 'py-2' : 'py-3'
        }`}
        initial={false}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex items-center justify-between gap-3">
          <a
            href={pageToHash('home')}
            className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full border border-white/8 bg-[rgba(8,12,18,0.75)] backdrop-blur-xl shadow-lg hover:border-emerald-500/25 transition-colors group"
          >
            <Shield className="w-4 h-4 text-emerald-400 group-hover:text-cyan-400 transition-colors" />
            <span className="font-display text-xs sm:text-sm font-bold text-readable hidden sm:inline">{profile.brand}</span>
          </a>

          <button
            type="button"
            onClick={() => {
              playTypingSound();
              setPaletteOpen(true);
            }}
            className="pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-[rgba(8,12,18,0.8)] backdrop-blur-xl shadow-lg hover:border-emerald-500/30 transition-all group max-w-[min(52vw,280px)]"
          >
            <Command className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
            <span className="text-xs text-slate/50 truncate hidden sm:inline">Navigate</span>
            <span className="text-xs font-medium text-readable truncate">{locationLabel}</span>
            <kbd className="hidden md:inline text-[9px] font-mono text-slate/35 border border-white/10 rounded px-1 py-px shrink-0">⌘K</kbd>
          </button>

          <div className="pointer-events-auto flex items-center gap-1.5">
            <a
              href="#contact"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-emerald-500/25 bg-[rgba(8,12,18,0.75)] backdrop-blur-xl text-emerald-300 hover:bg-emerald-500/15 transition-colors"
              aria-label="Contact"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full border border-white/8 bg-[rgba(8,12,18,0.75)] backdrop-blur-xl">
              <NavUtilities />
            </div>
          </div>
        </div>
      </motion.header>

      {activePage === 'home' && <SectionRail activeSection={activeSection} />}

      <ToolDock activePage={activePage} onOpenPalette={() => setPaletteOpen(true)} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        activePage={activePage}
        activeSection={activeSection}
        onIntelLab={() => {
          openIntelLab();
          setPaletteOpen(false);
        }}
      />
    </>
  );
};

export default CommandNav;
