import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const GlassPanel = ({ children, className = '', delay = 0 }: GlassPanelProps) => (
  <motion.div
    initial={{ opacity: 0, y: 60, rotateX: 8 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, margin: '-10%' }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`pointer-events-auto backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(0,255,255,0.08)] ${className}`}
    style={{ transformPerspective: 1200 }}
  >
    {children}
  </motion.div>
);

export default GlassPanel;
