import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Grid, Stars, Sparkles, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import SectionVignettes from './SectionVignettes';
import InstancedTunnel from './InstancedTunnel';
import ScrollDepthAura from './ScrollDepthAura';
import { getGlobalScrollProgress, getScrollVelocity, subscribeScrollProgress } from '../../lib/scrollState';

const WORLD_SECTORS = [
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

function ScrollCamera() {
  const lookAt = useRef(new THREE.Vector3(2.8, 0, 0));

  useFrame((state) => {
    const t = getGlobalScrollProgress();
    const vel = getScrollVelocity();
    const intro = Math.min(state.clock.elapsedTime / 1.8, 1);
    const easeIntro = 1 - Math.pow(1 - intro, 3);
    const orbit = state.clock.elapsedTime * 0.18;
    const { pointer } = state;

    const heroX = -2.2 + Math.cos(orbit) * 0.5 + pointer.x * 0.3;
    const heroY = 0.6 + Math.sin(orbit * 0.6) * 0.2 + pointer.y * 0.35;
    const heroZ = 7.5 - easeIntro * 0.8;

    const scrollX = 4 + Math.sin(t * Math.PI * 1.4) * 1.5 + pointer.x * 0.5;
    const scrollY = 1 + Math.sin(t * Math.PI) * 0.5 + vel * 8;
    const scrollZ = THREE.MathUtils.lerp(6, -40, t);

    const x = THREE.MathUtils.lerp(heroX, scrollX, t) + vel * 3;
    const y = THREE.MathUtils.lerp(heroY, scrollY, t);
    const z = THREE.MathUtils.lerp(heroZ, scrollZ, t);

    state.camera.position.lerp(new THREE.Vector3(x, y, z), t < 0.06 ? 0.12 : 0.07);
    lookAt.current.set(
      THREE.MathUtils.lerp(2.8, 6 + t * 0.5, t),
      THREE.MathUtils.lerp(0, 0.2, t),
      THREE.MathUtils.lerp(0, -22 - t * 18, t)
    );
    state.camera.lookAt(lookAt.current);

    if ('fov' in state.camera) {
      const cam = state.camera as THREE.PerspectiveCamera;
      const targetFov = 48 + Math.abs(vel) * 140;
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 0.1);
      cam.updateProjectionMatrix();
    }
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

function StreamParticles({ count = 160 }: { count?: number }) {
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
      <pointsMaterial size={0.12} color="#22d3ee" transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function SectorNodes({ lowPower }: { lowPower: boolean }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => subscribeScrollProgress(setProgress), []);

  return (
    <>
      {WORLD_SECTORS.map((sector, i) => {
        const threshold = i * 0.1;
        const reveal = THREE.MathUtils.clamp((progress - threshold) * 3 + 0.4, 0.4, 1);
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
    </>
  );
}

interface ScrollWorldProps {
  lowPower?: boolean;
}

/** Reliable scroll-driven 3D world — camera reads live scroll every frame */
const ScrollWorld = ({ lowPower = false }: ScrollWorldProps) => (
  <>
    <color attach="background" args={['#010208']} />
    <fog attach="fog" args={['#010208', 40, 100]} />

    <ambientLight intensity={0.75} />
    <pointLight position={[0, 4, 6]} intensity={4} color="#34d399" />
    <pointLight position={[10, 10, 6]} intensity={3.5} color="#34d399" />
    <pointLight position={[2, -2, -8]} intensity={3} color="#22d3ee" />
    <spotLight position={[8, 16, -4]} angle={0.45} penumbra={0.8} intensity={1.5} color="#34d399" />

    <ScrollCamera />
    <InstancedTunnel />
    <StreamParticles count={lowPower ? 80 : 180} />
    <ScrollDepthAura count={lowPower ? 200 : 500} />
    <SectionVignettes />

    {HOLO_PANELS.map((panel, i) => (
      <HoloPanel key={panel.label} {...panel} delay={i * 0.7} />
    ))}

    <SectorNodes lowPower={lowPower} />

    <Grid
      position={[2.5, -2.8, -4]}
      infiniteGrid
      cellSize={0.5}
      cellThickness={0.6}
      cellColor="#34d399"
      sectionSize={2.5}
      sectionThickness={1.2}
      sectionColor="#22d3ee"
      fadeDistance={60}
      fadeStrength={0.75}
    />
    <Stars radius={100} depth={60} count={lowPower ? 1500 : 4200} factor={4} saturation={0} fade speed={0.55} />
    <Sparkles count={lowPower ? 90 : 220} scale={[30, 14, 55]} position={[5, 0, -8]} size={3.5} speed={0.45} color="#22d3ee" opacity={0.6} />
  </>
);

export default ScrollWorld;
