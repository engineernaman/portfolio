import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const PATHS = [
  { from: new THREE.Vector3(9, 0.8, -8), to: new THREE.Vector3(9.5, 0, -12), color: '#f59e0b' },
  { from: new THREE.Vector3(7.5, 0.6, -9), to: new THREE.Vector3(9.5, 0, -12), color: '#00d4aa' },
  { from: new THREE.Vector3(9.5, -1.2, -14), to: new THREE.Vector3(9.5, 0, -12), color: '#6366f1' },
  { from: new THREE.Vector3(10, 0, -17), to: new THREE.Vector3(9.5, 0, -12), color: '#38bdf8' },
];

const DataStreams = ({ count = 36 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        pathIndex: i % PATHS.length,
        t: Math.random(),
        speed: 0.008 + Math.random() * 0.015,
      })),
    [count]
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return geo;
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const col = pointsRef.current.geometry.attributes.color.array as Float32Array;

    particles.forEach((p, i) => {
      p.t += p.speed;
      if (p.t > 1) p.t -= 1;

      const path = PATHS[p.pathIndex];
      pos[i * 3] = path.from.x + (path.to.x - path.from.x) * p.t;
      pos[i * 3 + 1] = path.from.y + (path.to.y - path.from.y) * p.t;
      pos[i * 3 + 2] = path.from.z + (path.to.z - path.from.z) * p.t;

      const c = new THREE.Color(path.color);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
};

export default DataStreams;
