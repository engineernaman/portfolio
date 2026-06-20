import * as THREE from 'three';

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

/** Check if any WebGL mode can run (WebGL1 is enough when WebGL2 is blocked). */
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

export interface RendererOptions {
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: WebGLPowerPreference;
}

/**
 * Three.js r184+ only requests WebGL2 internally. When the browser blocks it
 * (AllowWebgl2:false), we must create a WebGL1 context ourselves and pass it in.
 */
export function createWebGLRenderer(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  options: RendererOptions = {}
): THREE.WebGLRenderer {
  const attrs: WebGLContextAttributes = {
    alpha: options.alpha ?? true,
    antialias: options.antialias ?? false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: options.powerPreference ?? 'default',
  };

  let context: RenderingContext | null = canvas.getContext('webgl2', attrs);
  if (!context) {
    context =
      canvas.getContext('webgl', attrs) ||
      canvas.getContext('experimental-webgl', attrs);
  }

  if (!context) {
    throw new Error('WebGL unavailable');
  }

  return new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: attrs.alpha,
    antialias: attrs.antialias,
    powerPreference: attrs.powerPreference,
  });
}
