import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import CyberCommandWorld from './CyberCommandWorld';

function WebGLFallback() {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#010208] via-[#02040a] to-[#010208] flex items-end justify-center pb-8">
      <p className="text-emerald-400/50 font-mono text-sm">3D mode unavailable — static view active</p>
    </div>
  );
}

interface ImmersiveCanvasProps {
  reducedMotion?: boolean;
}

const ImmersiveCanvas = ({ reducedMotion = false }: ImmersiveCanvasProps) => {
  const [supported, setSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
    setEventSource(document.body);
  }, []);

  if (!supported) return <WebGLFallback />;

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowPower = reducedMotion || isMobile || (deviceMemory !== undefined && deviceMemory < 4);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" id="immersive-canvas">
      <Canvas
        shadows={!lowPower}
        dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, 2, 8], fov: 58 }}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: lowPower ? 'default' : 'high-performance' }}
        performance={{ min: 0.5 }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
        eventSource={eventSource ?? undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <CyberCommandWorld lowPower={lowPower} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ImmersiveCanvas;
