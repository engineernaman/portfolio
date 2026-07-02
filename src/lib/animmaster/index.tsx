import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Animmaster-style scroll reveal — GSAP ScrollTrigger */
export function Reveal({ children, className = '', delay = 0, y = 48 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        opacity: 0,
        duration: 0.95,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
}

/** Animmaster-style staggered text entrance */
export function TextReveal({ text, className = '', as: Tag = 'span' }: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = text;
      return;
    }

    const words = text.split(' ');
    el.innerHTML = words.map((w) => `<span class="inline-block overflow-hidden"><span class="inline-block word-inner">${w}&nbsp;</span></span>`).join('');

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.word-inner'), {
        y: '110%',
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [text]);

  return <Tag ref={ref as never} className={className} />;
}

interface MouseSpotlightProps {
  className?: string;
}

/** Animmaster-style cursor spotlight on hero */
export function MouseSpotlight({ className = '' }: MouseSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(el, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none fixed z-[1] w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl ${className}`}
      style={{
        background: 'radial-gradient(circle, rgba(52,211,153,0.35) 0%, rgba(34,211,238,0.12) 40%, transparent 70%)',
      }}
      aria-hidden
    />
  );
}
