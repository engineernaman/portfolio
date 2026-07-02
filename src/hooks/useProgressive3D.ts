import { useEffect, useState } from 'react';
import { detectWebGL } from '../lib/webglDetect';

/**
 * Defer heavy Three.js until the page is interactive (MotionSites-style).
 * Site paints instantly with CSS/2D; 3D layers on when idle + WebGL is available.
 */
export function useProgressive3D(reducedMotion: boolean) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const support = detectWebGL();
    if (support.capability === 'none') return;

    const activate = () => setEnabled(true);

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(activate, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }

    const t = window.setTimeout(activate, 800);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  return enabled;
}
