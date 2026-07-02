import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import NexusCore from './NexusCore';
import InstancedTunnel from './InstancedTunnel';
import NeuralPulseField from './NeuralPulseField';
import ScrollDepthAura from './ScrollDepthAura';
import { getGlobalScrollProgress, getScrollVelocity, subscribeScrollProgress } from '../../lib/scrollState';

export const WORLD_SECTORS = [
  { sectionId: 'about', label: 'PROFILE', color: '#34d399', shape: 'octahedron' as const, position: [5.5, 0.4, -4] as [number, number, number] },
  { sectionId: 'experience', label: 'CAREER', color: '#22d3ee', shape: 'box' as const, position: [6.5, -0.4, -11] as [number, number, number] },
  { sectionId: 'ventures', label: 'VENTURES', color: '#34d399', shape: 'torus' as const, position: [4.5, 0.8, -17] as [number, number, number] },
  { sectionId: 'speaking', label: 'STAGE', color: '#22d3ee', shape: 'sphere' as const, position: [7, 0.3, -23] as [number, number, number] },
  { sectionId: 'research', label: 'RESEARCH', color: '#34d399', shape: 'octahedron' as const, position: [5, -0.6, -29] as [number, number, number] },
  { sectionId: 'contact', label: 'CONNECT', color: '#22d3ee', shape: 'box' as const, position: [6, 1, -35] as [number, number, number] },
];

const NETWORK_NODES: [number, number, number][] = [
  [5, 1.5, -2], [7.5, 0.5, -4], [4, -0.5, -5], [8, -1, -7],
  [5.5, 2, -8], [3.5, 1, -9], [9, 0, -10], [6, -1.5, -12],
];

const NETWORK_EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 5], [1, 4], [3, 6], [4, 6], [5, 7], [3, 7], [0, 4],
];

function CinematicCamera() {
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
    const scrollZ = THREE.MathUtils.lerp(6, -38, t);

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
      cam.fov = THREE.MathUtils.lerp(cam.fov, 48 + Math.abs(vel) * 120, 0.1);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

function DataNetwork({ lowPower }: { lowPower: boolean }) {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (linesRef.current) linesRef.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  const connections = useMemo(() => {
    if (lowPower) return null;
    return NETWORK_EDGES.map(([a, b], i) => {
      const p1 = new THREE.Vector3(...NETWORK_NODES[a]);
      const p2 = new THREE.Vector3(...NETWORK_NODES[b]);
      const mid = p1.clone().lerp(p2, 0.5);
      mid.y += 0.4;
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(16));
      const mat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? '#34d399' : '#22d3ee',
        transparent: true,
        opacity: 0.55,
      });
      return <primitive key={i} object={new THREE.Line(geo, mat)} />;
    });
  }, [lowPower]);

  return (
    <group ref={linesRef} position={[0, 0, -3]}>
      {NETWORK_NODES.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#34d399' : '#22d3ee'} />
        </mesh>
      ))}
      {connections}
    </group>
  );
}

function StreamParticles({ count = 140 }: { count?: number }) {
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
      if (pos[i * 3 + 2] > 2) pos[i * 3 + 2] = -22;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.14} color="#22d3ee" transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function ScrollGrid() {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const t = getGlobalScrollProgress();
    group.current.position.z = THREE.MathUtils.lerp(-4, -18, t);
  });
  return (
    <group ref={group} position={[2.5, -2.8, -4]}>
      <gridHelper args={[80, 40, '#34d399', '#0f3d32']} />
    </group>
  );
}

interface CyberEcosystemProps {
  lowPower?: boolean;
}

/** Stable scroll world — no PostFX, no drei Text/Line/Image */
const CyberEcosystem = ({ lowPower = false }: CyberEcosystemProps) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => subscribeScrollProgress(setProgress), []);

  return (
    <>
      <color attach="background" args={['#010208']} />
      <fog attach="fog" args={['#010208', 35, 90]} />

      <ambientLight intensity={0.8} />
      <pointLight position={[0, 4, 6]} intensity={5} color="#34d399" />
      <pointLight position={[10, 10, 6]} intensity={4} color="#22d3ee" />
      <pointLight position={[2, -2, -8]} intensity={3} color="#22d3ee" />

      <CinematicCamera />
      <NexusCore />
      <NeuralPulseField lowPower={lowPower} />
      <DataNetwork lowPower={lowPower} />
      <StreamParticles count={lowPower ? 70 : 160} />
      <ScrollDepthAura count={lowPower ? 180 : 400} />
      <InstancedTunnel />
      <ScrollGrid />

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
            physics={false}
          />
        );
      })}

      <Stars radius={100} depth={60} count={lowPower ? 2000 : 5000} factor={4} saturation={0} fade speed={0.6} />
      <Sparkles count={lowPower ? 80 : 180} scale={[32, 16, 55]} position={[5, 0, -8]} size={3.5} speed={0.5} color="#22d3ee" opacity={0.65} />
    </>
  );
};

export default CyberEcosystem;
