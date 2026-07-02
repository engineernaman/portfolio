import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars, Sparkles, Text, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import PostFX from './PostFX';
import SectionVignettes from './SectionVignettes';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const WORLD_SECTORS = [
  { sectionId: 'about', label: 'PROFILE', color: '#34d399', shape: 'octahedron' as const, position: [5.5, 0.4, -4] as [number, number, number] },
  { sectionId: 'experience', label: 'CAREER', color: '#22d3ee', shape: 'box' as const, position: [6.5, -0.4, -11] as [number, number, number] },
  { sectionId: 'ventures', label: 'VENTURES', color: '#34d399', shape: 'torus' as const, position: [4.5, 0.8, -17] as [number, number, number] },
  { sectionId: 'speaking', label: 'STAGE', color: '#22d3ee', shape: 'sphere' as const, position: [7, 0.3, -23] as [number, number, number] },
  { sectionId: 'research', label: 'RESEARCH', color: '#34d399', shape: 'octahedron' as const, position: [5, -0.6, -29] as [number, number, number] },
  { sectionId: 'contact', label: 'CONNECT', color: '#22d3ee', shape: 'box' as const, position: [6, 1, -35] as [number, number, number] },
];

const HOLO_PANELS = [
  { label: 'ZERO TRUST', sub: 'IDENTITY', pos: [7.8, 2.2, -1.5] as [number, number, number], rot: [0, -0.4, 0.05] as [number, number, number] },
  { label: 'THREAT INTEL', sub: 'SOC OPS', pos: [8.5, -0.8, -3] as [number, number, number], rot: [0, -0.55, -0.08] as [number, number, number] },
  { label: 'CLOUD SEC', sub: 'DEVSECOPS', pos: [3.8, 2.5, -2] as [number, number, number], rot: [0, 0.35, 0.06] as [number, number, number] },
  { label: 'AI DEFENSE', sub: 'LLM GUARD', pos: [3.2, -1.2, -4.5] as [number, number, number], rot: [0, 0.5, -0.05] as [number, number, number] },
  { label: 'TELECOM', sub: '5G · SAT', pos: [9.2, 1.2, -6] as [number, number, number], rot: [0, -0.7, 0.04] as [number, number, number] },
  { label: 'FORENSICS', sub: 'DFIR', pos: [2.8, 0.5, -7] as [number, number, number], rot: [0, 0.65, 0.03] as [number, number, number] },
];

const NETWORK_NODES: [number, number, number][] = [
  [5, 1.5, -2], [7.5, 0.5, -4], [4, -0.5, -5], [8, -1, -7],
  [5.5, 2, -8], [3.5, 1, -9], [9, 0, -10], [6, -1.5, -12],
];

const NETWORK_EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 5], [1, 4], [3, 6], [4, 6], [5, 7], [3, 7], [0, 4],
];

function CinematicCamera() {
  const progress = useScrollProgress();
  const lookAt = useRef(new THREE.Vector3(5.5, 0.3, -4));

  useFrame((state) => {
    const t = progress;
    const intro = Math.min(state.clock.elapsedTime / 2.8, 1);
    const easeIntro = 1 - Math.pow(1 - intro, 3);
    const orbit = state.clock.elapsedTime * 0.12;

    const heroX = 3.5 + Math.cos(orbit) * 1.8;
    const heroY = 1.4 + Math.sin(orbit * 0.7) * 0.35 + state.pointer.y * 0.4;
    const heroZ = 9 - easeIntro * 2;

    const scrollX = 5 + Math.sin(t * Math.PI * 1.4) * 2 + state.pointer.x * 0.8;
    const scrollY = 1 + Math.sin(t * Math.PI) * 0.8;
    const scrollZ = THREE.MathUtils.lerp(7, -32, t);

    const x = THREE.MathUtils.lerp(heroX, scrollX, t);
    const y = THREE.MathUtils.lerp(heroY, scrollY, t);
    const z = THREE.MathUtils.lerp(heroZ, scrollZ, t);

    state.camera.position.lerp(new THREE.Vector3(x, y, z), 0.045);
    lookAt.current.set(
      THREE.MathUtils.lerp(5.5, 5.5 + t * 0.5, t),
      THREE.MathUtils.lerp(0.3, 0, t),
      THREE.MathUtils.lerp(-2, -18 - t * 14, t)
    );
    state.camera.lookAt(lookAt.current);
  });

  return null;
}

function HoloPanel({
  label,
  sub,
  position,
  rotation,
  delay,
}: {
  label: string;
  sub: string;
  position: [number, number, number];
  rotation: [number, number, number];
  delay: number;
}) {
  const group = useRef<THREE.Group>(null);
  const borderGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.2, 1.3)), []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + delay;
    group.current.position.y = position[1] + Math.sin(t * 0.9) * 0.12;
    group.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.03;
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[2.2, 1.3]} />
        <meshPhysicalMaterial
          color="#001812"
          transparent
          opacity={0.42}
          metalness={0.85}
          roughness={0.15}
          emissive="#34d399"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={borderGeo} position={[0, 0, 0.01]}>
        <lineBasicMaterial color="#34d399" transparent opacity={0.85} />
      </lineSegments>
      <Billboard follow lockZ={false}>
        <Text position={[0, 0.12, 0.05]} fontSize={0.16} color="#34d399" anchorX="center" outlineWidth={0.02} outlineColor="#010208">
          {label}
        </Text>
        <Text position={[0, -0.18, 0.05]} fontSize={0.09} color="#22d3ee" anchorX="center" fillOpacity={0.7}>
          {sub}
        </Text>
      </Billboard>
    </group>
  );
}

