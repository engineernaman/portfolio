import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FlaskConical, Radar, Sparkles, ChevronDown } from 'lucide-react';
import MagneticButton from './ui/MagneticButton';
import HeroRightStage from './HeroRightStage';
import { useApp } from '../context/AppContext';
import { profile, heroStats, governmentClientsSummary } from '../data/portfolio';

interface HeroExperienceProps {
  reducedMotion?: boolean;
}

const HeroExperience = ({ reducedMotion = false }: HeroExperienceProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { openIntelLab } = useApp();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 40]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 24]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen">
      <div className="flex flex-col lg:flex-row items-stretch min-h-screen">
        {/* Left — identity card */}
        <motion.div
          style={{ y: cardY, opacity: cardOpacity }}
          className="relative z-20 w-full lg:w-[min(100%,520px)] xl:w-[min(100%,560px)] shrink-0 px-6 sm:px-10 lg:px-12 xl:px-14 pt-32 pb-8 lg:pb-16 pointer-events-none flex items-center"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-emerald-500/30 bg-[rgba(6,10,16,0.9)] backdrop-blur-xl p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.55)] pointer-events-auto w-full"
          >
            <p className="font-mono text-[11px] tracking-[0.22em] text-emerald-400 uppercase mb-5 font-medium flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              {profile.brand} · next-gen tech leadership
            </p>

            <h1 className="font-display text-[clamp(2rem,5.5vw,3.6rem)] font-bold leading-[1.08] tracking-tight mb-4">
              <span className="block text-readable">Soumy Naman</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent mt-1">
                Srivastava
              </span>
            </h1>

            <p className="text-lg text-readable font-body leading-snug mb-1">Cybersecurity &amp; Technology Leader</p>
            <p className="text-sm text-readable-dim font-body mb-6">{profile.roles.slice(1).join(' · ')}</p>
            <p className="font-body text-base text-readable-muted leading-relaxed mb-4">{profile.tagline}</p>

            <p
              className="text-sm text-readable-muted leading-relaxed mb-6 font-body border border-white/10 rounded-lg p-3.5 bg-black/35 line-clamp-3"
              title={governmentClientsSummary}
            >
              <span className="text-emerald-400 font-medium">Gov clients:</span> {governmentClientsSummary}
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
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
              {heroStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  className="rounded-lg border border-white/10 bg-black/30 p-3 sm:p-4 text-center"
                >
                  <div className="font-display text-xl sm:text-2xl font-bold text-readable">{s.value}</div>
                  <div className="text-[10px] text-readable-dim font-body font-medium mt-1.5">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <p className="text-[10px] tracking-[0.28em] text-emerald-400/60 font-mono uppercase flex items-center gap-2">
              scroll <ChevronDown className="w-3 h-3 animate-bounce" /> · explore the live command core →
            </p>
          </motion.div>
        </motion.div>

        {/* Right — 3D stage + live HUD */}
        <motion.div
          style={{ y: stageY, opacity: stageOpacity }}
          className="relative z-20 flex-1 px-6 sm:px-10 lg:px-6 lg:pr-12 xl:pr-14 pt-4 lg:pt-32 pb-12 lg:pb-16 min-h-[480px]"
        >
          <HeroRightStage reducedMotion={reducedMotion} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroExperience;
