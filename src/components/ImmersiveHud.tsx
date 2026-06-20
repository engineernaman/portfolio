import { useScrollProgress } from '../hooks/useScrollProgress';
import { getSectorLabel } from './three/SectionVignettes';
import { useApp } from '../context/AppContext';

const ImmersiveHud = () => {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);
  const sector = getSectorLabel(progress);
  const { openIntelLab } = useApp();

  return (
    <div className="fixed bottom-24 left-6 z-40 pointer-events-none font-mono text-[10px] tracking-wider text-slate/45 space-y-1 hidden sm:block">
      <p className="text-emerald-400/70 uppercase tracking-[0.15em]">{sector}</p>
      <p>SCROLL · traverse sectors</p>
      <p>CLICK · nodes to jump · DRAG · push objects</p>
      <p className="text-slate/30 tabular-nums">{pct.toString().padStart(3, '0')}% depth</p>
      <button
        type="button"
        onClick={openIntelLab}
        className="pointer-events-auto mt-2 px-2.5 py-1.5 rounded border border-cyan-500/25 bg-cyan-500/10 text-cyan-400/80 hover:bg-cyan-500/20 transition-colors"
      >
        Open Intel Lab →
      </button>
    </div>
  );
};

export default ImmersiveHud;
