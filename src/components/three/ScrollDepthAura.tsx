import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getGlobalScrollProgress } from '../../lib/scrollState';

/** Ambient particles that travel with scroll depth — keeps void alive between sections */
function ScrollDepthAura({ count = 400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = -Math.random() * 55 - 5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const progress = getGlobalScrollProgress();
    const t = state.clock.elapsedTime;
    ref.current.position.z = THREE.MathUtils.lerp(0, -18, progress);
    ref.current.rotation.y = t * 0.03;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t + i) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.14} color="#22d3ee" transparent opacity={0.45} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default ScrollDepthAura;
