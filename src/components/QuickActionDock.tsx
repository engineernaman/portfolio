import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Terminal,
  FlaskConical,
  Radar,
  ChefHat,
  Pause,
  Play,
  X,
  Grip,
} from 'lucide-react';
import AnimatedButton from '@/components/ui/animated-button';
import { useMusic } from '../context/MusicContext';
import { useApp } from '../context/AppContext';
import { useSitePage } from '../hooks/useSitePage';
import { pageToHash } from '../data/siteNav';

const QuickActionDock = () => {
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);
  const { openIntelLab, openTerminal } = useApp();
  const { page } = useSitePage();
  const {
    current,
    playing,
    hasActiveTrack,
    togglePlay,
    stop,
  } = useMusic();

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const items = [
    {
      id: 'music',
      label: hasActiveTrack ? (playing ? 'Pause music' : 'Play music') : 'Music studio',
      icon: hasActiveTrack ? (playing ? Pause : Play) : Music,
      onClick: () => {
        if (hasActiveTrack) togglePlay();
        else window.location.hash = 'music';
        setOpen(false);
      },
      accent: 'text-emerald-400 border-emerald-500/35 hover:bg-emerald-500/15',
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: Terminal,
      onClick: () => {
        openTerminal();
        setOpen(false);
      },
      accent: 'text-violet-400 border-violet-500/35 hover:bg-violet-500/15',
    },
    {
      id: 'intel',
      label: 'Intel Lab',
      icon: FlaskConical,
      onClick: () => {
        openIntelLab();
        setOpen(false);
      },
      accent: 'text-cyan-400 border-cyan-500/35 hover:bg-cyan-500/15',
    },
    {
      id: 'scan',
      label: 'Scan me',
      icon: Radar,
      onClick: () => {
        document.getElementById('visitor-scan')?.scrollIntoView({ behavior: 'smooth' });
        setOpen(false);
      },
      accent: 'text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/10',
    },
    {
      id: 'cyberchef',
      label: 'CyberChef',
      icon: ChefHat,
      onClick: () => {
        window.location.hash = 'cyberchef';
        setOpen(false);
      },
      accent: 'text-amber-300 border-amber-500/30 hover:bg-amber-500/10',
    },
  ];

  if (page !== 'home' && page !== 'music' && page !== 'cyberchef') return null;

  return (
    <div
      ref={dockRef}
      className="fixed bottom-5 right-5 z-[65] pointer-events-auto flex flex-col items-end gap-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Now playing strip — above dock */}
      <AnimatePresence>
        {hasActiveTrack && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/25 bg-[rgba(6,10,16,0.92)] backdrop-blur-xl max-w-[220px]"
          >
            <button type="button" onClick={togglePlay} className="text-emerald-400 shrink-0" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-white truncate font-medium">{current?.title}</p>
              <p className="text-[9px] text-slate/50 truncate">{current?.artist}</p>
            </div>
            <button type="button" onClick={stop} className="text-slate/40 hover:text-rose-400" aria-label="Stop">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup menu — stacks upward */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col-reverse gap-1.5 mb-1"
          >
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={item.onClick}
                  className={`flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-xl border backdrop-blur-xl bg-[rgba(6,10,16,0.94)] text-left transition-colors ${item.accent}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-mono whitespace-nowrap">{item.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <AnimatedButton
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="!w-12 !h-12 !p-0 !rounded-2xl !bg-[rgba(6,10,16,0.9)] !border-emerald-500/35 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        aria-label="Quick actions"
        aria-expanded={open}
      >
        <Grip className="w-5 h-5 text-emerald-400" />
      </AnimatedButton>
    </div>
  );
};

export default QuickActionDock;
