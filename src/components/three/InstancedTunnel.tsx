import { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const RING_COUNT = 48;

function InstancedTunnel() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  const { dummy, rings } = useMemo(() => {
    const d = new THREE.Object3D();
    const r = Array.from({ length: RING_COUNT }, (_, i) => ({
      z: -i * 0.95,
      radius: 2.2 + (i % 7) * 0.18,
      rotZ: i * 0.035,
      color: i % 2 === 0 ? '#34d399' : '#22d3ee',
    }));
    return { dummy: d, rings: r };
  }, []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    rings.forEach((ring, i) => {
      dummy.position.set(0, 0, ring.z);
      dummy.rotation.set(Math.PI / 2, 0, ring.rotZ);
      dummy.scale.setScalar(ring.radius);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, rings]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.set(5.5, 0, THREE.MathUtils.lerp(0, 22, progress));
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.018;
    }

    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    rings.forEach((ring, i) => {
      const wave = Math.sin(t * 1.4 + i * 0.2) * 0.06;
      dummy.position.set(0, wave, ring.z);
      dummy.rotation.set(Math.PI / 2, 0, ring.rotZ + t * 0.015);
      dummy.scale.setScalar(ring.radius + wave * 0.5);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, RING_COUNT]}>
        <torusGeometry args={[1, 0.018, 6, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.38} />
      </instancedMesh>
    </group>
  );
}

export default InstancedTunnel;
