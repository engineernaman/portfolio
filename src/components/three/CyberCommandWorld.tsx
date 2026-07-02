import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars, Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import PostFX from './PostFX';
import SectionVignettes from './SectionVignettes';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const WORLD_SECTORS = [
  {
    sectionId: 'about',
    label: 'PROFILE',
    color: '#34d399',
    shape: 'octahedron' as const,
    position: [3.5, 0.5, -2] as [number, number, number],
  },
  {
    sectionId: 'experience',
    label: 'CAREER',
    color: '#22d3ee',
    shape: 'box' as const,
    position: [5, -0.5, -9] as [number, number, number],
  },
  {
    sectionId: 'ventures',
    label: 'VENTURES',
    color: '#34d399',
    shape: 'torus' as const,
    position: [2.5, 1, -14] as [number, number, number],
  },
  {
    sectionId: 'speaking',
    label: 'STAGE',
    color: '#22d3ee',
    shape: 'sphere' as const,
    position: [5.5, 0.5, -19] as [number, number, number],
  },
  {
    sectionId: 'research',
    label: 'RESEARCH',
    color: '#34d399',
    shape: 'octahedron' as const,
    position: [3, -0.8, -24] as [number, number, number],
  },
  {
    sectionId: 'contact',
    label: 'CONNECT',
    color: '#22d3ee',
    shape: 'box' as const,
    position: [4, 1.2, -30] as [number, number, number],
  },
];

function CyberCamera() {
  const progress = useScrollProgress();
  const lookAt = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = progress;
    const { camera, pointer } = state;

    const z = THREE.MathUtils.lerp(6, -30, t);
    const x = THREE.MathUtils.lerp(2.5, 3.5, t) + Math.sin(t * Math.PI * 1.5) * 1.5 + pointer.x * 1.2;
    const y = 1.2 + Math.sin(t * Math.PI) * 0.6 + pointer.y * 0.35;

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.06);
    lookAt.current.set(x + pointer.x, 0.3, z - 10);
    camera.lookAt(lookAt.current);
  });

  return null;
}

function CyberTunnel() {
  const progress = useScrollProgress();
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        z: -i * 1.1,
        r: 2.2 + (i % 5) * 0.25,
        color: i % 2 === 0 ? '#34d399' : '#22d3ee',
      })),
    []
  );

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(2.5, 0, THREE.MathUtils.lerp(0, 16, progress));
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, i * 0.05]}>
          <torusGeometry args={[ring.r, 0.015, 6, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}

function CyberCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.45}>
      <group position={[3.2, 1.2, -3]}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.1, 2]} />
          <meshStandardMaterial
            color="#010208"
            emissive="#34d399"
            emissiveIntensity={1.3}
            metalness={0.95}
            roughness={0.12}
            wireframe
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.28, 0]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField({ count = 48 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const progress = useScrollProgress();

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 1 + Math.random() * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = -Math.random() * 35;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      pos[i * 3 + 2] += 0.02 + progress * 0.01;
      if (pos[i * 3 + 2] > -2) pos[i * 3 + 2] = -35;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.08} color="#34d399" transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

interface CyberCommandWorldProps {
  lowPower?: boolean;
}

const CyberCommandWorld = ({ lowPower = false }: CyberCommandWorldProps) => {
  const progress = useScrollProgress();

  return (
    <>
      <fog attach="fog" args={['#010208', 14, 55]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[12, 8, 4]} intensity={2.5} color="#34d399" />
      <pointLight position={[4, -3, -12]} intensity={2} color="#22d3ee" />
      <spotLight position={[6, 14, -8]} angle={0.5} penumbra={1} intensity={1} color="#34d399" />

      <CyberCamera />
      <CyberTunnel />
      <CyberCore />
      <SectionVignettes />

      {WORLD_SECTORS.map((sector, i) => {
        const reveal =
          i === 0
            ? 1
            : THREE.MathUtils.clamp((progress - (i - 0.5) * 0.12) * 4, 0, 1);
        if (reveal < 0.08) return null;
        return (
          <InteractiveNode
            key={sector.sectionId}
            position={sector.position}
            color={sector.color}
            label={sector.label}
            shape={sector.shape}
            scale={reveal}
            sectionId={sector.sectionId}
            physics={!lowPower}
          />
        );
      })}

      <Grid
        position={[2.5, -2.5, -12]}
        infiniteGrid
        cellSize={0.55}
        cellThickness={0.6}
        cellColor="#34d399"
        sectionSize={2.5}
        sectionThickness={1.2}
        sectionColor="#22d3ee"
        fadeDistance={42}
        fadeStrength={1.1}
      />

      <ParticleField count={lowPower ? 36 : 64} />
      <Stars
        radius={70}
        depth={45}
        count={lowPower ? 800 : 2200}
        factor={3}
        saturation={0}
        fade
        speed={0.4}
      />
      <Sparkles
        count={lowPower ? 40 : 100}
        scale={[24, 10, 45]}
        position={[3, 0, -10]}
        size={2.2}
        speed={0.25}
        color="#22d3ee"
        opacity={0.5}
      />

      <PostFX lowPower={lowPower} />
    </>
  );
};

export default CyberCommandWorld;
