import { motion } from 'framer-motion';
import HeroWorkstation from '@/components/HeroWorkstation';

interface HeroRightStageProps {
  reducedMotion?: boolean;
}

/** Hero right column — interactive 3D only, no HUD clutter */
const HeroRightStage = ({ reducedMotion = false }: HeroRightStageProps) => (
  <motion.div
    initial={reducedMotion ? false : { opacity: 0, x: 32 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
    className="w-full h-full min-h-[380px] lg:min-h-[calc(100vh-9rem)] pointer-events-auto"
  >
    <HeroWorkstation reducedMotion={reducedMotion} />
  </motion.div>
);

export default HeroRightStage;
