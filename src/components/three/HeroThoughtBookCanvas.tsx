import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, RoundedBox } from '@react-three/drei';
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

function PageContent({ content, index }: { content: BookPageContent; index: number }) {
  return (
    <Html transform occlude distanceFactor={2.4} style={{ width: `${PAGE_W * 54}px`, pointerEvents: 'none' }}>
      <div
        className={`p-3 min-h-[200px] flex flex-col rounded-sm bg-[#f8fafc] shadow-inner ${
          content.isCover ? 'text-center justify-center' : 'justify-start'
        }`}
      >
        {content.isCover ? (
          <>
            <BookOpen className="w-6 h-6 text-emerald-600 mx-auto mb-2 opacity-90" />
            <p className="font-display text-sm font-bold text-slate-900 leading-tight">{content.title}</p>
            <p className="text-[10px] text-emerald-800 mt-2 font-mono tracking-wide">{content.body}</p>
            <p className="text-[9px] text-slate-500 mt-3 font-mono">{content.meta}</p>
          </>
        ) : (
          <>
            <p className="font-mono text-[8px] uppercase tracking-widest text-emerald-700 mb-1.5">
              Principle {index}
            </p>
            <p className="font-display text-[11px] font-bold text-slate-900 leading-snug mb-2">{content.title}</p>
            <p className="text-[10px] text-slate-700 leading-relaxed font-body">{content.body}</p>
            {content.meta && (
              <p className="text-[8px] text-emerald-800/80 font-mono mt-3 pt-2 border-t border-emerald-900/10">
                — {content.meta}
              </p>
            )}
          </>
        )}
      </div>
    </Html>
  );
}

function BookInner({
  page,
  onFlip,
  reducedMotion,
  onRegisterFlip,
}: {
  page: number;
  onFlip: (dir: 1 | -1) => void;
  reducedMotion: boolean;
  onRegisterFlip: (fn: (dir: 1 | -1) => void) => void;
}) {
  const book = useRef<THREE.Group>(null);
  const flipRef = useRef(0);
  const flipping = useRef(false);
  const flipDir = useRef<1 | -1>(1);
  const [flipProgress, setFlipProgress] = useState(0);
  const [displayPage, setDisplayPage] = useState(page);

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

  useFrame((state, delta) => {
    if (book.current && !flipping.current) {
      const t = state.clock.elapsedTime;
      book.current.rotation.y = Math.sin(t * 0.15) * 0.05 + 0.12;
      book.current.rotation.x = Math.sin(t * 0.2) * 0.03 - 0.06;
      book.current.position.y = Math.sin(t * 0.5) * 0.03;
    }

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

  const nextPage = displayPage + flipDir.current;
  const showFlip = flipping.current && nextPage >= 0 && nextPage < PAGES.length;

  return (
    <group ref={book}>
      {/* back cover */}
      <RoundedBox args={[PAGE_W * 2 + 0.2, PAGE_H + 0.15, 0.12]} radius={0.04} position={[0, 0, -0.08]}>
        <meshStandardMaterial color="#041a12" emissive="#34d399" emissiveIntensity={0.15} metalness={0.7} roughness={0.35} />
      </RoundedBox>

      {/* left page (static) */}
      <group position={[-PAGE_W / 2 - 0.02, 0, 0.02]}>
        <RoundedBox args={[PAGE_W, PAGE_H, 0.02]} radius={0.01}>
          <meshStandardMaterial color="#ecfdf5" roughness={0.9} />
        </RoundedBox>
        <group position={[0, 0, 0.02]}>
          <PageContent content={PAGES[Math.max(0, displayPage - 1)] ?? PAGES[0]} index={displayPage - 1} />
        </group>
      </group>

      {/* right page (current) */}
      {!showFlip && (
        <group position={[PAGE_W / 2 + 0.02, 0, 0.03]}>
          <RoundedBox args={[PAGE_W, PAGE_H, 0.02]} radius={0.01}>
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </RoundedBox>
          <group position={[0, 0, 0.02]}>
            <PageContent content={PAGES[displayPage]} index={displayPage} />
          </group>
        </group>
      )}

      {/* flipping page */}
      {showFlip && (
        <group position={[0, 0, 0.05]}>
          <group
            position={[0, 0, 0]}
            rotation={[0, -flipProgress * Math.PI * flipDir.current, 0]}
          >
            <group position={[PAGE_W / 2, 0, 0]}>
              <RoundedBox args={[PAGE_W, PAGE_H, 0.02]} radius={0.01}>
                <meshStandardMaterial
                  color="#f8fafc"
                  roughness={0.9}
                  side={THREE.DoubleSide}
                />
              </RoundedBox>
              <group position={[0, 0, 0.02]}>
                <PageContent
                  content={flipDir.current > 0 ? PAGES[displayPage] : PAGES[nextPage]}
                  index={flipDir.current > 0 ? displayPage : nextPage}
                />
              </group>
            </group>
          </group>
          {flipProgress > 0.45 && (
            <group position={[PAGE_W / 2 + 0.02, 0, 0]}>
              <RoundedBox args={[PAGE_W, PAGE_H, 0.02]} radius={0.01}>
                <meshStandardMaterial color="#f8fafc" roughness={0.9} />
              </RoundedBox>
              <group position={[0, 0, 0.02]}>
                <PageContent content={PAGES[nextPage]} index={nextPage} />
              </group>
            </group>
          )}
        </group>
      )}

      {/* spine */}
      <RoundedBox args={[0.12, PAGE_H + 0.05, 0.14]} radius={0.02} position={[0, 0, 0.04]}>
        <meshStandardMaterial color="#022c22" emissive="#34d399" emissiveIntensity={0.3} metalness={0.85} />
      </RoundedBox>

      {/* click zones */}
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
  const flipRef = useRef<(dir: 1 | -1) => void>(() => {});
  const maxPage = PAGES.length - 1;

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[calc(100vh-9rem)] flex flex-col">
      <p className="font-mono text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase text-center mb-2 pointer-events-none">
        The Operator&apos;s Codex
      </p>
      <div className="flex-1 min-h-[300px]">
        <Canvas
          dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
          camera={{ position: [0, 0.15, 5.2], fov: 36 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <ambientLight intensity={0.95} />
          <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff7ed" />
          <pointLight position={[-2, 1, 3]} intensity={3} color="#34d399" />
          <Suspense fallback={null}>
            <BookInner
              page={page}
              onFlip={(dir) => setPage((p) => Math.min(maxPage, Math.max(0, p + dir)))}
              reducedMotion={reducedMotion}
              onRegisterFlip={(fn) => {
                flipRef.current = fn;
              }}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!reducedMotion}
              autoRotateSpeed={0.3}
              maxPolarAngle={Math.PI / 1.6}
              minPolarAngle={Math.PI / 3.4}
            />
          </Suspense>
        </Canvas>
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
          {page === 0 ? 'Cover' : `${page} / ${maxPage}`}
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
