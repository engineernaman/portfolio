import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { createNexusMaterial } from './shaders/nexusCore';

/** Igloo-style hero centerpiece — centered in the right viewport, always animating */
const HeroSentinel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const progress = useScrollProgress();
  const shaderMat = useMemo(() => createNexusMaterial(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { pointer } = state;
    const heroFade = 1 - THREE.MathUtils.smoothstep(progress, 0.12, 0.28);

    if (!groupRef.current) return;
    groupRef.current.visible = heroFade > 0.02;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1.6, 0.6, progress * 3));
    groupRef.current.rotation.y = t * 0.35 + pointer.x * 0.4;
    groupRef.current.position.x = 2.8 + pointer.x * 0.35;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.15 + pointer.y * 0.2;

    shaderMat.uniforms.uTime.value = t;
    shaderMat.uniforms.uProgress.value = progress;
    shaderMat.uniforms.uPointer.value.set(pointer.x, pointer.y);
    shaderMat.uniforms.uDistort.value = 1.2;

    if (coreRef.current) {
      const breathe = 1 + Math.sin(t * 2) * 0.06;
      coreRef.current.scale.setScalar(breathe);
    }
    if (knotRef.current) {
      knotRef.current.rotation.x = t * 0.25;
      knotRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        {[3.2, 2.6, 2.0].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.4]}>
            <torusGeometry args={[r, 0.035, 12, 128]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#34d399' : '#22d3ee'}
              transparent
              opacity={0.45 - i * 0.08}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}

        <mesh ref={knotRef}>
          <torusKnotGeometry args={[1.6, 0.12, 256, 32]} />
          <meshStandardMaterial
            color="#010208"
            emissive="#22d3ee"
            emissiveIntensity={2}
            metalness={0.95}
            roughness={0.1}
            wireframe
          />
        </mesh>

        <mesh ref={coreRef} material={shaderMat}>
          <icosahedronGeometry args={[1.35, 4]} />
        </mesh>

        <mesh scale={1.25}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.2} />
        </mesh>
      </Float>

      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <MeshDistortMaterial
          color="#010208"
          emissive="#34d399"
          emissiveIntensity={0.8}
          distort={0.35}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.15}
        />
      </mesh>

      <Sparkles count={80} scale={8} size={4} speed={0.5} color="#22d3ee" opacity={0.7} />
      <Sparkles count={40} scale={6} size={2.5} speed={0.3} color="#34d399" opacity={0.5} />

      <pointLight position={[0, 0, 2]} intensity={5} color="#34d399" distance={15} />
      <pointLight position={[3, 2, 1]} intensity={3} color="#22d3ee" distance={12} />
      <spotLight position={[0, 8, 4]} intensity={2} angle={0.5} penumbra={1} color="#a7f3d0" />
    </group>
  );
};

export default HeroSentinel;
