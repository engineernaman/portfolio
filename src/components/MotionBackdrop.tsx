import { useEffect, useRef } from 'react';

interface MotionBackdropProps {
  reducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

const MotionBackdrop = ({ reducedMotion = false }: MotionBackdropProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanRef = useRef(0);

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

      particles = Array.from({ length: reducedMotion ? 24 : 48 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.15,
      }));
    };

    const drawGrid = () => {
      const grid = 48;
      const originX = w * 0.38;

      ctx.strokeStyle = 'rgba(52, 211, 153, 0.04)';
      ctx.lineWidth = 1;
      for (let x = originX; x < w; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath();
        ctx.moveTo(originX, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.05)';
      for (let i = 0; i < 8; i++) {
        const offset = originX + i * 72;
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset - h * 0.55, h);
        ctx.stroke();
      }
    };

    const drawParticles = () => {
      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < w * 0.35) p.x = w;
          if (p.x > w) p.x = w * 0.35;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`;
        ctx.fill();
      }
    };

    const drawScan = () => {
      if (reducedMotion) return;
      scanRef.current = (scanRef.current + 0.6) % h;
      const sy = scanRef.current;
      const grad = ctx.createLinearGradient(0, sy - 50, 0, sy + 50);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.5, 'rgba(52, 211, 153, 0.07)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(w * 0.35, sy - 50, w, 100);
    };

    const drawTelemetry = () => {
      ctx.font = '500 9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.28)';
      const lines = [
        'MESH: ONLINE',
        'SECTOR: CYBER_OPS',
        'NODES: 6 LINKED',
        'THREAT: MONITORING',
      ];
      lines.forEach((line, i) => {
        ctx.fillText(line, w * 0.55, h * 0.22 + i * 15);
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      drawParticles();
      drawScan();
      drawTelemetry();
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    if (!reducedMotion) {
      const loop = () => {
        draw();
        animId = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#010208]" />

      <div
        className={`motion-orb motion-orb-emerald ${reducedMotion ? '' : 'motion-orb-animate'}`}
        style={{ top: '12%', right: '8%', width: 'min(42vw, 420px)', height: 'min(42vw, 420px)' }}
      />
      <div
        className={`motion-orb motion-orb-cyan ${reducedMotion ? '' : 'motion-orb-animate-slow'}`}
        style={{ bottom: '18%', right: '22%', width: 'min(28vw, 280px)', height: 'min(28vw, 280px)' }}
      />
      <div
        className={`motion-orb motion-orb-indigo ${reducedMotion ? '' : 'motion-orb-animate'}`}
        style={{ top: '38%', right: '35%', width: 'min(18vw, 180px)', height: 'min(18vw, 180px)' }}
      />

      <div className="absolute inset-0 motion-grid-perspective opacity-40" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#010208] from-0% via-[#010208]/95 via-[42%] to-transparent to-[78%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#010208]/80" />
    </div>
  );
};

export default MotionBackdrop;
