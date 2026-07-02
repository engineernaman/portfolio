import { useState, useEffect } from 'react';
import React from 'react';
import AnimatedButton from '@/components/ui/animated-button';

interface LoadingScreenProps {
  onComplete: () => void;
  reducedMotion?: boolean;
}

const BOOT_LINES = [
  'Initializing WebGL command core…',
  'Loading holographic security grid…',
  'Syncing orbital speaking gallery…',
  'Calibrating scroll flight path…',
  'Nexus online — welcome.',
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, reducedMotion = false }) => {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setProgress(Math.min(p, 100));
      setLineIndex(Math.min(Math.floor(p / 20), BOOT_LINES.length - 1));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 350);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete, reducedMotion]);

  return (
    <div className="fixed inset-0 bg-void z-[200] flex items-center justify-center font-mono overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div className="text-center w-80 p-8 border border-emerald-500/25 rounded-2xl bg-[rgba(6,10,16,0.92)] backdrop-blur-xl shadow-[0_0_80px_rgba(52,211,153,0.12)] relative">
        <p className="text-white text-xl font-display font-bold mb-1 tracking-tight">SoumySec</p>
        <p className="text-emerald-400/60 text-[10px] tracking-[0.35em] mb-1">NEXUS BOOT</p>
        <p className="text-cyan-400/40 text-[9px] tracking-wide mb-6">Premium 3D ecosystem loading</p>

        <div className="w-full h-1 bg-white/5 overflow-hidden rounded-full mb-4">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500 transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[10px] text-emerald-400/70 tracking-wide min-h-[16px] mb-2 transition-opacity">
          {BOOT_LINES[lineIndex]}
        </p>
        <p className="text-[9px] text-slate/40 tabular-nums">{progress.toString().padStart(3, '0')}%</p>

        <AnimatedButton
          type="button"
          onClick={onComplete}
          className="mt-6 !text-[10px] !px-4 !py-2 !bg-transparent !border-white/10 !text-slate/50 hover:!text-emerald-400 tracking-widest uppercase"
        >
          skip intro
        </AnimatedButton>
      </div>
    </div>
  );
};

export default LoadingScreen;
