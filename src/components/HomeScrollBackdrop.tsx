import { useEffect, useRef } from 'react';
import { subscribeScrollProgress } from '@/lib/scrollState';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface HomeScrollBackdropProps {
  reducedMotion?: boolean;
}

/** Always-on scroll-linked motion layer — visible behind content gaps */
const HomeScrollBackdrop = ({ reducedMotion = false }: HomeScrollBackdropProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => subscribeScrollProgress((p) => {
    progressRef.current = p;
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: reducedMotion ? 36 : 72 }, () => ({
        x: w * 0.35 + Math.random() * w * 0.65,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.45 + 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const p = progressRef.current;
      const originX = w * 0.32;
      const grid = 52;
      const driftY = p * h * 0.35;

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.06)';
      ctx.lineWidth = 1;
      for (let x = originX; x < w; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -driftY % grid; y < h; y += grid) {
        ctx.beginPath();
        ctx.moveTo(originX, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.07)';
      for (let i = 0; i < 10; i++) {
        const offset = originX + i * 64 - driftY * 0.2;
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset - h * 0.45, h);
        ctx.stroke();
      }

      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy - p * 0.6;
        if (pt.x < originX) pt.x = w;
        if (pt.x > w) pt.x = originX;
        if (pt.y < 0) pt.y = h;
        if (pt.y > h) pt.y = 0;
        ctx.fillStyle = `rgba(52, 211, 153, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const scanY = ((performance.now() * 0.04 + p * h) % h);
      const grad = ctx.createLinearGradient(originX, scanY - 40, originX, scanY + 40);
      grad.addColorStop(0, 'rgba(34, 211, 238, 0)');
      grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.08)');
      grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(originX, scanY - 40, w - originX, 80);

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    if (!reducedMotion) draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute inset-y-0 right-0 w-[68%] opacity-80"
        style={{ transform: 'translateY(calc(var(--scroll-progress, 0) * -8vh))' }}
      >
        <div
          className="absolute top-[10%] right-[12%] w-[min(38vw,380px)] h-[min(38vw,380px)] rounded-full blur-3xl motion-orb-emerald motion-orb-animate"
          style={{ opacity: 0.35 }}
        />
        <div
          className="absolute bottom-[20%] right-[28%] w-[min(24vw,240px)] h-[min(24vw,240px)] rounded-full blur-3xl motion-orb-cyan motion-orb-animate-slow"
          style={{ opacity: 0.28 }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};

export default HomeScrollBackdrop;
