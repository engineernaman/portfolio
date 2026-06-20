import { useState, useEffect } from 'react';

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

import LoadingScreen from './components/LoadingScreen';

import HackingTerminal from './components/HackingTerminal';

import NotificationSystem from './components/NotificationSystem';

import MatrixRain from './components/MatrixRain';

import AnimatedSection from './components/AnimatedSection';

import HeroExperience from './components/HeroExperience';

import DomainMarquee from './components/DomainMarquee';

import ImmersiveCanvas from './components/three/ImmersiveCanvas';

import ImmersiveHud from './components/ImmersiveHud';

import IntelLab from './components/IntelLab';

import { AppProvider, useApp } from './context/AppContext';

import { useReducedMotion } from './hooks/useReducedMotion';

import { useSmoothScroll } from './hooks/useSmoothScroll';

import { motion, useScroll, useSpring } from 'framer-motion';



function AppContent() {

  const [isLoading, setIsLoading] = useState(() => !sessionStorage.getItem('portfolio-skip-intro'));

  const [showMatrix, setShowMatrix] = useState(false);

  const { registerTriggerMatrix, reducedMotion, intelLabOpen, closeIntelLab, openIntelLab } = useApp();



  useSmoothScroll(!isLoading, reducedMotion);

  useEffect(() => {
    if (isLoading) return;
    if (window.location.hash === '#intel-lab') {
      openIntelLab();
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [isLoading, openIntelLab]);



  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });



  const handleLoadingComplete = () => {

    sessionStorage.setItem('portfolio-skip-intro', '1');

    setIsLoading(false);

  };



  useEffect(() => {

    registerTriggerMatrix(() => setShowMatrix(true));

  }, [registerTriggerMatrix]);



  if (isLoading) {

    return <LoadingScreen onComplete={handleLoadingComplete} reducedMotion={reducedMotion} />;

  }



  return (

    <div className="min-h-screen bg-transparent text-slate font-body overflow-x-hidden">

      <ImmersiveCanvas reducedMotion={reducedMotion} />



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



      <div className="relative z-10">

        <HeroExperience />

        <DomainMarquee />



        <div className="relative">

          <div

            className="absolute inset-0 bg-gradient-to-b from-transparent via-void/30 to-void/85 pointer-events-none"

            aria-hidden

          />

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

