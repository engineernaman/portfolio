import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars, Sparkles, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const SECTORS = [
  { sectionId: 'about', label: 'PROFILE', color: '#34d399', shape: 'octahedron' as const, position: [0, 0.5, -6] as [number, number, number] },
  { sectionId: 'experience', label: 'CAREER', color: '#22d3ee', shape: 'box' as const, position: [2.5, -0.5, -12] as [number, number, number] },
  { sectionId: 'ventures', label: 'VENTURE', color: '#34d399', shape: 'torus' as const, position: [-2.5, 0.8, -18] as [number, number, number] },
  { sectionId: 'speaking', label: 'STAGE', color: '#22d3ee', shape: 'sphere' as const, position: [2, 0.2, -24] as [number, number, number] },
  { sectionId: 'research', label: 'LAB', color: '#34d399', shape: 'octahedron' as const, position: [-1.5, -0.4, -30] as [number, number, number] },
  { sectionId: 'contact', label: 'CONNECT', color: '#22d3ee', shape: 'box' as const, position: [0, 1, -36] as [number, number, number] },
];

function ScrollCamera() {
  const progress = useScrollProgress();

  useFrame((state) => {
    const t = progress;
    const time = state.clock.elapsedTime;
    const { pointer } = state;

    const x = Math.sin(time * 0.12) * 0.5 + pointer.x * 1.4 + t * 0.5;
    const y = 0.35 + Math.sin(time * 0.18) * 0.2 + pointer.y * 0.5;
    const z = THREE.MathUtils.lerp(6.5, -30, t);

    state.camera.position.lerp(new THREE.Vector3(x, y, z), 0.07);
    state.camera.lookAt(
      THREE.MathUtils.lerp(3, 0.5, t),
      THREE.MathUtils.lerp(0, 0.15, t),
      THREE.MathUtils.lerp(0, -18, t)
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
    group.current.rotation.y = t * 0.5 + state.pointer.x * 0.6;
    group.current.rotation.x = state.pointer.y * 0.35;
    group.current.position.x = THREE.MathUtils.lerp(3.2, 0.5, progress * 1.5);
    const s = THREE.MathUtils.lerp(3.0, 1.4, Math.min(progress * 2, 1));
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group} position={[3.2, 0, 0]}>
      <Float speed={3} rotationIntensity={0.6} floatIntensity={1}>
        {[4.8, 3.8, 2.9].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.45]}>
            <torusGeometry args={[r, 0.05, 16, 128]} />
            <meshBasicMaterial color={i % 2 ? '#22d3ee' : '#34d399'} transparent opacity={0.55} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
        <mesh>
          <torusKnotGeometry args={[2.2, 0.24, 256, 32]} />
          <meshStandardMaterial color="#010208" emissive="#22d3ee" emissiveIntensity={3.5} wireframe metalness={1} roughness={0} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.9, 2]} />
          <MeshDistortMaterial color="#041a12" emissive="#34d399" emissiveIntensity={3} distort={0.55} speed={4} metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh scale={1.35}>
          <icosahedronGeometry args={[1.9, 0]} />
          <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.35} />
        </mesh>
      </Float>
      <Sparkles count={160} scale={14} size={7} speed={0.7} color="#22d3ee" />
      <pointLight position={[0, 0, 4]} intensity={14} color="#34d399" distance={30} />
      <pointLight position={[-4, 3, 2]} intensity={8} color="#22d3ee" distance={24} />
      <spotLight position={[6, 10, 8]} intensity={3} angle={0.45} penumbra={1} color="#a7f3d0" />
    </group>
  );
}

function DataRain({ count = 280 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45 - 10;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += 0.08;
      if (arr[i * 3 + 2] > 10) arr[i * 3 + 2] = -35;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.2} color="#34d399" transparent opacity={0.95} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

interface PortfolioWorldProps {
  lowPower?: boolean;
}

const PortfolioWorld = ({ lowPower = false }: PortfolioWorldProps) => (
  <>
    <color attach="background" args={['#010208']} />
    <fog attach="fog" args={['#010208', 28, 70]} />

    <ambientLight intensity={1} />
    <directionalLight position={[8, 12, 6]} intensity={2} color="#d1fae5" />
    <hemisphereLight intensity={0.6} color="#34d399" groundColor="#010208" />

    <ScrollCamera />
    <CommandCore />
    <DataRain count={lowPower ? 100 : 280} />

    {SECTORS.map((s, i) => (
      <InteractiveNode
        key={s.sectionId}
        position={s.position}
        color={s.color}
        label={s.label}
        shape={s.shape}
        scale={i < 2 ? 1 : 0.85}
        sectionId={s.sectionId}
        physics={!lowPower}
      />
    ))}

    <Grid position={[1, -3, -5]} infiniteGrid cellSize={0.6} cellThickness={0.6} cellColor="#34d399" sectionSize={3} sectionThickness={1.2} sectionColor="#22d3ee" fadeDistance={45} fadeStrength={1.5} />
    <Stars radius={120} depth={80} count={lowPower ? 1500 : 4500} factor={4} saturation={0} fade speed={0.7} />
    <Sparkles count={lowPower ? 80 : 180} scale={30} size={4} speed={0.5} color="#22d3ee" opacity={0.6} />
  </>
);

export default PortfolioWorld;
