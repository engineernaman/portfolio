import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars, Sparkles, Text, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import PostFX from './PostFX';
import SectionVignettes from './SectionVignettes';
import SpeakerPhotoGallery3D from './SpeakerPhotoGallery3D';
import NexusCore from './NexusCore';
import InstancedTunnel from './InstancedTunnel';
import NeuralPulseField from './NeuralPulseField';
import ScrollDepthAura from './ScrollDepthAura';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getScrollVelocity } from '../../lib/scrollState';

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
  const lookAt = useRef(new THREE.Vector3(2.8, 0, 0));
  const fovTarget = useRef(48);

  useFrame((state) => {
    const t = progress;
    const vel = getScrollVelocity();
    const intro = Math.min(state.clock.elapsedTime / 1.8, 1);
    const easeIntro = 1 - Math.pow(1 - intro, 3);
    const orbit = state.clock.elapsedTime * 0.18;
    const { pointer } = state;

    // Hero: camera left-of-center, framing sentinel on the right (Igloo-style)
    const heroX = -2.2 + Math.cos(orbit) * 0.5 + pointer.x * 0.3;
    const heroY = 0.6 + Math.sin(orbit * 0.6) * 0.2 + pointer.y * 0.35;
    const heroZ = 7.5 - easeIntro * 0.8;

    const scrollX = 4 + Math.sin(t * Math.PI * 1.4) * 1.5 + pointer.x * 0.5;
    const scrollY = 1 + Math.sin(t * Math.PI) * 0.5 + vel * 8;
    const scrollZ = THREE.MathUtils.lerp(6, -38, t);

    const x = THREE.MathUtils.lerp(heroX, scrollX, t) + vel * 3;
    const y = THREE.MathUtils.lerp(heroY, scrollY, t);
    const z = THREE.MathUtils.lerp(heroZ, scrollZ, t);

    const lerpSpeed = t < 0.06 ? 0.12 : 0.06;
    state.camera.position.lerp(new THREE.Vector3(x, y, z), lerpSpeed);
    lookAt.current.set(
      THREE.MathUtils.lerp(2.8, 6 + t * 0.5, t),
      THREE.MathUtils.lerp(0, 0.2, t),
      THREE.MathUtils.lerp(0, -22 - t * 18, t)
    );
    state.camera.lookAt(lookAt.current);

    fovTarget.current = THREE.MathUtils.lerp(fovTarget.current, 48 + Math.abs(vel) * 160, 0.08);
    if ('fov' in state.camera) {
      const cam = state.camera as THREE.PerspectiveCamera;
      cam.fov = THREE.MathUtils.lerp(cam.fov, fovTarget.current, 0.1);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

function DynamicFog() {
  const progress = useScrollProgress();

  useFrame(({ scene }) => {
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = THREE.MathUtils.lerp(45, 28, progress);
      scene.fog.far = THREE.MathUtils.lerp(95, 75, progress);
    }
  });

  return <fog attach="fog" args={['#010208', 45, 95]} />;
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

interface CyberEcosystemProps {
  lowPower?: boolean;
}

const CyberEcosystem = ({ lowPower = false }: CyberEcosystemProps) => {
  const progress = useScrollProgress();

  return (
    <>
      <color attach="background" args={['#010208']} />
      <DynamicFog />

      <ambientLight intensity={0.7} />
      <pointLight position={[0, 4, 6]} intensity={4} color="#34d399" />
      <pointLight position={[10, 10, 6]} intensity={3.5} color="#34d399" />
      <pointLight position={[2, -2, -8]} intensity={3} color="#22d3ee" />
      <spotLight position={[8, 16, -4]} angle={0.45} penumbra={0.8} intensity={1.5} color="#34d399" />
      <spotLight position={[4, -6, -12]} angle={0.5} penumbra={1} intensity={0.8} color="#6366f1" />

      <CinematicCamera />
      <SpeakerPhotoGallery3D lowPower={lowPower} />
      <NexusCore />
      <NeuralPulseField lowPower={lowPower} />
      <DataNetwork lowPower={lowPower} />
      <StreamParticles count={lowPower ? 80 : 180} />
      <ScrollDepthAura count={lowPower ? 200 : 450} />
      <InstancedTunnel />

      {HOLO_PANELS.map((panel, i) => (
        <HoloPanel key={panel.label} {...panel} delay={i * 0.7} />
      ))}

      <SectionVignettes />

      {WORLD_SECTORS.map((sector, i) => {
        const threshold = i * 0.12;
        const reveal = THREE.MathUtils.clamp((progress - threshold) * 3.5 + 0.35, 0.35, 1);
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
      position={[2.5, -2.8, -4]}
      infiniteGrid
      cellSize={0.5}
      cellThickness={0.55}
      cellColor="#34d399"
      sectionSize={2.5}
      sectionThickness={1.2}
      sectionColor="#22d3ee"
      fadeDistance={55}
      fadeStrength={0.85}
    />

    <Stars radius={100} depth={60} count={lowPower ? 1500 : 4000} factor={4} saturation={0} fade speed={0.55} />
    <Sparkles count={lowPower ? 80 : 200} scale={[28, 14, 50]} position={[5, 0, -8]} size={3.5} speed={0.45} color="#22d3ee" opacity={0.55} />

      <PostFX lowPower={lowPower} />
    </>
  );
};

export default CyberEcosystem;
