import { Component, Suspense, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
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
  const webgl = useMemo(() => detectWebGL(), []);
  const [isMobile, setIsMobile] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  const lowPower = reducedMotion || isMobile;

  const createRenderer = useCallback(
    (canvas: HTMLCanvasElement) =>
      createWebGLRenderer(canvas, {
        antialias: !lowPower,
        alpha: true,
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
    <div className="fixed inset-0 z-[5] pointer-events-none" id="immersive-canvas" aria-hidden>
      <CanvasErrorBoundary onFail={handleFail}>
        <Canvas
          gl={createRenderer}
          shadows={!lowPower}
          dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [2.5, 1.5, 9], fov: 55 }}
          performance={{ min: 0.5 }}
          style={{ background: 'transparent', pointerEvents: 'auto' }}
          eventSource={document.body}
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
