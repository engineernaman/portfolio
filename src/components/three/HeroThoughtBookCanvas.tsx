import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { BOOK_SUBTITLE, BOOK_TITLE, leaderThoughts } from '@/data/leaderThoughts';

const PAGE_W = 1.4;
const PAGE_H = 1.9;

type BookPageContent = {
  title: string;
  body: string;
  meta?: string;
  isCover?: boolean;
};

const PAGES: BookPageContent[] = [
  {
    title: BOOK_TITLE,
    body: BOOK_SUBTITLE,
    meta: `${leaderThoughts.length} principles · flip to read`,
    isCover: true,
  },
  ...leaderThoughts.map((t) => ({
    title: t.title,
    body: t.thought,
    meta: t.source,
  })),
];

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

  useFrame((state) => {
    if (!book.current) return;
    const t = state.clock.elapsedTime;
    book.current.rotation.y = Math.sin(t * 0.15) * 0.05 + 0.1;
    book.current.rotation.x = Math.sin(t * 0.2) * 0.03 - 0.05;
    book.current.position.y = Math.sin(t * 0.5) * 0.03;
  });

  const nextPage = displayPage + flipDir;
  const showFlip = flipping && nextPage >= 0 && nextPage < PAGES.length;

  return (
    <group ref={book}>
      <RoundedBox args={[PAGE_W * 2 + 0.2, PAGE_H + 0.15, 0.12]} radius={0.04} position={[0, 0, -0.08]}>
        <meshStandardMaterial color="#041a12" emissive="#34d399" emissiveIntensity={0.2} metalness={0.7} roughness={0.35} />
      </RoundedBox>

      <group position={[-PAGE_W / 2 - 0.02, 0, 0.02]}>
        <RoundedBox args={[PAGE_W, PAGE_H, 0.02]} radius={0.01}>
          <meshStandardMaterial color="#ecfdf5" roughness={0.9} />
        </RoundedBox>
      </group>

      {!showFlip && (
        <group position={[PAGE_W / 2 + 0.02, 0, 0.03]}>
          <RoundedBox args={[PAGE_W, PAGE_H, 0.02]} radius={0.01}>
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </RoundedBox>
        </group>
      )}

      {showFlip && (
        <group position={[0, 0, 0.05]}>
          <group rotation={[0, -flipProgress * Math.PI * flipDir, 0]}>
            <group position={[PAGE_W / 2, 0, 0]}>
              <RoundedBox args={[PAGE_W, PAGE_H, 0.02]} radius={0.01}>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} side={THREE.DoubleSide} />
              </RoundedBox>
            </group>
          </group>
        </group>
      )}

      <RoundedBox args={[0.12, PAGE_H + 0.05, 0.14]} radius={0.02} position={[0, 0, 0.04]}>
        <meshStandardMaterial color="#022c22" emissive="#34d399" emissiveIntensity={0.35} metalness={0.85} />
      </RoundedBox>

      <Text position={[0, PAGE_H / 2 + 0.2, 0.1]} fontSize={0.08} color="#34d399" anchorX="center" fillOpacity={0.8}>
        SoumySec
      </Text>
    </group>
  );
}

function BookInner({
  onFlip,
  reducedMotion,
  onRegisterFlip,
  onPageChange,
}: {
  onFlip: (dir: 1 | -1) => void;
  reducedMotion: boolean;
  onRegisterFlip: (fn: (dir: 1 | -1) => void) => void;
  onPageChange: (page: number) => void;
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

  useEffect(() => {
    onPageChange(displayPage);
  }, [displayPage, onPageChange]);

  useFrame((_, delta) => {
    if (!flipping.current) return;
    flipRef.current = Math.min(1, flipRef.current + delta * (reducedMotion ? 3.5 : 2.4));
    setFlipProgress(flipRef.current);
    if (flipRef.current >= 1) {
      const next = displayPage + flipDir.current;
      setDisplayPage(next);
      onFlip(flipDir.current);
      flipping.current = false;
      flipRef.current = 0;
      setFlipProgress(0);
    }
  });

  return (
    <group>
      <BookMesh
        displayPage={displayPage}
        flipProgress={flipProgress}
        flipDir={flipDir.current}
        flipping={flipping.current}
      />
      <mesh
        position={[-PAGE_W * 0.75, 0, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          requestFlip(-1);
        }}
      >
        <planeGeometry args={[PAGE_W * 0.6, PAGE_H]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh
        position={[PAGE_W * 0.75, 0, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          requestFlip(1);
        }}
      >
        <planeGeometry args={[PAGE_W * 0.6, PAGE_H]} />
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
  const [displayPage, setDisplayPage] = useState(0);
  const flipRef = useRef<(dir: 1 | -1) => void>(() => {});
  const maxPage = PAGES.length - 1;
  const content = PAGES[displayPage];

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[calc(100vh-9rem)] flex flex-col">
      <p className="font-mono text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase text-center mb-2 pointer-events-none">
        The Operator&apos;s Codex
      </p>

      <div className="flex-1 min-h-[240px] relative">
        <Canvas
          dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [0, 0.15, 5.2], fov: 36 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[3, 5, 4]} intensity={1.4} color="#fff7ed" />
          <pointLight position={[-2, 1, 3]} intensity={4} color="#34d399" />
          <Suspense fallback={null}>
            <BookInner
              onFlip={(dir) => setPage((p) => Math.min(maxPage, Math.max(0, p + dir)))}
              reducedMotion={reducedMotion}
              onRegisterFlip={(fn) => {
                flipRef.current = fn;
              }}
              onPageChange={setDisplayPage}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!reducedMotion}
              autoRotateSpeed={0.28}
              maxPolarAngle={Math.PI / 1.6}
              minPolarAngle={Math.PI / 3.4}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Readable thought panel — always visible HTML */}
      <div className="mx-2 mt-3 mb-2 rounded-xl border border-emerald-500/20 bg-[#f8fafc] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] pointer-events-none">
        {content.isCover ? (
          <div className="text-center">
            <BookOpen className="w-5 h-5 text-emerald-700 mx-auto mb-2" />
            <p className="font-display text-sm font-bold text-slate-900">{content.title}</p>
            <p className="text-[11px] text-emerald-800 mt-1 font-mono">{content.body}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">{content.meta}</p>
          </div>
        ) : (
          <>
            <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-700 mb-1">
              Principle {displayPage}
            </p>
            <p className="font-display text-sm font-bold text-slate-900 mb-2">{content.title}</p>
            <p className="text-xs text-slate-700 leading-relaxed">{content.body}</p>
            {content.meta && (
              <p className="text-[10px] text-emerald-800/80 font-mono mt-2 pt-2 border-t border-emerald-900/10">
                — {content.meta}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 px-2 pb-1 pointer-events-auto">
        <button
          type="button"
          onClick={() => flipRef.current(-1)}
          disabled={page <= 0}
          className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30 hover:border-emerald-500/30 transition-colors"
          aria-label="Previous thought"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="font-mono text-[10px] text-readable-dim text-center flex-1">
          {displayPage === 0 ? 'Cover' : `${displayPage} / ${maxPage}`}
        </p>
        <button
          type="button"
          onClick={() => flipRef.current(1)}
          disabled={page >= maxPage}
          className="p-2 rounded-lg border border-white/10 bg-black/40 text-emerald-400 disabled:opacity-30 hover:border-emerald-500/30 transition-colors"
          aria-label="Next thought"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HeroThoughtBookCanvas;
