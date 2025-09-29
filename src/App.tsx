import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import Publications from './components/Publications';
import Training from './components/Training';
import Achievements from './components/Achievements';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ParticleBackground from './components/ParticleBackground';
import EnhancedParticleBackground from './components/EnhancedParticleBackground';
import SoundSystem from './components/SoundSystem';
import HackingTerminal from './components/HackingTerminal';
import ThemeSwitcher from './components/ThemeSwitcher';
import StatusBar from './components/StatusBar';
import GlitchEffect from './components/GlitchEffect';
import NotificationSystem from './components/NotificationSystem';
import CursorTrail from './components/CursorTrail';
import MatrixRain from './components/MatrixRain';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 300);
  };

  useEffect(() => {
    // Expose matrix trigger globally
    (window as any).triggerMatrix = () => setShowMatrix(true);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 overflow-x-hidden">
      <EnhancedParticleBackground />
      <CursorTrail />
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90 pointer-events-none"></div>
      
      {/* Status Bar */}
      <StatusBar />
      
      {/* Control Panel */}
      <SoundSystem />
      <ThemeSwitcher />
      <NotificationSystem />
      
      <div className={`relative z-10 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`} style={{ paddingTop: '40px' }}>
        <GlitchEffect intensity="low">
          <Navbar />
        </GlitchEffect>
        
        <GlitchEffect intensity="medium">
          <Hero />
        </GlitchEffect>
        
        <About />
        <Experience />
        <Certifications />
        <Projects />
        <Publications />
        <Training />
        <Achievements />
        <Gallery />
        <Contact />
        <Footer />
      </div>
      
      {/* Hacking Terminal Easter Egg */}
      <HackingTerminal />
      
      {/* Matrix Rain Effect */}
      <MatrixRain 
        isActive={showMatrix} 
        onComplete={() => setShowMatrix(false)} 
      />
    </div>
  );
}

export default App;