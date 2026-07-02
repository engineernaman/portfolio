import { useRef, useState, useCallback, useEffect } from 'react';
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
import { usePageTexture } from '@/lib/usePageTexture';
import type { PageDrawContent } from '@/lib/bookPageTexture';

const PAGE_W = 1.45;
const PAGE_H = 2;

const PAGES: PageDrawContent[] = [
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

function PageFace({ content }: { content: PageDrawContent }) {
  const map = usePageTexture(content);
  return (
    <mesh position={[0, 0, 0.016]} renderOrder={2}>
      <planeGeometry args={[PAGE_W * 0.94, PAGE_H * 0.94]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

function BookMesh({
  displayPage,
  flipProgress,
  flipDir,
  flipping,
}: {
  displayPage: number;
  flipProgress: number;
  flipDir: 1 | -1;
  flipping: boolean;
}) {
  const book = useRef<THREE.Group>(null);
  const nextPage = displayPage + flipDir;
  const showFlip = flipping && nextPage >= 0 && nextPage < PAGES.length;

  useFrame((state) => {
    if (!book.current) return;
    const t = state.clock.elapsedTime;
    book.current.rotation.y = Math.sin(t * 0.12) * 0.04 + 0.08;
    book.current.rotation.x = Math.sin(t * 0.18) * 0.025 - 0.04;
    book.current.position.y = Math.sin(t * 0.45) * 0.025;
  });

  return (
    <group ref={book} scale={1.15}>
      <RoundedBox args={[PAGE_W * 2 + 0.22, PAGE_H + 0.14, 0.14]} radius={0.04} position={[0, 0, -0.09]}>
        <meshStandardMaterial color="#041a12" emissive="#34d399" emissiveIntensity={0.35} metalness={0.75} roughness={0.35} />
      </RoundedBox>

      <group position={[-PAGE_W / 2 - 0.02, 0, 0.02]}>
        <RoundedBox args={[PAGE_W, PAGE_H, 0.022]} radius={0.012}>
          <meshStandardMaterial color="#ecfdf5" roughness={0.95} emissive="#ffffff" emissiveIntensity={0.08} />
        </RoundedBox>
        {displayPage > 0 && <PageFace content={PAGES[displayPage - 1]} />}
      </group>

      {!showFlip && (
        <group position={[PAGE_W / 2 + 0.02, 0, 0.035]}>
          <RoundedBox args={[PAGE_W, PAGE_H, 0.022]} radius={0.012}>
            <meshStandardMaterial color="#f8fafc" roughness={0.95} emissive="#ffffff" emissiveIntensity={0.1} />
          </RoundedBox>
          <PageFace content={PAGES[displayPage]} />
        </group>
      )}

      {showFlip && (
        <group position={[0, 0, 0.06]}>
          <group rotation={[0, -flipProgress * Math.PI * flipDir, 0]}>
            <group position={[PAGE_W / 2, 0, 0]}>
              <RoundedBox args={[PAGE_W, PAGE_H, 0.022]} radius={0.012}>
                <meshStandardMaterial color="#f8fafc" roughness={0.95} side={THREE.DoubleSide} emissive="#fff" emissiveIntensity={0.08} />
              </RoundedBox>
              <PageFace content={flipDir > 0 ? PAGES[displayPage] : PAGES[nextPage]} />
            </group>
          </group>
          {flipProgress > 0.5 && (
            <group position={[PAGE_W / 2 + 0.02, 0, 0.01]}>
              <RoundedBox args={[PAGE_W, PAGE_H, 0.022]} radius={0.012}>
                <meshStandardMaterial color="#f8fafc" roughness={0.95} emissive="#fff" emissiveIntensity={0.08} />
              </RoundedBox>
              <PageFace content={PAGES[nextPage]} />
            </group>
          )}
        </group>
      )}

      <RoundedBox args={[0.13, PAGE_H + 0.06, 0.16]} radius={0.02} position={[0, 0, 0.05]}>
        <meshStandardMaterial color="#022c22" emissive="#34d399" emissiveIntensity={0.5} metalness={0.85} />
      </RoundedBox>
    </group>
  );
}

function BookInner({
  onFlip,
  reducedMotion,
  onRegisterFlip,
}: {
  onFlip: (dir: 1 | -1) => void;
  reducedMotion: boolean;
  onRegisterFlip: (fn: (dir: 1 | -1) => void) => void;
}) {
  const flipRef = useRef(0);
  const flipping = useRef(false);
  const flipDir = useRef<1 | -1>(1);
  const [flipProgress, setFlipProgress] = useState(0);
  const [displayPage, setDisplayPage] = useState(0);

  const requestFlip = useCallback(
    (dir: 1 | -1) => {
      if (flipping.current) return;
      const next = displayPage + dir;
      if (next < 0 || next >= PAGES.length) return;
      flipping.current = true;
      flipDir.current = dir;
      flipRef.current = 0;
    },
    [displayPage]
  );

  useEffect(() => {
    onRegisterFlip(requestFlip);
  }, [onRegisterFlip, requestFlip]);

  useFrame((_, delta) => {
    if (!flipping.current) return;
    flipRef.current = Math.min(1, flipRef.current + delta * (reducedMotion ? 3.5 : 2.2));
    setFlipProgress(flipRef.current);
    if (flipRef.current >= 1) {
      setDisplayPage((p) => p + flipDir.current);
      onFlip(flipDir.current);
      flipping.current = false;
      flipRef.current = 0;
      setFlipProgress(0);
    }
  });

  return (
    <group>
      <BookMesh displayPage={displayPage} flipProgress={flipProgress} flipDir={flipDir.current} flipping={flipping.current} />
      <mesh position={[-PAGE_W * 0.75, 0, 0.25]} onClick={(e) => { e.stopPropagation(); requestFlip(-1); }}>
        <planeGeometry args={[PAGE_W * 0.65, PAGE_H]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh position={[PAGE_W * 0.75, 0, 0.25]} onClick={(e) => { e.stopPropagation(); requestFlip(1); }}>
        <planeGeometry args={[PAGE_W * 0.65, PAGE_H]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

interface HeroThoughtBookCanvasProps {
  reducedMotion?: boolean;
}

const HeroThoughtBookCanvas = ({ reducedMotion = false }: HeroThoughtBookCanvasProps) => {
  const [page, setPage] = useState(0);
  const flipRef = useRef<(dir: 1 | -1) => void>(() => {});
  const maxPage = PAGES.length - 1;

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[calc(100vh-8rem)] flex flex-col">
      <p className="font-mono text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase text-center mb-2 pointer-events-none">
        The Operator&apos;s Codex · flip the pages
      </p>

      <div className="flex-1 min-h-[360px]">
        <Canvas
          dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [0, 0.1, 5.4], fov: 34 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[3, 6, 5]} intensity={2} color="#fff7ed" />
          <pointLight position={[-2, 2, 4]} intensity={6} color="#34d399" />
          <pointLight position={[2, -1, 3]} intensity={3} color="#22d3ee" />
          <BookInner
            onFlip={(dir) => setPage((p) => Math.min(maxPage, Math.max(0, p + dir)))}
            reducedMotion={reducedMotion}
            onRegisterFlip={(fn) => { flipRef.current = fn; }}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={!reducedMotion}
            autoRotateSpeed={0.22}
            maxPolarAngle={Math.PI / 1.55}
            minPolarAngle={Math.PI / 3.2}
          />
        </Canvas>
      </div>

      <div className="flex items-center justify-between gap-3 px-2 pb-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => flipRef.current(-1)}
          disabled={page <= 0}
          className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30 hover:border-emerald-500/30 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="font-mono text-[10px] text-readable-dim text-center flex-1">
          {page === 0 ? 'Cover' : `Page ${page} / ${maxPage}`}
        </p>
        <button
          type="button"
          onClick={() => flipRef.current(1)}
          disabled={page >= maxPage}
          className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30 hover:border-emerald-500/30 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HeroThoughtBookCanvas;
