import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const COUNT = 800;

const ParticleSwarm = () => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const progress = useScrollProgress();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 20,
        z: -Math.random() * 40 - 5,
        speed: 0.2 + Math.random() * 0.8,
        scale: 0.02 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const scrollZ = progress * 25;

    particles.forEach((p, i) => {
      const z = ((p.z + scrollZ + t * p.speed * 2) % 40) - 20;
      const x = p.x + Math.sin(t * 0.5 + p.phase) * 0.5;
      const y = p.y + Math.cos(t * 0.3 + p.phase) * 0.3;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#8b6dff" transparent opacity={0.5} />
    </instancedMesh>
  );
};

export default ParticleSwarm;