function ShieldCore() {
  const core = useRef<THREE.Group>(null);
  const pulse = useRef(0);

  useFrame((state) => {
    if (!core.current) return;
    pulse.current = 0.85 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    core.current.rotation.y = state.clock.elapsedTime * 0.18;
    core.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && child.geometry.type === 'TorusGeometry') {
        child.rotation.z = state.clock.elapsedTime * (0.15 + i * 0.05) * (i % 2 === 0 ? 1 : -1);
      }
    });
  });

  return (
    <group ref={core} position={[5.5, 0.4, -2]}>
      {[2.2, 1.75, 1.3].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.3]}>
          <torusGeometry args={[r, 0.025, 8, 80]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#34d399' : '#22d3ee'} transparent opacity={0.35 + i * 0.1} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color="#010208"
          emissive="#22d3ee"
          emissiveIntensity={1.8 * pulse.current}
          metalness={0.95}
          roughness={0.08}
          wireframe
        />
      </mesh>
      <mesh scale={1.15}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.12, 6]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DataNetwork({ lowPower }: { lowPower: boolean }) {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  const nodeMeshes = NETWORK_NODES.map((pos, i) => (
    <mesh key={i} position={pos}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshBasicMaterial color={i % 2 === 0 ? '#34d399' : '#22d3ee'} />
    </mesh>
  ));

  const connections = NETWORK_EDGES.map(([a, b], i) => {
    const p1 = new THREE.Vector3(...NETWORK_NODES[a]);
    const p2 = new THREE.Vector3(...NETWORK_NODES[b]);
    const mid = p1.clone().lerp(p2, 0.5);
    mid.y += 0.4 + (i % 3) * 0.15;
    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const points = curve.getPoints(lowPower ? 12 : 24);
    return (
      <Line
        key={i}
        points={points}
        color={i % 2 === 0 ? '#34d399' : '#22d3ee'}
        lineWidth={1}
        transparent
        opacity={0.5}
      />
    );
  });

  return (
    <group ref={linesRef} position={[0, 0, -3]}>
      {nodeMeshes}
      {!lowPower && connections}
    </group>
  );
}

function StreamParticles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const speeds = useMemo(() => new Float32Array(count), [count]);

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 3 + Math.random() * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = -Math.random() * 20;
      speeds[i] = 0.02 + Math.random() * 0.04;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count, speeds]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 2] += speeds[i];
      pos[i * 3 + 1] += Math.sin(pos[i * 3 + 2] * 0.5) * 0.004;
      if (pos[i * 3 + 2] > 2) {
        pos[i * 3 + 2] = -22;
        pos[i * 3] = 3 + Math.random() * 8;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.1} color="#22d3ee" transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function CyberTunnel() {
  const progress = useScrollProgress();
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        z: -i * 1.05,
        r: 2.4 + (i % 6) * 0.2,
        color: i % 2 === 0 ? '#34d399' : '#22d3ee',
      })),
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.set(5.5, 0, THREE.MathUtils.lerp(0, 20, progress));
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, i * 0.04]}>
          <torusGeometry args={[ring.r, 0.02, 8, 72]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

interface CyberEcosystemProps {
  lowPower?: boolean;
}

const CyberEcosystem = ({ lowPower = false }: CyberEcosystemProps) => {
  const progress = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#010208']} />
      <fog attach="fog" args={['#010208', 18, 60]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 6]} intensity={3} color="#34d399" />
      <pointLight position={[2, -2, -8]} intensity={2.5} color="#22d3ee" />
      <spotLight position={[8, 16, -4]} angle={0.45} penumbra={0.8} intensity={1.5} color="#34d399" />
      <spotLight position={[4, -6, -12]} angle={0.5} penumbra={1} intensity={0.8} color="#6366f1" />

      <CinematicCamera />
      <ShieldCore />
      <DataNetwork lowPower={lowPower} />
      <StreamParticles count={lowPower ? 60 : 140} />
      <CyberTunnel />

      {HOLO_PANELS.map((panel, i) => (
        <HoloPanel key={panel.label} {...panel} delay={i * 0.7} />
      ))}

      <SectionVignettes />

      {WORLD_SECTORS.map((sector, i) => {
        const reveal = i === 0 ? 1 : THREE.MathUtils.clamp((progress - (i - 0.4) * 0.1) * 4.5, 0, 1);
        if (reveal < 0.06) return null;
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
        position={[5.5, -2.8, -10]}
        infiniteGrid
        cellSize={0.5}
        cellThickness={0.7}
        cellColor="#34d399"
        sectionSize={2.5}
        sectionThickness={1.4}
        sectionColor="#22d3ee"
        fadeDistance={45}
        fadeStrength={1}
      />

      <Stars radius={80} depth={50} count={lowPower ? 1200 : 3500} factor={4} saturation={0} fade speed={0.5} />
      <Sparkles count={lowPower ? 60 : 160} scale={[28, 14, 50]} position={[5, 0, -8]} size={3} speed={0.4} color="#22d3ee" opacity={0.65} />

      <PostFX lowPower={lowPower} />
    </>
  );
};

export default CyberEcosystem;
