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

/** Full-viewport scroll-linked grid + particles — always visible behind content */
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
      particles = Array.from({ length: reducedMotion ? 48 : 100 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const p = progressRef.current;
      const grid = 48;
      const driftY = p * h * 0.5;
      const driftX = p * 40;

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.12)';
      ctx.lineWidth = 1;
      for (let x = -driftX % grid; x < w; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = -driftY % grid; y < h; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
      for (let i = 0; i < 14; i++) {
        const offset = i * 72 - driftY * 0.3;
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset + w * 0.35, h);
        ctx.stroke();
      }

      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy - p * 0.8;
        if (pt.x < 0) pt.x = w;
        if (pt.x > w) pt.x = 0;
        if (pt.y < 0) pt.y = h;
        if (pt.y > h) pt.y = 0;
        ctx.fillStyle = `rgba(52, 211, 153, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const scanY = (performance.now() * 0.05 + p * h) % h;
      const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      grad.addColorStop(0, 'rgba(34, 211, 238, 0)');
      grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.12)');
      grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 50, w, 100);

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
        className="absolute inset-0 opacity-100"
        style={{ transform: 'translateY(calc(var(--scroll-progress, 0) * -12vh))' }}
      >
        <div
          className="absolute top-[8%] right-[15%] w-[min(42vw,420px)] h-[min(42vw,420px)] rounded-full blur-3xl motion-orb-emerald motion-orb-animate"
          style={{ opacity: 0.45 }}
        />
        <div
          className="absolute bottom-[15%] left-[10%] w-[min(30vw,300px)] h-[min(30vw,300px)] rounded-full blur-3xl motion-orb-cyan motion-orb-animate-slow"
          style={{ opacity: 0.35 }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
};

export default HomeScrollBackdrop;
