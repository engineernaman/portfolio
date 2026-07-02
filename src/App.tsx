import { useState, useEffect, useMemo } from 'react';

import Navbar from './components/Navbar';
import About from './components/About';
import Experience from './components/Experience';
import Ventures from './components/Ventures';
import Speaking from './components/Speaking';
import Research from './components/Research';
import Training from './components/Training';
import Recognition from './components/Recognition';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import HackingTerminal from './components/HackingTerminal';
import NotificationSystem from './components/NotificationSystem';
import MatrixRain from './components/MatrixRain';
import AnimatedSection from './components/AnimatedSection';
import HeroExperience from './components/HeroExperience';
import DomainMarquee from './components/DomainMarquee';
import MotionBackdrop from './components/MotionBackdrop';
import ImmersiveHud from './components/ImmersiveHud';
import IntelLab from './components/IntelLab';
import VisitorSessionBadge from './components/VisitorSessionBadge';
import AmbientPlayer from './components/AmbientPlayer';
import ImmersiveCanvas from './components/three/ImmersiveCanvas';

import { AppProvider, useApp } from './context/AppContext';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { detectWebGL } from './lib/webglDetect';

import { motion, useScroll, useSpring } from 'framer-motion';

function AppContent() {
  const [showMatrix, setShowMatrix] = useState(false);
  const [show3d, setShow3d] = useState(true);
  const { registerTriggerMatrix, reducedMotion, intelLabOpen, closeIntelLab, openIntelLab } = useApp();
  const webgl = useMemo(() => detectWebGL(), []);

  useSmoothScroll(true, reducedMotion);

  useEffect(() => {
    if (window.location.hash === '#intel-lab') {
      openIntelLab();
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [openIntelLab]);

  useEffect(() => {
    if (reducedMotion || webgl.capability === 'none') {
      setShow3d(false);
    }
  }, [reducedMotion, webgl.capability]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    registerTriggerMatrix(() => setShowMatrix(true));
  }, [registerTriggerMatrix]);

  return (
    <div className="min-h-screen bg-[#010208] text-slate font-body overflow-x-hidden">
      {show3d ? (
        <ImmersiveCanvas
          reducedMotion={reducedMotion}
          onUnavailable={() => setShow3d(false)}
        />
      ) : (
        <MotionBackdrop reducedMotion={reducedMotion} />
      )}

      <motion.div
        className="fixed top-0 left-0 right-0 h-px bg-emerald-500/60 origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>

      <ImmersiveHud />
      <AmbientPlayer />

      <div className="relative z-10 pointer-events-none">
        <HeroExperience reducedMotion={reducedMotion} />
        <DomainMarquee />

        <div className="relative pointer-events-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/15 to-void/55 pointer-events-none" aria-hidden />
          <div className="relative">
            <AnimatedSection><About /></AnimatedSection>
            <AnimatedSection><Experience /></AnimatedSection>
            <AnimatedSection><Ventures /></AnimatedSection>
            <AnimatedSection><Speaking /></AnimatedSection>
            <AnimatedSection><Research /></AnimatedSection>
            <AnimatedSection><Training /></AnimatedSection>
            <AnimatedSection><Recognition /></AnimatedSection>
            <AnimatedSection><Certifications /></AnimatedSection>
            <AnimatedSection><Contact /></AnimatedSection>
            <Footer />
          </div>
        </div>
      </div>

      <IntelLab open={intelLabOpen} onClose={closeIntelLab} />
      <VisitorSessionBadge />
      <NotificationSystem />
      <HackingTerminal />
      {!reducedMotion && (
        <MatrixRain isActive={showMatrix} onComplete={() => setShowMatrix(false)} />
      )}
    </div>
  );
}

function App() {
  const reducedMotion = useReducedMotion();

  return (
    <AppProvider reducedMotion={reducedMotion}>
      <AppContent />
    </AppProvider>
  );
}

export default App;
