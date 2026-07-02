import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, RoundedBox, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

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
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={0.55} metalness={0.85} roughness={0.2} />
        </RoundedBox>
      )}
      {def.kind === 'slab' && (
        <mesh>
          <boxGeometry args={def.scale} />
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={0.8} metalness={0.9} roughness={0.15} />
        </mesh>
      )}
      {def.kind === 'chip' && (
        <mesh>
          <boxGeometry args={def.scale} />
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={1.2} metalness={0.95} roughness={0.1} />
        </mesh>
      )}
      {def.kind === 'node' && (
        <mesh>
          <icosahedronGeometry args={[def.scale[0], 1]} />
          <meshStandardMaterial color={def.color} emissive={def.emissive} emissiveIntensity={1.8} metalness={0.8} roughness={0.1} wireframe={explode > 0.4} />
        </mesh>
      )}
      {def.kind === 'ring' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.55, 0.04, 16, 96]} />
          <meshBasicMaterial color={def.color} transparent opacity={0.35 + explode * 0.25} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {showLabel && (
        <Html distanceFactor={8} position={[0, def.scale[1] * 0.8 + 0.2, 0]} center>
          <span className="px-2 py-0.5 rounded border border-emerald-500/40 bg-[rgba(6,10,16,0.92)] font-mono text-[9px] text-emerald-300 whitespace-nowrap pointer-events-none">
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
        <Line
          key={i}
          points={[start, end]}
          color="#34d399"
          transparent
          opacity={0.25 + explode * 0.45}
          lineWidth={1}
        />
      ))}
    </>
  );
}

function NetworkStack({ reducedMotion }: { reducedMotion?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [explode, setExplode] = useState(0);
  const explodeRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const target = hovered ? 1 : 0;
    const next = THREE.MathUtils.damp(explodeRef.current, target, reducedMotion ? 8 : 5, delta);
    explodeRef.current = next;
    if (Math.abs(next - explode) > 0.006) setExplode(next);
    if (groupRef.current && !hovered && !reducedMotion) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
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
      <Sparkles count={50} scale={10} size={3} speed={0.4} color="#22d3ee" />
      <pointLight position={[4, 6, 5]} intensity={12} color="#34d399" />
      <pointLight position={[-5, 2, 3]} intensity={6} color="#22d3ee" />
      <spotLight position={[0, 8, 6]} intensity={2.5} angle={0.5} penumbra={1} color="#d1fae5" />
    </group>
  );
}

interface HeroExplodeCanvasProps {
  reducedMotion?: boolean;
}

const HeroExplodeCanvas = ({ reducedMotion = false }: HeroExplodeCanvasProps) => (
  <div className="relative w-full h-full min-h-[380px] lg:min-h-[calc(100vh-9rem)] rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#010208] shadow-[inset_0_0_120px_rgba(52,211,153,0.06)]">
    <Canvas
      dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0.8, 6.5], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', minHeight: 380 }}
    >
      <color attach="background" args={['#010208']} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 8, 4]} intensity={1.4} color="#ecfdf5" />
      <Suspense fallback={null}>
        <NetworkStack reducedMotion={reducedMotion} />
        <Stars radius={45} count={600} factor={2.5} fade speed={0.3} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.35}
          maxPolarAngle={Math.PI / 1.65}
          minPolarAngle={Math.PI / 3.5}
        />
      </Suspense>
    </Canvas>
    <div className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase pointer-events-none">
      Network Stack · Live
    </div>
    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
      <p className="font-mono text-[10px] tracking-wide text-cyan-400/80">
        Hover to disassemble · drag to orbit
      </p>
    </div>
  </div>
);

export default HeroExplodeCanvas;
