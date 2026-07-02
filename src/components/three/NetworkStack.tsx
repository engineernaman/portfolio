import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

type PartDef = {
  id: string;
  label: string;
  position: THREE.Vector3;
  explode: THREE.Vector3;
  scale: [number, number, number];
  color: string;
  emissive: string;
  kind: 'box' | 'slab' | 'chip' | 'node' | 'ring';
};

const PARTS: PartDef[] = [
  { id: 'chassis', label: 'Secure Core', position: new THREE.Vector3(0, 0, 0), explode: new THREE.Vector3(0, 0, 0), scale: [2.4, 1.1, 1.6], color: '#0a1628', emissive: '#22d3ee', kind: 'box' },
  { id: 'board', label: 'Motherboard', position: new THREE.Vector3(0, 0.62, 0.1), explode: new THREE.Vector3(0, 0.9, 0.2), scale: [2.1, 0.06, 1.35], color: '#041a12', emissive: '#34d399', kind: 'slab' },
  { id: 'cpu', label: 'Threat Engine', position: new THREE.Vector3(0, 0.78, 0.35), explode: new THREE.Vector3(0, 1.45, 0.65), scale: [0.55, 0.12, 0.55], color: '#0f172a', emissive: '#34d399', kind: 'chip' },
  { id: 'ram-a', label: 'Memory Bank A', position: new THREE.Vector3(-0.55, 0.72, 0.2), explode: new THREE.Vector3(-1.35, 0.95, 0.35), scale: [0.18, 0.42, 0.7], color: '#0c1a14', emissive: '#22d3ee', kind: 'chip' },
  { id: 'ram-b', label: 'Memory Bank B', position: new THREE.Vector3(0.55, 0.72, 0.2), explode: new THREE.Vector3(1.35, 0.95, 0.35), scale: [0.18, 0.42, 0.7], color: '#0c1a14', emissive: '#22d3ee', kind: 'chip' },
  { id: 'nic-l', label: 'NIC · Ingress', position: new THREE.Vector3(-1.05, 0.15, 0.45), explode: new THREE.Vector3(-1.85, 0.35, 0.75), scale: [0.12, 0.35, 0.85], color: '#0f172a', emissive: '#22d3ee', kind: 'chip' },
  { id: 'nic-r', label: 'NIC · Egress', position: new THREE.Vector3(1.05, 0.15, 0.45), explode: new THREE.Vector3(1.85, 0.35, 0.75), scale: [0.12, 0.35, 0.85], color: '#0f172a', emissive: '#22d3ee', kind: 'chip' },
  { id: 'fw', label: 'Firewall Ring', position: new THREE.Vector3(0, 0, 0), explode: new THREE.Vector3(0, 0, 0), scale: [3.2, 3.2, 3.2], color: '#34d399', emissive: '#34d399', kind: 'ring' },
  { id: 'node-1', label: 'Edge Node', position: new THREE.Vector3(-1.8, 1.1, -0.6), explode: new THREE.Vector3(-2.8, 1.9, -1.2), scale: [0.32, 0.32, 0.32], color: '#22d3ee', emissive: '#22d3ee', kind: 'node' },
  { id: 'node-2', label: 'Cloud Relay', position: new THREE.Vector3(1.9, 0.9, -0.4), explode: new THREE.Vector3(2.9, 1.6, -1.0), scale: [0.28, 0.28, 0.28], color: '#34d399', emissive: '#34d399', kind: 'node' },
  { id: 'node-3', label: 'SOC Beacon', position: new THREE.Vector3(0.2, -1.0, -1.1), explode: new THREE.Vector3(0.3, -2.0, -1.8), scale: [0.26, 0.26, 0.26], color: '#a7f3d0', emissive: '#34d399', kind: 'node' },
];

const LINKS: [string, string][] = [
  ['chassis', 'node-1'],
  ['chassis', 'node-2'],
  ['chassis', 'node-3'],
  ['cpu', 'node-1'],
  ['cpu', 'node-2'],
];

