import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SPEAKING_PHOTOS } from '@/data/speakingMedia';

const SpeakingGalleryRail = () => {
  const rail = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="p-2.5 rounded-full border border-white/15 bg-black/70 text-emerald-400 hover:bg-emerald-500/20 transition-colors backdrop-blur-sm"
          aria-label="Scroll gallery left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
        <button
          type="button"
          onClick={() => scroll(1)}
          className="p-2.5 rounded-full border border-white/15 bg-black/70 text-emerald-400 hover:bg-emerald-500/20 transition-colors backdrop-blur-sm"
          aria-label="Scroll gallery right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={rail}
        className="flex gap-5 sm:gap-6 overflow-x-auto overflow-y-hidden pb-4 px-2 sm:px-12 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(52,211,153,0.4)_transparent]"
      >
        {SPEAKING_PHOTOS.map((photo, i) => (
          <motion.figure
            key={photo.src}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.04, duration: 0.45 }}
            whileHover={{ y: -8, rotateY: -4, rotateX: 2 }}
            className="snap-center shrink-0 w-[min(82vw,340px)] sm:w-[min(42vw,380px)] lg:w-[min(32vw,420px)] [perspective:1000px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="group relative rounded-xl border border-emerald-500/20 bg-[rgba(4,8,14,0.88)] p-2 shadow-[0_16px_48px_rgba(0,0,0,0.45),0_0_24px_rgba(52,211,153,0.08)] transition-shadow hover:border-emerald-500/40 hover:shadow-[0_20px_56px_rgba(0,0,0,0.5),0_0_32px_rgba(52,211,153,0.15)]">
              <div className="rounded-lg overflow-hidden bg-[#0f172a] flex items-center justify-center min-h-[200px] max-h-[min(52vh,480px)]">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="w-full h-auto max-h-[min(52vh,480px)] object-contain"
                />
              </div>
              <figcaption className="px-3 py-3 border-t border-white/8">
                <p className="font-display text-sm font-semibold text-white leading-snug">{photo.caption}</p>
                <p className="font-mono text-[10px] text-emerald-400/90 mt-1 tracking-wide">
                  {String(i + 1).padStart(2, '0')} · Stage
                </p>
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </div>
  );
};

export default SpeakingGalleryRail;
