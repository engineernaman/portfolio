import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import NetworkStack from './NetworkStack';
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

    const x = Math.sin(time * 0.1) * 0.35 + pointer.x * 0.9 + t * 0.5;
    const y = 0.35 + Math.sin(time * 0.15) * 0.15 + pointer.y * 0.35;
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

function DataRain({ count = 220 }: { count?: number }) {
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
      <pointsMaterial size={0.16} color="#34d399" transparent opacity={0.55} sizeAttenuation blending={THREE.AdditiveBlending} />
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

    <ambientLight intensity={0.75} />
    <directionalLight position={[8, 12, 6]} intensity={1.4} color="#d1fae5" />
    <hemisphereLight intensity={0.45} color="#34d399" groundColor="#010208" />

    <ScrollCamera />
    <NetworkStack reducedMotion={lowPower} position={[3.4, 0.05, 0]} scale={lowPower ? 0.85 : 1} />
    <DataRain count={lowPower ? 80 : 220} />

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

    <Grid
      position={[1, -3, -5]}
      infiniteGrid
      cellSize={0.6}
      cellThickness={0.45}
      cellColor="#1e3a2f"
      sectionSize={3}
      sectionThickness={0.8}
      sectionColor="#164e63"
      fadeDistance={45}
      fadeStrength={1.5}
    />
    <Stars radius={120} depth={80} count={lowPower ? 1200 : 3500} factor={3.5} saturation={0} fade speed={0.5} />
    <Sparkles count={lowPower ? 40 : 90} scale={30} size={3} speed={0.35} color="#22d3ee" opacity={0.35} />
  </>
);

export default PortfolioWorld;
