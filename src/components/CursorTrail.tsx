import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const addTrailPoint = (x: number, y: number) => {
      trailRef.current.push({
        x,
        y,
        life: 0,
        maxLife: 30
      });

      // Limit trail length
      if (trailRef.current.length > 50) {
        trailRef.current.shift();
      }
    };

    const updateTrail = () => {
      trailRef.current = trailRef.current.filter(point => {
        point.life++;
        return point.life < point.maxLife;
      });
    };

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      trailRef.current.forEach((point, index) => {
        const opacity = (1 - point.life / point.maxLife) * 0.8;
        const size = (1 - point.life / point.maxLife) * 8;
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, size
        );
        gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 65, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect points with lines
        if (index > 0) {
          const prevPoint = trailRef.current[index - 1];
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      });
    };

    const animate = () => {
      updateTrail();
      drawTrail();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      
      // Only add trail points if mouse moved significantly
      const dx = newX - mouseRef.current.x;
      const dy = newY - mouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        addTrailPoint(newX, newY);
        mouseRef.current.x = newX;
        mouseRef.current.y = newY;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create burst effect on click
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const distance = 20;
        addTrailPoint(
          e.clientX + Math.cos(angle) * distance,
          e.clientY + Math.sin(angle) * distance
        );
      }
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ background: 'transparent' }}
    />
  );
};

export default CursorTrail;