import * as THREE from 'three';

export interface RendererOptions {
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: WebGLPowerPreference;
  prefersWebGL1?: boolean;
}

/**
 * Three.js r184+ only requests WebGL2 internally. When the browser blocks it
 * (AllowWebgl2:false), skip WebGL2 entirely and pass a WebGL1 context in.
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

  return new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: attrs.alpha,
    antialias: attrs.antialias,
    powerPreference: attrs.powerPreference,
  });
}
