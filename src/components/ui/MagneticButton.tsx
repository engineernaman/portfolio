import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'ghost';
}

const MagneticButton = ({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 28 });
  const springY = useSpring(y, { stiffness: 400, damping: 28 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.08);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.08);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    variant === 'primary'
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/15 hover:border-emerald-500/45 font-mono text-xs tracking-wide'
      : 'border border-white/15 text-slate/90 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25 font-mono text-xs tracking-wide';

  const inner = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg transition-colors ${base} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="pointer-events-auto">
        {inner}
      </a>
    );
  }
  return inner;
};

export default MagneticButton;
