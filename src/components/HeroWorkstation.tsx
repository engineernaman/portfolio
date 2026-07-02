import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';
import {
  BOOK_COVER_IMAGE,
  BOOK_SUBTITLE,
  BOOK_TITLE,
  leaderThoughts,
} from '@/data/leaderThoughts';

const slides = [
  {
    title: BOOK_TITLE,
    body: BOOK_SUBTITLE,
    meta: `${leaderThoughts.length} principles · edit in leaderThoughts.ts`,
    image: BOOK_COVER_IMAGE,
    isCover: true,
  },
  ...leaderThoughts.map((t, i) => ({
    title: t.title,
    body: t.thought,
    meta: t.source,
    image: t.image,
    index: i + 1,
  })),
];

interface HeroWorkstationProps {
  reducedMotion?: boolean;
}

/** Operator desk — readable monitor screen, full images, clear quote navigation */
const HeroWorkstation = ({ reducedMotion = false }: HeroWorkstationProps) => {
  const [page, setPage] = useState(0);
  const max = slides.length - 1;
  const slide = slides[page];

  const step = useCallback((d: 1 | -1) => {
    setPage((p) => Math.min(max, Math.max(0, p + d)));
  }, [max]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-2">
      <p className="font-mono text-[9px] tracking-[0.2em] text-emerald-400/80 uppercase text-center mb-3">
        Operator workstation
      </p>

      {/* desk + operator silhouette (CSS) — monitor stays unobstructed */}
      <div className="relative w-full max-w-[min(100%,560px)] lg:max-w-[min(100%,600px)]">
        {/* operator — left side, behind monitor plane */}
        <div
          className="absolute -left-2 bottom-[18%] w-[38%] h-[55%] pointer-events-none opacity-90"
          aria-hidden
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[12%] rounded bg-[#0f172a] border border-white/5" />
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[45%] h-[38%] rounded-t-full bg-[#1e293b]" />
          <div className="absolute bottom-[42%] left-1/2 -translate-x-1/2 w-[28%] h-[22%] rounded-full bg-[#334155]" />
          <div className="absolute bottom-[22%] left-[18%] w-[22%] h-[8%] rounded-full bg-[#1e293b] rotate-[25deg]" />
          <div className="absolute bottom-[22%] right-[18%] w-[22%] h-[8%] rounded-full bg-[#1e293b] -rotate-[25deg]" />
        </div>

        {/* monitor */}
        <div className="relative mx-auto w-[96%] z-10">
          <div className="rounded-lg border border-emerald-500/30 bg-[#0a0f16] p-2.5 shadow-[0_0_50px_rgba(52,211,153,0.15)]">
            <div className="rounded border border-white/10 bg-[#020617] overflow-hidden aspect-[4/3] flex flex-col min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]">
              <div className="relative flex-[1.15] min-h-0 bg-[#0f172a] flex items-center justify-center p-1">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide.image}
                    src={slide.image}
                    alt=""
                    initial={reducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </AnimatePresence>
              </div>

              {/* quote strip */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 border-t border-emerald-500/25 bg-[#020617] px-4 py-3 max-h-[36%] overflow-y-auto"
                >
                  {!slide.isCover && (
                    <p className="font-mono text-[8px] tracking-widest text-emerald-500 mb-1">
                      PRINCIPLE {slide.index}
                    </p>
                  )}
                  <p className="font-display text-base font-bold text-white leading-snug">{slide.title}</p>
                  <p className="text-xs text-slate-200 leading-relaxed mt-1.5">{slide.body}</p>
                  {slide.meta && (
                    <p className="text-[10px] text-emerald-400/80 mt-1.5 font-mono">— {slide.meta}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="mx-auto w-3 h-5 bg-[#1e293b] rounded-b-sm" />
          <div className="mx-auto w-24 h-1.5 bg-[#0f172a] rounded-full mt-0.5 border border-white/5" />
        </div>

        {/* keyboard on desk */}
        <div className="mx-auto mt-3 w-[55%] h-2 rounded bg-[#020617] border border-emerald-500/15 shadow-[0_0_12px_rgba(52,211,153,0.15)]" />
      </div>

      {/* quote controls — prominent */}
      <div className="w-full max-w-[min(100%,560px)] lg:max-w-[min(100%,600px)] mt-5 space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={page <= 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono uppercase tracking-wider disabled:opacity-30 hover:bg-emerald-500/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={page >= max}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono uppercase tracking-wider disabled:opacity-30 hover:bg-emerald-500/20 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === page ? 'w-6 bg-emerald-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <p className="text-center font-mono text-[9px] text-readable-dim flex items-center justify-center gap-1.5">
          <Keyboard className="w-3 h-3" />
          Arrow keys · {page === 0 ? 'Cover' : `${page} / ${max}`}
        </p>
      </div>
    </div>
  );
};

export default HeroWorkstation;
