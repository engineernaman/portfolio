import { useEffect } from 'react';
import Lenis from 'lenis';
import { setGlobalScrollProgress } from '../lib/scrollState';
import 'lenis/dist/lenis.css';

export function useSmoothScroll(enabled = true, reducedMotion = false) {
  useEffect(() => {
    if (!enabled) return;

    const syncFromWindow = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setGlobalScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };

    if (reducedMotion) {
      syncFromWindow();
      window.addEventListener('scroll', syncFromWindow, { passive: true });
      window.addEventListener('resize', syncFromWindow);
      return () => {
        window.removeEventListener('scroll', syncFromWindow);
        window.removeEventListener('resize', syncFromWindow);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });

    const onScroll = (instance: Lenis) => {
      const p = instance.progress ?? (instance.limit > 0 ? instance.scroll / instance.limit : 0);
      setGlobalScrollProgress(p);
      document.documentElement.style.setProperty('--scroll-progress', String(p));
    };

    lenis.on('scroll', onScroll);
    onScroll(lenis);

    window.addEventListener('resize', () => {
      lenis.resize();
      onScroll(lenis);
    });

    return () => {
      lenis.destroy();
      document.documentElement.style.removeProperty('--scroll-progress');
    };
  }, [enabled, reducedMotion]);
}
