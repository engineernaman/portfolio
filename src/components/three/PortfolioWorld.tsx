import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars, Sparkles, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const SECTORS = [
  { sectionId: 'about', label: 'PROFILE', color: '#34d399', shape: 'octahedron' as const, position: [0, 0.5, -6] as [number, number, number] },
  { sectionId: 'experience', label: 'CAREER', color: '#22d3ee', shape: 'box' as const, position: [2, -0.5, -12] as [number, number, number] },
  { sectionId: 'ventures', label: 'VENTURE', color: '#34d399', shape: 'torus' as const, position: [-2, 0.8, -18] as [number, number, number] },
  { sectionId: 'speaking', label: 'STAGE', color: '#22d3ee', shape: 'sphere' as const, position: [1.5, 0.2, -24] as [number, number, number] },
  { sectionId: 'research', label: 'LAB', color: '#34d399', shape: 'octahedron' as const, position: [-1, -0.4, -30] as [number, number, number] },
  { sectionId: 'contact', label: 'CONNECT', color: '#22d3ee', shape: 'box' as const, position: [0, 1, -36] as [number, number, number] },
];

function ScrollCamera() {
  const progress = useScrollProgress();

  useFrame((state) => {
    const t = progress;
    const time = state.clock.elapsedTime;
    const { pointer } = state;

    const x = Math.sin(time * 0.15) * 0.4 + pointer.x * 0.8;
    const y = 0.5 + Math.sin(time * 0.2) * 0.15 + pointer.y * 0.5;
    const z = THREE.MathUtils.lerp(7, -28, t);

    state.camera.position.lerp(new THREE.Vector3(x, y, z), 0.06);
    state.camera.lookAt(
      THREE.MathUtils.lerp(0, 0, t),
      THREE.MathUtils.lerp(0, 0.2, t),
      THREE.MathUtils.lerp(0, -20, t)
    );
  });

  return null;
}

function CommandCore() {
  const group = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const { pointer } = state;
    group.current.rotation.y = t * 0.4 + pointer.x * 0.5;
    group.current.rotation.x = pointer.y * 0.25;
    const s = THREE.MathUtils.lerp(1.8, 0.9, progress * 2);
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group}>
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.8}>
        {[2.8, 2.2, 1.6].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.5]}>
            <torusGeometry args={[r, 0.04, 16, 100]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#34d399' : '#22d3ee'}
              transparent
              opacity={0.55}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}

        <mesh>
          <torusKnotGeometry args={[1.4, 0.18, 200, 32]} />
          <meshStandardMaterial color="#010208" emissive="#22d3ee" emissiveIntensity={2.5} wireframe metalness={1} roughness={0} />
        </mesh>

        <mesh>
          <icosahedronGeometry args={[1.3, 1]} />
          <MeshDistortMaterial
            color="#061510"
            emissive="#34d399"
            emissiveIntensity={2}
            distort={0.45}
            speed={3}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        <mesh scale={1.2}>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.35} />
        </mesh>
      </Float>

      <Sparkles count={100} scale={10} size={5} speed={0.6} color="#22d3ee" />
      <pointLight position={[0, 0, 3]} intensity={8} color="#34d399" distance={20} />
      <pointLight position={[-4, 3, 2]} intensity={4} color="#22d3ee" distance={15} />
    </group>
  );
}

function DataRain({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += 0.06;
      if (arr[i * 3 + 2] > 8) arr[i * 3 + 2] = -30;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.15} color="#34d399" transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function TunnelRings() {
  const group = useRef<THREE.Group>(null);
  const progress = useScrollProgress();
  const rings = useMemo(() => Array.from({ length: 32 }, (_, i) => ({ z: -i * 1.2, r: 2 + (i % 5) * 0.15 })), []);

  useFrame((state) => {
    if (group.current) {
      group.current.position.z = THREE.MathUtils.lerp(0, 15, progress);
      group.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, i * 0.05]}>
          <torusGeometry args={[ring.r, 0.025, 8, 64]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#34d399' : '#22d3ee'} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

interface PortfolioWorldProps {
  lowPower?: boolean;
}

const PortfolioWorld = ({ lowPower = false }: PortfolioWorldProps) => (
    <>
      <color attach="background" args={['#010208']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#a7f3d0" />
      <hemisphereLight intensity={0.4} color="#34d399" groundColor="#010208" />

      <ScrollCamera />

      <CommandCore />
      <DataRain count={lowPower ? 80 : 220} />
      <TunnelRings />

      {SECTORS.map((s, i) => {
        const reveal = i < 2 ? 1 : THREE.MathUtils.clamp((progress - i * 0.08) * 5, 0.3, 1);
        return (
          <InteractiveNode
            key={s.sectionId}
            position={s.position}
            color={s.color}
            label={s.label}
            shape={s.shape}
            scale={reveal}
            sectionId={s.sectionId}
            physics={!lowPower}
          />
        );
      })}

      <Grid position={[0, -2.5, 0]} infiniteGrid cellSize={0.6} cellThickness={0.8} cellColor="#34d399" sectionSize={3} sectionThickness={1.5} sectionColor="#22d3ee" fadeDistance={40} fadeStrength={1.2} />
      <Stars radius={100} depth={60} count={lowPower ? 1500 : 5000} factor={4} saturation={0} fade speed={0.6} />
      <Sparkles count={lowPower ? 80 : 200} scale={25} size={4} speed={0.5} color="#22d3ee" opacity={0.8} />
    </>
);

export default PortfolioWorld;
