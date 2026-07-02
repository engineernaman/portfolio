export type WebGLCapability = 'none' | 'webgl2' | 'webgl1';

export interface WebGLSupport {
  capability: WebGLCapability;
  prefersWebGL1: boolean;
}

const CONTEXT_ATTRS: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  failIfMajorPerformanceCaveat: false,
  powerPreference: 'default',
};

function probeContext(
  canvas: HTMLCanvasElement,
  name: 'webgl2' | 'webgl' | 'experimental-webgl'
) {
  try {
    return canvas.getContext(name, CONTEXT_ATTRS);
  } catch {
    return null;
  }
}

/** Lightweight probe — no Three.js import. WebGL1 alone is enough for 3D. */
export function detectWebGL(): WebGLSupport {
  if (typeof document === 'undefined') {
    return { capability: 'none', prefersWebGL1: true };
  }

  const canvas = document.createElement('canvas');
  const gl1 =
    probeContext(canvas, 'webgl') || probeContext(canvas, 'experimental-webgl');
  if (!gl1) {
    return { capability: 'none', prefersWebGL1: true };
  }

  const canvas2 = document.createElement('canvas');
  const gl2 = probeContext(canvas2, 'webgl2');
  if (gl2) {
    return { capability: 'webgl2', prefersWebGL1: false };
  }

  return { capability: 'webgl1', prefersWebGL1: true };
}
