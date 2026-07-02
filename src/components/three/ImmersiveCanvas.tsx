import { Component, Suspense, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import CyberCommandWorld from './CyberCommandWorld';
import { detectWebGL } from '../../lib/webglDetect';
import { createWebGLRenderer } from '../../lib/webglRenderer';

class CanvasErrorBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
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
  const [webgl] = useState(() => detectWebGL());
  const [isMobile, setIsMobile] = useState(false);
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
    setEventSource(document.body);
  }, []);

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowPower =
    reducedMotion ||
    webgl.prefersWebGL1 ||
    isMobile ||
    (deviceMemory !== undefined && deviceMemory < 4);

  const createRenderer = useCallback(
    (canvas: HTMLCanvasElement) =>
      createWebGLRenderer(canvas, {
        antialias: !lowPower,
        alpha: true,
        powerPreference: 'default',
        prefersWebGL1: webgl.prefersWebGL1,
      }),
    [lowPower, webgl.prefersWebGL1]
  );

  const handleFail = useCallback(() => {
    setFailed(true);
    onUnavailable?.();
  }, [onUnavailable]);

  if (webgl.capability === 'none' || failed) return null;

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none motion-3d-layer"
      id="immersive-canvas"
      aria-hidden
    >
      <CanvasErrorBoundary onFail={handleFail}>
        <Canvas
          gl={createRenderer}
          shadows={!lowPower}
          dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 1.75)}
          camera={{ position: [0, 2, 8], fov: 58 }}
          performance={{ min: 0.5 }}
          style={{ background: 'transparent', pointerEvents: 'none' }}
          eventSource={eventSource ?? undefined}
          eventPrefix="client"
        >
          <Suspense fallback={null}>
            <CyberCommandWorld lowPower={lowPower} />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default ImmersiveCanvas;
