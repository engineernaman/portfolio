import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Radar, Sparkles } from 'lucide-react';
import { AnimatedRays } from '@/components/ui/animated-rays';
import AnimatedButton from '@/components/ui/animated-button';
import { TextReveal, MouseSpotlight } from '@/lib/animmaster';
import { SkiperLink } from '@/components/skiper/SkiperPrimitives';
import HeroRightStage from '@/components/HeroRightStage';
import { useApp } from '@/context/AppContext';
import { profile, heroStats, governmentClientsSummary } from '@/data/portfolio';

interface HeroExperienceProps {
  reducedMotion?: boolean;
}

const HeroExperience = ({ reducedMotion = false }: HeroExperienceProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { openIntelLab } = useApp();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 32]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen overflow-hidden">
      <MouseSpotlight />

      {/* Vengeance UI — ambient rays (hero only) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <AnimatedRays className="h-full min-h-screen" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch min-h-screen">
        <motion.div
          style={{ y: cardY, opacity: cardOpacity }}
          className="w-full lg:w-[min(100%,540px)] shrink-0 px-6 sm:px-10 lg:px-12 pt-32 pb-10 lg:pb-16 flex items-center"
        >
          <div className="w-full rounded-2xl border border-emerald-500/25 bg-[rgba(6,10,16,0.92)] backdrop-blur-2xl p-7 sm:p-9 shadow-[0_24px_100px_rgba(0,0,0,0.55)]">
            <p className="font-mono text-[11px] tracking-[0.24em] text-emerald-400 uppercase mb-6 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              {profile.brand}
            </p>

            <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-bold leading-[1.05] tracking-tight mb-3">
              <span className="block text-readable">Soumy Naman</span>
              <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Srivastava
              </span>
            </h1>

            <TextReveal
              as="p"
              text="Cybersecurity & Technology Leader — securing AI, cloud, and telecom at global scale."
              className="text-base text-readable-muted font-body leading-relaxed mb-6 max-w-md"
            />

            <p className="text-sm text-readable-dim font-body mb-5 line-clamp-2" title={governmentClientsSummary}>
              <span className="text-emerald-400">Gov:</span> {governmentClientsSummary}
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
              <AnimatedButton
                as="a"
                href="#experience"
                className="!bg-[rgba(6,10,16,0.9)] !border-emerald-500/30 !text-emerald-300 text-xs uppercase tracking-widest"
              >
                Experience
              </AnimatedButton>
              <AnimatedButton
                onClick={openIntelLab}
                className="!bg-[rgba(6,10,16,0.9)] !border-violet-500/30 !text-violet-300 text-xs uppercase tracking-widest"
              >
                Intel Lab
              </AnimatedButton>
              <AnimatedButton
                as="a"
                href="#visitor-scan"
                className="!bg-[rgba(6,10,16,0.9)] !border-cyan-500/30 !text-cyan-300 text-xs uppercase tracking-widest"
              >
                <Radar className="w-3.5 h-3.5 mr-1.5 inline" />
                Scan
              </AnimatedButton>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {heroStats.map((s) => (
                <div key={s.label} className="rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-center">
                  <div className="font-display text-lg font-bold text-readable">{s.value}</div>
                  <div className="text-[9px] text-readable-dim font-mono uppercase mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2 border-t border-white/10">
              <SkiperLink href="#speaking">Speaking</SkiperLink>
              <SkiperLink href="#research" variant="center">Research</SkiperLink>
              <SkiperLink href="#contact" variant="height">Contact</SkiperLink>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 px-6 lg:px-8 lg:pr-12 pt-6 lg:pt-28 pb-12 min-h-[420px] bg-[#010208]/80">
          <HeroRightStage reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
};

export default HeroExperience;
