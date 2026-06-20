import { useState, useEffect, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Preload } from '@react-three/drei';
import ExperienceScene from './ExperienceScene';
import JourneyOverlay from '../journey/JourneyOverlay';

const PAGES = 22;

interface ScrollJourneyProps {
  reducedMotion?: boolean;
  portfolio?: ReactNode;
}

const ScrollJourney = ({ reducedMotion = false, portfolio }: ScrollJourneyProps) => {
  const [supported, setSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  if (!supported || reducedMotion) {
    return (
      <div className="min-h-screen bg-[#010208]">
        <JourneyOverlay />
        {portfolio}
      </div>
    );
  }

  const lowPower = isMobile || (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <Canvas
        shadows={!lowPower}
        dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, 2, 10], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#010208' }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={PAGES} damping={0.15} distance={1} maxSpeed={0.4}>
            <ExperienceScene lowPower={lowPower} />
            <Scroll html style={{ width: '100%' }}>
              <JourneyOverlay />
              {portfolio}
            </Scroll>
          </ScrollControls>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ScrollJourney;
