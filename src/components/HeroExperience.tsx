import { useEffect, useRef } from 'react';
import { FlaskConical, Radar } from 'lucide-react';
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
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-0 lg:pb-0">
      <div className="relative z-20 w-full max-w-xl px-6 sm:px-10 lg:px-12 lg:pl-14 py-8 pointer-events-none">
        <div
          className="rounded-2xl border border-emerald-500/20 bg-[rgba(10,14,22,0.96)] backdrop-blur-md p-6 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
        >
          <p className="hero-line font-mono text-[11px] tracking-[0.2em] text-emerald-400 uppercase mb-5 opacity-0 font-medium">
            {profile.brand} · security & technology
          </p>

          <h1 className="font-display text-[clamp(2rem,6.5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-4">
            <span className="hero-line block opacity-0 text-readable">Soumy Naman</span>
            <span className="hero-line block opacity-0 text-emerald-400 mt-1">Srivastava</span>
          </h1>

          <p className="hero-role opacity-0 text-base text-readable-muted font-body leading-relaxed mb-1">
            {profile.roles[0]}
          </p>
          <p className="hero-role opacity-0 text-sm text-readable-dim font-body mb-6">
            {profile.roles.slice(1).join(' · ')}
          </p>

          <p className="hero-line font-body text-base text-readable-muted leading-relaxed mb-4 opacity-0">
            {profile.tagline}
          </p>

          <p
            className="hero-line text-sm text-readable-muted leading-relaxed mb-6 opacity-0 font-body border border-white/10 rounded-lg p-3.5 bg-black/40 line-clamp-3"
            title={governmentClientsSummary}
          >
            <span className="text-emerald-400 font-medium">Gov clients:</span> {governmentClientsSummary}
          </p>

          <div className="flex flex-wrap gap-3 mb-6 pointer-events-auto">
            <MagneticButton href="#experience">View experience</MagneticButton>
            <MagneticButton href="#speaking" variant="ghost">Speaking</MagneticButton>
            <button
              type="button"
              onClick={openIntelLab}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-cyan-400 font-mono text-xs tracking-wide hover:bg-cyan-500/20 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Intel Lab
            </button>
            <a
              href="#visitor-scan"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-emerald-300 font-mono text-xs tracking-wide hover:bg-emerald-500/20 transition-colors"
            >
              <Radar className="w-3.5 h-3.5" />
              Scan me
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="hero-stat opacity-0 rounded-lg border border-white/10 bg-black/30 p-3 sm:p-4 text-center"
              >
                <div className="font-display text-xl sm:text-2xl font-bold text-readable">{s.value}</div>
                <div className="text-[10px] text-readable-dim font-body font-medium mt-1.5 leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] tracking-[0.25em] text-emerald-400/50 font-mono uppercase">
            scroll ↓ · enter the grid
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroExperience;
