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
    position: [-4, 0.5, -6] as [number, number, number],
  },
  {
    sectionId: 'experience',
    label: 'CAREER',
    color: '#22d3ee',
    shape: 'box' as const,
    position: [4, -0.5, -11] as [number, number, number],
  },
  {
    sectionId: 'ventures',
    label: 'VENTURES',
    color: '#34d399',
    shape: 'torus' as const,
    position: [-3.5, 1, -16] as [number, number, number],
  },
  {
    sectionId: 'speaking',
    label: 'STAGE',
    color: '#22d3ee',
    shape: 'sphere' as const,
    position: [4.5, 0.5, -21] as [number, number, number],
  },
  {
    sectionId: 'research',
    label: 'RESEARCH',
    color: '#34d399',
    shape: 'octahedron' as const,
    position: [-2.5, -0.8, -26] as [number, number, number],
  },
  {
    sectionId: 'contact',
    label: 'CONNECT',
    color: '#22d3ee',
    shape: 'box' as const,
    position: [0, 1.2, -32] as [number, number, number],
  },
];

function CyberCamera() {
  const progress = useScrollProgress();
  const lookAt = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = progress;
    const { camera, pointer } = state;

    const z = THREE.MathUtils.lerp(5, -34, t);
    const x = Math.sin(t * Math.PI * 1.5) * 2.8 + pointer.x * 1.5;
    const y = 1.2 + Math.sin(t * Math.PI) * 0.7 + pointer.y * 0.4;

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
    lookAt.current.set(Math.sin(t * 2) * 1.2, 0.2, z - 12);
    camera.lookAt(lookAt.current);
  });

  return null;
}

function CyberTunnel() {
  const progress = useScrollProgress();
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        z: -i * 1.1,
        r: 2.2 + (i % 5) * 0.25,
        color: i % 2 === 0 ? '#34d399' : '#22d3ee',
      })),
    []
  );

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z = THREE.MathUtils.lerp(0, 18, progress);
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, i * 0.05]}>
          <torusGeometry args={[ring.r, 0.012, 6, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function CyberCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
      <mesh ref={meshRef} position={[0, 1.5, -4]}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#010208"
          emissive="#34d399"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.15}
          wireframe
        />
      </mesh>
      <mesh position={[0, 1.5, -4]}>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

function ParticleField({ count = 48 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const progress = useScrollProgress();

    const geometry = useMemo(() => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 20;
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
      <pointsMaterial size={0.06} color="#34d399" transparent opacity={0.6} sizeAttenuation />
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
      <fog attach="fog" args={['#010208', 6, 50]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 8, 2]} intensity={2} color="#34d399" />
      <pointLight position={[-8, -3, -15]} intensity={1.4} color="#22d3ee" />
      <spotLight position={[0, 14, -10]} angle={0.45} penumbra={1} intensity={0.7} color="#34d399" />

      <CyberCamera />
      <CyberTunnel />
      <CyberCore />
      <SectionVignettes />

      {!lowPower ? (
        WORLD_SECTORS.map((sector, i) => {
          const reveal = THREE.MathUtils.clamp((progress - i * 0.1) * 3.5, 0, 1);
          if (reveal < 0.05) return null;
          return (
            <InteractiveNode
              key={sector.sectionId}
              position={sector.position}
              color={sector.color}
              label={sector.label}
              shape={sector.shape}
              scale={reveal}
              sectionId={sector.sectionId}
              physics
            />
          );
        })
      ) : (
        WORLD_SECTORS.map((sector, i) => {
          const reveal = THREE.MathUtils.clamp((progress - i * 0.1) * 3.5, 0, 1);
          if (reveal < 0.05) return null;
          return (
            <InteractiveNode
              key={sector.sectionId}
              position={sector.position}
              color={sector.color}
              label={sector.label}
              shape={sector.shape}
              scale={reveal}
              sectionId={sector.sectionId}
            />
          );
        })
      )}

      <Grid
        position={[0, -2.5, -14]}
        infiniteGrid
        cellSize={0.55}
        cellThickness={0.5}
        cellColor="#34d399"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#22d3ee"
        fadeDistance={40}
        fadeStrength={1.3}
      />

      {!lowPower && <ParticleField count={56} />}
      <Stars
        radius={70}
        depth={45}
        count={lowPower ? 500 : 2500}
        factor={2.5}
        saturation={0}
        fade
        speed={0.35}
      />
      <Sparkles
        count={lowPower ? 25 : 90}
        scale={[30, 12, 50]}
        size={1.8}
        speed={0.2}
        color="#22d3ee"
        opacity={0.35}
      />

      {!lowPower && <PostFX lowPower={false} />}
    </>
  );
};

export default CyberCommandWorld;
