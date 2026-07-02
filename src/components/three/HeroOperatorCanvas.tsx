import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BOOK_COVER_IMAGE,
  BOOK_SUBTITLE,
  BOOK_TITLE,
  leaderThoughts,
} from '@/data/leaderThoughts';
import { useMonitorTexture } from '@/lib/useMonitorTexture';
import type { ScreenContent } from '@/lib/monitorScreenTexture';

const SCREENS: ScreenContent[] = [
  {
    title: BOOK_TITLE,
    body: BOOK_SUBTITLE,
    meta: `${leaderThoughts.length} principles`,
    image: BOOK_COVER_IMAGE,
    isCover: true,
  },
  ...leaderThoughts.map((t, i) => ({
    title: t.title,
    body: t.thought,
    meta: t.source,
    image: t.image,
    index: i + 1,
  })),
];

const MON_W = 1.7;
const MON_H = 1.02;

function Monitor({ content }: { content: ScreenContent }) {
  const map = useMonitorTexture(content);
  return (
    <group position={[0, 0.88, 0]}>
      <RoundedBox args={[MON_W + 0.14, MON_H + 0.14, 0.08]} radius={0.03} position={[0, 0, -0.05]}>
        <meshStandardMaterial color="#0a0f16" metalness={0.9} roughness={0.2} emissive="#34d399" emissiveIntensity={0.12} />
      </RoundedBox>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[MON_W, MON_H]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[0, -MON_H / 2 - 0.08, 0]}>
        <boxGeometry args={[0.12, 0.16, 0.12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} />
      </mesh>
      <mesh position={[0, -MON_H / 2 - 0.2, 0.04]}>
        <boxGeometry args={[0.5, 0.04, 0.35]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
    </group>
  );
}

function OperatorFigure({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null);
  const handL = useRef<THREE.Group>(null);
  const handR = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      root.current.position.y = -0.05 + Math.sin(t * 0.8) * 0.015;
    }
    if (!reducedMotion && handL.current && handR.current) {
      handL.current.position.y = 0.42 + Math.sin(t * 6) * 0.012;
      handR.current.position.y = 0.42 + Math.sin(t * 6 + 1.2) * 0.012;
    }
  });

  return (
    <group ref={root} position={[0, -0.15, 0.35]}>
      {/* chair */}
      <mesh position={[0, 0.35, -0.35]}>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.75, -0.62]}>
        <boxGeometry args={[0.65, 0.7, 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 0.72, 0]}>
        <capsuleGeometry args={[0.22, 0.45, 6, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.18, 0.02]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* arms */}
      <group ref={handL} position={[-0.38, 0.42, 0.15]} rotation={[0.4, 0, 0.25]}>
        <mesh>
          <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
      <group ref={handR} position={[0.38, 0.42, 0.15]} rotation={[0.4, 0, -0.25]}>
        <mesh>
          <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}

function Workstation({ page, reducedMotion }: { page: number; reducedMotion: boolean }) {
  const rig = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rig.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    rig.current.rotation.y = Math.sin(t * 0.15) * 0.06;
  });

  return (
    <group ref={rig}>
      {/* desk */}
      <RoundedBox args={[2.6, 0.1, 1.2]} radius={0.02} position={[0, 0.28, 0.1]}>
        <meshStandardMaterial color="#0c1220" metalness={0.85} roughness={0.25} emissive="#22d3ee" emissiveIntensity={0.05} />
      </RoundedBox>
      {/* keyboard */}
      <mesh position={[0, 0.36, 0.42]}>
        <boxGeometry args={[0.75, 0.03, 0.28]} />
        <meshStandardMaterial color="#020617" emissive="#34d399" emissiveIntensity={0.25} />
      </mesh>
      <Monitor content={SCREENS[page]} />
      <OperatorFigure reducedMotion={reducedMotion} />
      {/* ambient glow */}
      <pointLight position={[0, 1.2, 0.6]} intensity={2.5} color="#34d399" distance={4} />
      <pointLight position={[0.8, 0.6, 1]} intensity={1.2} color="#22d3ee" distance={3} />
    </group>
  );
}

interface HeroOperatorCanvasProps {
  reducedMotion?: boolean;
}

const HeroOperatorCanvas = ({ reducedMotion = false }: HeroOperatorCanvasProps) => {
  const [page, setPage] = useState(0);
  const max = SCREENS.length - 1;
  const step = useCallback((d: 1 | -1) => setPage((p) => Math.min(max, Math.max(0, p + d))), [max]);

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[calc(100vh-8rem)] flex flex-col">
      <p className="font-mono text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase text-center mb-2">
        Operator workstation · cycle the screen
      </p>
      <div className="flex-1 min-h-[360px]">
        <Canvas
          dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [0, 1.05, 3.2], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <ambientLight intensity={0.85} />
          <directionalLight position={[2, 4, 3]} intensity={1.4} color="#ecfdf5" />
          <Workstation page={page} reducedMotion={reducedMotion} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3.5}
            target={[0, 0.75, 0]}
          />
        </Canvas>
      </div>
      <div className="flex items-center justify-between gap-3 px-2 pb-2">
        <button type="button" onClick={() => step(-1)} disabled={page <= 0} className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30" aria-label="Previous">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="font-mono text-[10px] text-readable-dim text-center flex-1">
          {page === 0 ? 'Cover' : `Principle ${page} / ${max}`}
        </p>
        <button type="button" onClick={() => step(1)} disabled={page >= max} className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30" aria-label="Next">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HeroOperatorCanvas;
