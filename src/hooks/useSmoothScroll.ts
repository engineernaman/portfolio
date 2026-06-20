import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setGlobalScrollProgress } from '../lib/scrollState';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(enabled = true, reducedMotion = false) {
  useEffect(() => {
    if (!enabled) return;

    if (reducedMotion) {
      const update = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setGlobalScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
      return () => window.removeEventListener('scroll', update);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      setGlobalScrollProgress(limit > 0 ? scroll / limit : 0);
      ScrollTrigger.update();
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled, reducedMotion]);
}
