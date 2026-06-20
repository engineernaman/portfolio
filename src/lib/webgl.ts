export type WebGLCapability = 'none' | 'webgl2' | 'webgl1';

export interface WebGLSupport {
  capability: WebGLCapability;
  useLegacy: boolean;
}

const CONTEXT_ATTRS: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  failIfMajorPerformanceCaveat: false,
  powerPreference: 'default',
};

function releaseContext(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  const ext = gl.getExtension('WEBGL_lose_context');
  ext?.loseContext();
}

export function detectWebGL(): WebGLSupport {
  if (typeof document === 'undefined') {
    return { capability: 'none', useLegacy: true };
  }

  const canvas = document.createElement('canvas');

  try {
    const gl2 = canvas.getContext('webgl2', CONTEXT_ATTRS);
    if (gl2) {
      releaseContext(gl2);
      return { capability: 'webgl2', useLegacy: false };
    }
  } catch {
    /* WebGL2 blocked or unavailable */
  }

  try {
    const gl1 =
      canvas.getContext('webgl', CONTEXT_ATTRS) ||
      canvas.getContext('experimental-webgl', CONTEXT_ATTRS);
    if (gl1) {
      releaseContext(gl1);
      return { capability: 'webgl1', useLegacy: true };
    }
  } catch {
    /* WebGL1 unavailable */
  }

  return { capability: 'none', useLegacy: true };
}
