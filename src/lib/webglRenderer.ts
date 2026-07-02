import * as THREE from 'three';

export interface RendererOptions {
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: WebGLPowerPreference;
  prefersWebGL1?: boolean;
}

const CONTEXT_ATTRS = {
  alpha: true,
  antialias: false,
  failIfMajorPerformanceCaveat: false,
  powerPreference: 'default' as WebGLPowerPreference,
};

/**
 * Create a WebGL renderer with WebGL2-first, WebGL1 fallback (three@0.162).
 * Passing a pre-created context avoids r184+ WebGL2-only internal probing.
 */
export function createWebGLRenderer(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  options: RendererOptions = {}
): THREE.WebGLRenderer {
  const attrs: WebGLContextAttributes = {
    ...CONTEXT_ATTRS,
    alpha: options.alpha ?? true,
    antialias: options.antialias ?? false,
    powerPreference: options.powerPreference ?? 'default',
  };

  let context: RenderingContext | null = null;

  if (!options.prefersWebGL1) {
    context = canvas.getContext('webgl2', attrs);
  }

  if (!context) {
    context =
      canvas.getContext('webgl', attrs) ||
      canvas.getContext('experimental-webgl', attrs);
  }

  if (!context) {
    throw new Error('WebGL unavailable');
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: attrs.alpha,
    antialias: attrs.antialias,
    powerPreference: attrs.powerPreference,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  return renderer;
}
