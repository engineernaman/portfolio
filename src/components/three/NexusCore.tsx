import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getScrollVelocity } from '../../lib/scrollState';
import { createNexusMaterial } from './shaders/nexusCore';

const RING_COUNT = 3;

function NexusCore() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress();
  const material = useMemo(() => createNexusMaterial(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const velocity = getScrollVelocity();

    material.uniforms.uTime.value = t;
    material.uniforms.uProgress.value = progress;
    material.uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
    material.uniforms.uDistort.value = THREE.MathUtils.lerp(
      material.uniforms.uDistort.value,
      0.6 + Math.abs(velocity) * 80,
      0.06
    );

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.22 + state.pointer.x * 0.25;
      groupRef.current.position.y = 0.4 + Math.sin(t * 0.9) * 0.08;
    }

    if (coreRef.current) {
      const breathe = 1 + Math.sin(t * 1.6) * 0.04 + Math.abs(velocity) * 2;
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, breathe, 0.08));
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, i) => {
        child.rotation.z = t * (0.12 + i * 0.04) * (i % 2 === 0 ? 1 : -1);
        child.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 + i) * 0.05;
      });
    }
  });

  return (
    <group ref={groupRef} position={[5.5, 0, -2]}>
      <group ref={ringsRef}>
        {Array.from({ length: RING_COUNT }, (_, i) => {
          const r = 2.4 - i * 0.45;
          return (
            <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.35]}>
              <torusGeometry args={[r, 0.022, 8, 96]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? '#34d399' : '#22d3ee'}
                transparent
                opacity={0.28 + i * 0.08}
              />
            </mesh>
          );
        })}
      </group>

      <mesh ref={coreRef} material={material}>
        <icosahedronGeometry args={[1.05, 4]} />
      </mesh>

      <mesh scale={1.22}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.12} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.15, 1.22, 6]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={2.5} color="#34d399" distance={8} />
      <pointLight position={[1.5, 1, 1]} intensity={1.2} color="#22d3ee" distance={6} />
    </group>
  );
}

export default NexusCore;
