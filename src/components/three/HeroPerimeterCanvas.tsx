import { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

type BeaconDef = {
  id: string;
  label: string;
  sub: string;
  angle: number;
  ring: number;
  color: string;
  explode: THREE.Vector3;
};

const BEACONS: BeaconDef[] = [
  { id: 'ai', label: 'AI Guard', sub: 'LLM · MLSEC', angle: 0, ring: 0, color: '#a78bfa', explode: new THREE.Vector3(0, 1.8, 0.4) },
  { id: 'cloud', label: 'Cloud', sub: 'DEVSECOPS', angle: Math.PI * 0.55, ring: 1, color: '#22d3ee', explode: new THREE.Vector3(1.6, 0.6, 1.2) },
  { id: 'telco', label: 'Telco', sub: '5G · SAT', angle: Math.PI * 1.1, ring: 0, color: '#34d399', explode: new THREE.Vector3(-1.4, 0.8, 0.9) },
  { id: 'gov', label: 'Gov', sub: 'ZERO TRUST', angle: Math.PI * 1.65, ring: 2, color: '#fbbf24', explode: new THREE.Vector3(-1.2, -0.5, 1.4) },
  { id: 'soc', label: 'SOC', sub: 'THREAT OPS', angle: Math.PI * 2.1, ring: 1, color: '#f472b6', explode: new THREE.Vector3(1.3, -0.7, 1.1) },
  { id: 'edge', label: 'Edge', sub: 'IOT · OT', angle: Math.PI * 2.65, ring: 2, color: '#38bdf8', explode: new THREE.Vector3(0.2, -1.6, 0.8) },
];

const RING_RADII = [2.1, 2.65, 3.15];

function RadarSweep({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * (active ? 1.4 : 0.45);
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[3.6, 0.05, 0.02, 64, 1, true, 0, Math.PI / 3]} />
      <meshBasicMaterial color="#34d399" transparent opacity={active ? 0.22 : 0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  );
}

function OrbitalRings({ spread }: { spread: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.12;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <group ref={group}>
      {RING_RADII.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.18, 0, i * 0.4]} scale={1 + spread * 0.35}>
          <torusGeometry args={[r, 0.018, 8, 128]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#34d399' : '#22d3ee'} transparent opacity={0.25 + spread * 0.2} />
        </mesh>
      ))}
    </group>
  );
}

function CommandCore({ spread }: { spread: number }) {
  const core = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!core.current) return;
    const t = state.clock.elapsedTime;
    core.current.rotation.y = t * 0.35;
    core.current.position.y = Math.sin(t * 0.9) * 0.08 + spread * 0.25;
  });

  const layers = useMemo(
    () => [
      { y: 0, scale: 1, color: '#22d3ee' },
      { y: 0.35 + spread * 0.5, scale: 0.72, color: '#34d399' },
      { y: -0.32 - spread * 0.4, scale: 0.58, color: '#6366f1' },
    ],
    [spread]
  );

  return (
    <group ref={core}>
      {layers.map((layer, i) => (
        <mesh key={i} position={[0, layer.y, 0]} scale={layer.scale}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#0a1628" emissive={layer.color} emissiveIntensity={0.6 + spread * 0.5} metalness={0.9} roughness={0.15} wireframe={i > 0} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#010208" emissive="#34d399" emissiveIntensity={1.2 + spread} metalness={1} roughness={0.05} />
      </mesh>
    </group>
  );
}

function SectorBeacon({
  def,
  spread,
  hovered,
}: {
  def: BeaconDef;
  spread: number;
  hovered: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const base = useMemo(() => {
    const r = RING_RADII[def.ring];
    return new THREE.Vector3(Math.cos(def.angle) * r, Math.sin(def.angle * 0.5) * 0.35, Math.sin(def.angle) * r);
  }, [def]);

  useFrame(() => {
    if (!ref.current) return;
    const target = base.clone().add(def.explode.clone().multiplyScalar(spread));
    ref.current.position.lerp(target, 0.12);
  });

  const showLabel = hovered && spread > 0.25;

  return (
    <group ref={ref} position={base.toArray()}>
      <mesh>
        <dodecahedronGeometry args={[0.18 + spread * 0.04, 0]} />
        <meshStandardMaterial color="#0f172a" emissive={def.color} emissiveIntensity={0.8 + spread * 0.8} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.28, 24]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.35 + spread * 0.3} side={THREE.DoubleSide} />
      </mesh>
      {showLabel && (
        <Html distanceFactor={6} position={[0, 0.35, 0]} center>
          <div className="text-center pointer-events-none">
            <p className="font-mono text-[9px] text-emerald-200 whitespace-nowrap">{def.label}</p>
            <p className="font-mono text-[8px] text-cyan-400/70">{def.sub}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function DataArcs({ spread }: { spread: number }) {
  const arcs = BEACONS.map((b) => {
    const r = RING_RADII[b.ring];
    const end = new THREE.Vector3(Math.cos(b.angle) * r, Math.sin(b.angle * 0.5) * 0.35, Math.sin(b.angle) * r);
    end.add(b.explode.clone().multiplyScalar(spread));
    const mid = end.clone().multiplyScalar(0.5);
    mid.y += 0.6 + spread * 0.4;
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), mid, end);
    return curve.getPoints(20);
  });

  return (
    <>
      {arcs.map((points, i) => (
        <Line key={i} points={points} color={BEACONS[i].color} transparent opacity={0.2 + spread * 0.45} lineWidth={1} />
      ))}
    </>
  );
}

function PerimeterScene({ reducedMotion }: { reducedMotion?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [spread, setSpread] = useState(0);
  const spreadRef = useRef(0);
  const root = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const target = hovered ? 1 : 0;
    const next = THREE.MathUtils.damp(spreadRef.current, target, reducedMotion ? 8 : 4.5, delta);
    spreadRef.current = next;
    if (Math.abs(next - spread) > 0.008) setSpread(next);
    if (root.current && !hovered && !reducedMotion) {
      root.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });

  return (
    <group
      ref={root}
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
      <RadarSweep active={hovered} />
      <OrbitalRings spread={spread} />
      <CommandCore spread={spread} />
      <DataArcs spread={spread} />
      {BEACONS.map((b) => (
        <SectorBeacon key={b.id} def={b} spread={spread} hovered={hovered} />
      ))}
      <Sparkles count={40} scale={8} size={2} speed={0.3} color="#22d3ee" opacity={0.4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <ringGeometry args={[1.2, 3.8, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

interface HeroPerimeterCanvasProps {
  reducedMotion?: boolean;
}

/** Hero right — orbital SOC command with radar sweep; hover to deploy perimeter nodes */
const HeroPerimeterCanvas = ({ reducedMotion = false }: HeroPerimeterCanvasProps) => (
  <div className="relative w-full h-full min-h-[380px] lg:min-h-[calc(100vh-9rem)]">
    <Canvas
      dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 1.2, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} color="#ecfdf5" />
      <pointLight position={[0, 2, 4]} intensity={5} color="#34d399" />
      <Suspense fallback={null}>
        <PerimeterScene reducedMotion={reducedMotion} />
        <Stars radius={40} count={400} factor={2} fade speed={0.2} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 3.2}
        />
      </Suspense>
    </Canvas>
    <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] tracking-wide text-readable-dim/60 pointer-events-none">
      Hover to deploy perimeter · drag to orbit
    </p>
  </div>
);

export default HeroPerimeterCanvas;
