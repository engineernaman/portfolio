import { useState, useEffect } from 'react';
import React from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, reducedMotion = false }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete, reducedMotion]);

  return (
    <div className="fixed inset-0 bg-void z-[200] flex items-center justify-center font-mono">
      <div className="text-center w-72 p-8 border border-white/10 rounded-xl bg-black/80">
        <p className="text-white text-lg font-display font-bold mb-1">SoumySec</p>
        <p className="text-slate/50 text-[10px] tracking-[0.3em] mb-2">LOADING</p>
        <p className="text-cyan-400/50 text-[9px] tracking-wide mb-6">Threat Intel Lab ready on entry</p>
        <div className="w-full h-px bg-white/10 overflow-hidden">
          <div
            className="h-full bg-emerald-500/80 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={onComplete}
          className="mt-6 text-[10px] text-slate/40 hover:text-emerald-400 transition-colors tracking-widest"
        >
          skip
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;
