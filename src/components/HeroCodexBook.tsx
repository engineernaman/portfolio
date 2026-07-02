import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BOOK_COVER_IMAGE,
  BOOK_SUBTITLE,
  BOOK_TITLE,
  leaderThoughts,
} from '@/data/leaderThoughts';

const pages = [
  {
    title: BOOK_TITLE,
    body: BOOK_SUBTITLE,
    meta: `${leaderThoughts.length} principles`,
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

interface HeroCodexBookProps {
  reducedMotion?: boolean;
}

/** Reliable 2D codex — text and images on the page, no extra HTML box */
const HeroCodexBook = ({ reducedMotion = false }: HeroCodexBookProps) => {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(0);
  const max = pages.length - 1;
  const content = pages[page];

  const flip = (nextDir: 1 | -1) => {
    const next = page + nextDir;
    if (next < 0 || next > max) return;
    setDir(nextDir);
    setPage(next);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="font-mono text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase text-center mb-3">
        The Operator&apos;s Codex · flip the pages
      </p>

      <div className="relative w-[min(100%,300px)] aspect-[3/4] [perspective:1200px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            initial={reducedMotion ? false : { rotateY: dir >= 0 ? 28 : -28, opacity: 0.4 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={reducedMotion ? undefined : { rotateY: dir >= 0 ? -28 : 28, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 rounded-sm overflow-hidden border border-emerald-900/30 shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            style={{ transformStyle: 'preserve-3d', background: '#f4f7f5' }}
          >
            {content.image && (
              <img src={content.image} alt="" className="w-full h-[32%] object-cover" />
            )}
            <div className="p-4 h-[68%] flex flex-col text-[#0f172a]">
              {content.isCover ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <h2 className="font-display text-lg font-bold leading-tight">{content.title}</h2>
                  <p className="font-mono text-xs text-emerald-800">{content.body}</p>
                  <p className="text-[10px] text-slate-500 mt-2">{content.meta}</p>
                </div>
              ) : (
                <>
                  <p className="font-mono text-[9px] tracking-widest text-emerald-800 mb-2">
                    PRINCIPLE {content.index}
                  </p>
                  <h3 className="font-display text-sm font-bold leading-snug mb-2">{content.title}</h3>
                  <p className="text-[11px] leading-relaxed text-slate-600 flex-1 overflow-y-auto">{content.body}</p>
                  {content.meta && (
                    <p className="text-[10px] text-emerald-800 pt-2 mt-2 border-t border-emerald-900/15">
                      — {content.meta}
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#022c22] to-[#041a12] rounded-l-sm shadow-[inset_-2px_0_8px_rgba(52,211,153,0.25)]" />
      </div>

      <div className="flex items-center justify-between gap-3 w-full max-w-[300px] mt-4">
        <button
          type="button"
          onClick={() => flip(-1)}
          disabled={page <= 0}
          className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="font-mono text-[10px] text-readable-dim text-center flex-1">
          {page === 0 ? 'Cover' : `Page ${page} / ${max}`}
        </p>
        <button
          type="button"
          onClick={() => flip(1)}
          disabled={page >= max}
          className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HeroCodexBook;
