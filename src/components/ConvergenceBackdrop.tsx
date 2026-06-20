import { useEffect, useRef } from 'react';

interface ConvergenceBackdropProps {
  static?: boolean;
}

const ConvergenceBackdrop = ({ static: staticMode = false }: ConvergenceBackdropProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = '#030508';
      ctx.fillRect(0, 0, w, h);

      // Infrastructure grid — no blobs
      const grid = 56;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Diagonal data lanes (right side only)
      const startX = w * 0.45;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
      for (let i = 0; i < 12; i++) {
        const offset = i * 80;
        ctx.beginPath();
        ctx.moveTo(startX + offset, 0);
        ctx.lineTo(startX + offset - h * 0.6, h);
        ctx.stroke();
      }

      // Horizontal scan line
      if (!staticMode) {
        scanRef.current = (scanRef.current + 0.4) % h;
        const sy = scanRef.current;
        const grad = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, 'rgba(0, 212, 170, 0.06)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(startX, sy - 40, w - startX, 80);
      }

      // Corner telemetry — monospace readout, not decorative orbs
      ctx.font = '500 9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.textAlign = 'left';
      const telemetry = [
        'SYS: CONVERGENCE_MESH',
        'CYBER · AI · CLOUD · CHAIN',
        'THREAT_MODEL: ACTIVE',
        'NODES: 4 DOMAINS LINKED',
      ];
      telemetry.forEach((line, i) => {
        ctx.fillText(line, w * 0.52, h * 0.18 + i * 16);
      });
    };

    if (staticMode) {
      draw();
      return () => window.removeEventListener('resize', resize);
    }

    const loop = () => {
      draw();
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [staticMode]);

  return (
    <>
      <video
        className="fixed inset-0 w-full h-full object-cover opacity-[0.04] pointer-events-none z-0"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source
          src="https://videos.pexels.com/video-files/5380945/5380945-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
      </video>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-r from-[#030508] from-0% via-[#030508]/98 via-[38%] to-transparent to-[72%]"
        aria-hidden="true"
      />
    </>
  );
};

export default ConvergenceBackdrop;
