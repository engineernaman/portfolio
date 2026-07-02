import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Radar, Sparkles } from 'lucide-react';
import AnimatedButton from '@/components/ui/animated-button';
import { TextReveal } from '@/lib/animmaster';
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
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 24]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={sectionRef} id="home" className="relative min-h-screen overflow-hidden pointer-events-none">
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch min-h-screen">
        <motion.div
          style={{ y: cardY, opacity: cardOpacity }}
          className="w-full lg:w-[min(100%,520px)] shrink-0 px-6 sm:px-10 lg:px-12 pt-32 pb-16 flex items-center pointer-events-auto"
        >
          <div className="w-full rounded-2xl border border-white/12 bg-[rgba(4,8,14,0.88)] backdrop-blur-xl p-7 sm:p-9 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <p className="font-mono text-[11px] tracking-[0.24em] text-emerald-400/80 uppercase mb-6 flex items-center gap-2">
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
              <span className="text-emerald-400/90">Gov:</span> {governmentClientsSummary}
            </p>

            <div className="flex flex-wrap gap-3 mb-7">
              <AnimatedButton
                as="a"
                href="#experience"
                className="!bg-[rgba(6,10,16,0.9)] !border-emerald-500/25 !text-emerald-300 text-xs uppercase tracking-widest"
              >
                Experience
              </AnimatedButton>
              <AnimatedButton
                onClick={openIntelLab}
                className="!bg-[rgba(6,10,16,0.9)] !border-violet-500/25 !text-violet-300 text-xs uppercase tracking-widest"
              >
                Intel Lab
              </AnimatedButton>
              <AnimatedButton
                as="a"
                href="#visitor-scan"
                className="!bg-[rgba(6,10,16,0.9)] !border-cyan-500/25 !text-cyan-300 text-xs uppercase tracking-widest"
              >
                <Radar className="w-3.5 h-3.5 mr-1.5 inline" />
                Scan
              </AnimatedButton>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {heroStats.map((s) => (
                <div key={s.label} className="rounded-lg border border-white/8 bg-black/30 px-3 py-3 text-center">
                  <div className="font-display text-lg font-bold text-readable">{s.value}</div>
                  <div className="text-[9px] text-readable-dim font-mono uppercase mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2 border-t border-white/8">
              <SkiperLink href="#speaking">Speaking</SkiperLink>
              <SkiperLink href="#research" variant="center">Research</SkiperLink>
              <SkiperLink href="#contact" variant="height">Contact</SkiperLink>
            </div>
          </div>
        </motion.div>

        <div className="hidden lg:flex flex-1 items-center justify-center px-4 lg:px-6 xl:pr-8 pt-24 pb-12 min-h-[420px] pointer-events-auto">
          <HeroRightStage reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
};

export default HeroExperience;
