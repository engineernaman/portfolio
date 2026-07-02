import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import type { PageDrawContent } from './bookPageTexture';
import { paintPageCanvas } from './bookPageTexture';

export function usePageTexture(content: PageDrawContent) {
  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    paintPageCanvas(c, { ...content, image: undefined });
    tex.needsUpdate = true;
    return { texture: tex, canvas: c };
  }, [content.title, content.body, content.meta, content.isCover, content.index]);

  useEffect(() => {
    let alive = true;
    paintPageCanvas(canvas, content).then(() => {
      if (alive) texture.needsUpdate = true;
    });
    return () => {
      alive = false;
    };
  }, [canvas, content, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}
