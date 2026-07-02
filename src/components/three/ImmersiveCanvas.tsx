import { Component, useState, useEffect, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import CyberEcosystem from './CyberEcosystem';

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: Error) {
    console.error('[ImmersiveCanvas]', err.message);
    this.props.onFail();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface ImmersiveCanvasProps {
  reducedMotion?: boolean;
  onUnavailable?: () => void;
}

const ImmersiveCanvas = ({ reducedMotion = false, onUnavailable }: ImmersiveCanvasProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  const lowPower = reducedMotion || isMobile;

  if (failed) return null;

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none" id="immersive-canvas">
      <CanvasErrorBoundary onFail={() => { setFailed(true); onUnavailable?.(); }}>
        <Canvas
          dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [-2.2, 0.6, 7.5], fov: 48 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
          eventSource={document.body}
          eventPrefix="client"
        >
          <CyberEcosystem lowPower={lowPower} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default ImmersiveCanvas;
