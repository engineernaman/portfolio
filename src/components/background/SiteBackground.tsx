import { Component, Suspense, useState, useEffect, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import ScrollWorld from '../three/ScrollWorld';

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: Error) {
    console.error('[SiteBackground]', err.message);
    this.props.onFail();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface SiteBackgroundProps {
  reducedMotion?: boolean;
  onUnavailable?: () => void;
}

/**
 * Fixed full-viewport scroll-driven 3D world.
 * Sits behind all content at z-0.
 */
const SiteBackground = ({ reducedMotion = false, onUnavailable }: SiteBackgroundProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  const lowPower = reducedMotion || isMobile;

  if (failed) return null;

  return (
    <div className="fixed inset-0 z-0" id="site-background" aria-hidden>
      <div className="absolute inset-0 bg-[#010208]" />
      <CanvasErrorBoundary onFail={() => { setFailed(true); onUnavailable?.(); }}>
        <Canvas
          className="!absolute inset-0"
          dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [-2.2, 0.6, 7.5], fov: 48 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
          eventSource={document.body}
          eventPrefix="client"
        >
          <Suspense fallback={null}>
            <ScrollWorld lowPower={lowPower} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default SiteBackground;
