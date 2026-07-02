import { useState, useEffect, useMemo } from 'react';

import ImmersiveNav from './components/ImmersiveNav';
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
import IntelLab from './components/IntelLab';
import VisitorSessionBadge from './components/VisitorSessionBadge';
import LoadingScreen from './components/LoadingScreen';
import ImmersiveCanvas from './components/three/ImmersiveCanvas';
import MusicPage from './pages/MusicPage';
import CyberChefPage from './pages/CyberChefPage';

import { AppProvider, useApp } from './context/AppContext';
import { MusicProvider } from './context/MusicContext';
import GlobalMusicPlayer from './components/GlobalMusicPlayer';
import QuickActionDock from './components/QuickActionDock';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useSitePage } from './hooks/useSitePage';
import { sendVisitorPulse, hasScannedThisSession, markScannedThisSession } from './lib/visitorIntel';
import { detectWebGL } from './lib/webglDetect';

import { motion, useScroll, useSpring } from 'framer-motion';

function AppContent() {
  const [showMatrix, setShowMatrix] = useState(false);
  const [show3d, setShow3d] = useState(true);
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem('soumysec-booted') === '1';
    } catch {
      return false;
    }
  });
  const { page } = useSitePage();
  const isHome = page === 'home';
  const { registerTriggerMatrix, reducedMotion, intelLabOpen, closeIntelLab, openIntelLab, setVisitorProfile, visitorProfile } = useApp();
  const webgl = useMemo(() => detectWebGL(), []);

  useSmoothScroll(isHome, reducedMotion);

  useEffect(() => {
    if (window.location.hash === '#intel-lab') {
      openIntelLab();
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [openIntelLab]);

  useEffect(() => {
    if (webgl.capability === 'none') {
      setShow3d(false);
    }
  }, [webgl.capability]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    registerTriggerMatrix(() => setShowMatrix(true));
  }, [registerTriggerMatrix]);

  useEffect(() => {
    if (!isHome) return;
    if (visitorProfile?.ip && !/resolving|unavailable/i.test(visitorProfile.ip)) return;
    if (hasScannedThisSession()) return;
    sendVisitorPulse('connection').then((result) => {
      setVisitorProfile(result);
      markScannedThisSession();
    });
  }, [isHome, visitorProfile?.ip, setVisitorProfile]);

  return (
    <div className="min-h-screen bg-[#010208] text-slate font-body overflow-x-hidden">
      {!booted && (
        <LoadingScreen
          onComplete={() => {
            setBooted(true);
            try {
              sessionStorage.setItem('soumysec-booted', '1');
            } catch {
              /* ignore */
            }
          }}
          reducedMotion={reducedMotion}
        />
      )}

      {isHome && show3d && (
        <ImmersiveCanvas
          reducedMotion={reducedMotion}
          onUnavailable={() => setShow3d(false)}
        />
      )}
      {!isHome && (
        <MotionBackdrop reducedMotion={reducedMotion} />
      )}

      {isHome && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-px bg-emerald-500/60 origin-left z-[60]"
          style={{ scaleX }}
        />
      )}

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <ImmersiveNav activePage={page} />
        </div>
      </div>


      {page === 'music' && (
        <div className="relative z-10">
          <MusicPage />
        </div>
      )}

      {page === 'cyberchef' && (
        <div className="relative z-10">
          <CyberChefPage />
        </div>
      )}

      {isHome && (
        <div className="relative z-10">
          <HeroExperience reducedMotion={reducedMotion} />
          <DomainMarquee />

          <div className="relative pointer-events-auto">
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
      )}

      <GlobalMusicPlayer />
      <QuickActionDock />
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
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </AppProvider>
  );
}

export default App;
