import { useState, useEffect } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { getSectorLabel } from './three/SectionVignettes';
import { useApp } from '../context/AppContext';

const ImmersiveHud = () => {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);
  const sector = getSectorLabel(progress);
  const { openIntelLab } = useApp();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!pastHero) return null;

  return (
    <div className="fixed bottom-28 right-6 z-40 pointer-events-none font-mono text-[10px] tracking-wider text-readable-dim space-y-1 hidden md:block max-w-[200px]">
      <p className="text-emerald-400/80 uppercase tracking-[0.12em] font-medium">{sector}</p>
      <p>SCROLL · sectors · CLICK nodes · DRAG objects</p>
      <p className="text-readable-dim/60 tabular-nums">{pct.toString().padStart(3, '0')}% depth</p>
      <button
        type="button"
        onClick={openIntelLab}
        className="pointer-events-auto mt-2 px-2.5 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300/90 hover:bg-cyan-500/20 transition-colors"
      >
        Intel Lab →
      </button>
    </div>
  );
};

export default ImmersiveHud;
