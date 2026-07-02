import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setGlobalScrollProgress } from '../lib/scrollState';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(enabled = true, reducedMotion = false) {
  useEffect(() => {
    if (!enabled) return;

    const apply = (value: number) => {
      const v = Math.min(1, Math.max(0, value));
      setGlobalScrollProgress(v);
      document.documentElement.style.setProperty('--scroll-progress', String(v));
    };

    const syncWindow = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      apply(limit > 0 ? window.scrollY / limit : 0);
    };

    if (reducedMotion) {
      syncWindow();
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => apply(self.progress),
      });
      window.addEventListener('resize', () => ScrollTrigger.refresh());
      return () => {
        st.kill();
        document.documentElement.style.removeProperty('--scroll-progress');
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => apply(self.progress),
    });

    apply(0);

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      st.kill();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      document.documentElement.style.removeProperty('--scroll-progress');
    };
  }, [enabled, reducedMotion]);
}
