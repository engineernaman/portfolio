import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ScreenContent } from './monitorScreenTexture';
import { paintMonitorScreen } from './monitorScreenTexture';

export function useMonitorTexture(content: ScreenContent) {
  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return { texture: tex, canvas: c };
  }, []);

  useEffect(() => {
    let alive = true;
    paintMonitorScreen(canvas, content).then(() => {
      if (alive) texture.needsUpdate = true;
    });
    return () => {
      alive = false;
    };
  }, [canvas, content.title, content.body, content.meta, content.image, content.isCover, content.index, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}
