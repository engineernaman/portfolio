import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { Reveal } from '@/lib/animmaster';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({ children, className = '', delay = 0 }: AnimatedSectionProps) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Reveal delay={delay} className={className}>
      <motion.div
        initial={{ opacity: 0.98 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </Reveal>
  );
};

export default AnimatedSection;