function partById(id: string) {
  return PARTS.find((p) => p.id === id)!;
}

function ExplodablePart({
  def,
  explode,
  hovered,
}: {
  def: PartDef;
  explode: number;
  hovered: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const target = def.position.clone().add(def.explode.clone().multiplyScalar(explode));
    ref.current.position.lerp(target, 0.14);
  });

  const showLabel = hovered && explode > 0.35 && def.kind !== 'ring';

  return (
    <group ref={ref} position={def.position.toArray()}>
      {def.kind === 'box' && (
        <RoundedBox args={def.scale} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={0.35} metalness={0.85} roughness={0.25} />
        </RoundedBox>
      )}
      {def.kind === 'slab' && (
        <mesh>
          <boxGeometry args={def.scale} />
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
        </mesh>
      )}
      {def.kind === 'chip' && (
        <mesh>
          <boxGeometry args={def.scale} />
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={0.7} metalness={0.95} roughness={0.15} />
        </mesh>
      )}
      {def.kind === 'node' && (
        <mesh>
          <icosahedronGeometry args={[def.scale[0], 1]} />
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={0.9} metalness={0.8} roughness={0.15} wireframe={explode > 0.4} />
        </mesh>
      )}
      {def.kind === 'ring' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.55, 0.04, 16, 96]} />
          <meshBasicMaterial color={def.color} transparent opacity={0.2 + explode * 0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {showLabel && (
        <Html distanceFactor={8} position={[0, def.scale[1] * 0.8 + 0.2, 0]} center>
          <span className="px-2 py-0.5 rounded border border-white/15 bg-black/70 font-mono text-[9px] text-emerald-200/90 whitespace-nowrap pointer-events-none">
            {def.label}
          </span>
        </Html>
      )}
    </group>
  );
}

function NetworkLinks({ explode }: { explode: number }) {
  const lines = LINKS.map(([a, b]) => {
    const pa = partById(a).position.clone().add(partById(a).explode.clone().multiplyScalar(explode));
    const pb = partById(b).position.clone().add(partById(b).explode.clone().multiplyScalar(explode));
    return [pa, pb] as const;
  });

  return (
    <>
      {lines.map(([start, end], i) => (
        <Line key={i} points={[start, end]} color="#34d399" transparent opacity={0.15 + explode * 0.3} lineWidth={1} />
      ))}
    </>
  );
}

interface NetworkStackProps {
  reducedMotion?: boolean;
  position?: [number, number, number];
  scale?: number;
}

const NetworkStack = ({ reducedMotion = false, position = [3.4, 0.1, 0], scale = 1 }: NetworkStackProps) => {
  const [hovered, setHovered] = useState(false);
  const [explode, setExplode] = useState(0);
  const explodeRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  useFrame((state, delta) => {
    const target = hovered ? 1 : 0;
    const next = THREE.MathUtils.damp(explodeRef.current, target, reducedMotion ? 8 : 5, delta);
    explodeRef.current = next;
    if (Math.abs(next - explode) > 0.006) setExplode(next);
    if (groupRef.current && !hovered && !reducedMotion) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    }

    if (rootRef.current) {
      const heroFade = 1 - THREE.MathUtils.smoothstep(progress, 0.08, 0.28);
      rootRef.current.visible = heroFade > 0.02;
      rootRef.current.scale.setScalar(scale * (0.7 + heroFade * 0.3));
    }
  });

  return (
    <group ref={rootRef} position={position}>
      <group
        ref={groupRef}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
      >
        <NetworkLinks explode={explode} />
        {PARTS.map((def) => (
          <ExplodablePart key={def.id} def={def} explode={explode} hovered={hovered} />
        ))}
      </group>
      <pointLight position={[2, 3, 3]} intensity={4} color="#34d399" />
      <pointLight position={[-2, 1, 2]} intensity={2} color="#22d3ee" />
    </group>
  );
};

export default NetworkStack;
