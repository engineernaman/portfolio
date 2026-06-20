import { Component, Suspense, useState, useEffect, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import CyberCommandWorld from './CyberCommandWorld';
import { detectWebGL } from '../../lib/webgl';

function WebGLFallback() {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#010208] via-[#02040a] to-[#010208] flex items-end justify-center pb-8">
      <p className="text-emerald-400/50 font-mono text-sm">3D mode unavailable — static view active</p>
    </div>
  );
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface ImmersiveCanvasProps {
  reducedMotion?: boolean;
}

const ImmersiveCanvas = ({ reducedMotion = false }: ImmersiveCanvasProps) => {
  const [webgl, setWebgl] = useState<ReturnType<typeof detectWebGL> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setWebgl(detectWebGL());
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
    setEventSource(document.body);
  }, []);

  if (webgl === null) {
    return <div className="fixed inset-0 z-0 bg-[#010208]" aria-hidden />;
  }

  if (webgl.capability === 'none') return <WebGLFallback />;

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowPower =
    reducedMotion ||
    webgl.useLegacy ||
    isMobile ||
    (deviceMemory !== undefined && deviceMemory < 4);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" id="immersive-canvas">
      <CanvasErrorBoundary fallback={<WebGLFallback />}>
        <Canvas
          legacy={webgl.useLegacy}
          shadows={!lowPower}
          dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [0, 2, 8], fov: 58 }}
          gl={{
            antialias: !lowPower,
            alpha: true,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
          }}
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
      </CanvasErrorBoundary>
    </div>
  );
};

export default ImmersiveCanvas;
