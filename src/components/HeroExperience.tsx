import { useEffect, useRef } from 'react';
import { FlaskConical } from 'lucide-react';
import { animate, stagger } from 'animejs';
import MagneticButton from './ui/MagneticButton';
import { useApp } from '../context/AppContext';
import { profile, heroStats, governmentClientsSummary } from '../data/portfolio';

const HeroExperience = () => {
  const played = useRef(false);
  const { openIntelLab } = useApp();

  useEffect(() => {
    if (played.current) return;
    played.current = true;

    animate('.hero-line', {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(45),
      duration: 600,
      ease: 'outCubic',
    });

    animate('.hero-role', {
      opacity: [0, 1],
      delay: stagger(40, { start: 350 }),
      duration: 500,
      ease: 'outCubic',
    });

    animate('.hero-stat', {
      opacity: [0, 1],
      delay: stagger(60, { start: 650 }),
      duration: 450,
      ease: 'outCubic',
    });
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center lg:justify-start">
      <div className="relative z-20 w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-xl px-6 sm:px-10 lg:px-14 py-28 lg:py-0 pointer-events-none">
        <div
          className="rounded-2xl border border-emerald-500/15 bg-void/70 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_60px_rgba(52,211,153,0.06)]"
        >
          <p className="hero-line font-mono text-[10px] tracking-[0.25em] text-emerald-400/80 uppercase mb-5 opacity-0">
            {profile.brand} · security & technology
          </p>

          <h1 className="font-display text-[clamp(2.25rem,7vw,4rem)] font-bold leading-[1.08] tracking-tight mb-4">
            <span className="hero-line block opacity-0 text-white">Soumy Naman</span>
            <span className="hero-line block opacity-0 text-emerald-400 mt-1">Srivastava</span>
          </h1>

          <div className="space-y-1.5 mb-6">
            {profile.roles.map((role) => (
              <p key={role} className="hero-role opacity-0 text-sm text-slate/90 font-body">
                {role}
              </p>
            ))}
          </div>

          <p className="hero-line font-body text-sm text-slate/70 leading-relaxed mb-4 opacity-0">
            {profile.tagline}
          </p>

          <p className="hero-line text-xs text-slate/50 leading-relaxed mb-8 opacity-0 font-mono border border-white/[0.06] rounded-lg p-3 bg-black/30">
            <span className="text-emerald-400/90">Gov clients:</span> {governmentClientsSummary}
          </p>

          <div className="flex flex-wrap gap-3 mb-8 pointer-events-auto">
            <MagneticButton href="#experience">View experience</MagneticButton>
            <MagneticButton href="#speaking" variant="ghost">Speaking</MagneticButton>
            <button
              type="button"
              onClick={openIntelLab}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-cyan-400 font-mono text-xs tracking-wide hover:bg-cyan-500/20 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Threat Intel Lab
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="hero-stat opacity-0 rounded-lg border border-white/[0.08] bg-black/25 p-3 sm:p-4 text-center"
              >
                <div className="font-mono text-lg sm:text-2xl font-semibold text-white">{s.value}</div>
                <div className="font-mono text-[9px] text-slate/50 uppercase tracking-wider mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-14 lg:translate-x-0 z-20 pointer-events-none font-mono text-[10px] tracking-[0.3em] text-emerald-400/40 animate-pulse">
        scroll ↓ · enter the grid
      </div>
    </section>
  );
};

export default HeroExperience;
