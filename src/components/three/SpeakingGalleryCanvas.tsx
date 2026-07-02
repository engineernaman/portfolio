import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Image, OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SPEAKING_PHOTOS } from '@/data/speakingMedia';

function PhotoCard({
  src,
  caption,
  index,
  total,
  active,
  onSelect,
}: {
  src: string;
  caption: string;
  index: number;
  total: number;
  active: boolean;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3.2;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const lift = hovered || active ? 0.35 : 0;
    const x = Math.sin(angle + t * 0.08) * radius;
    const z = Math.cos(angle + t * 0.08) * radius - 1.5;
    const y = Math.sin(t * 0.6 + index) * 0.12 + lift;
    group.current.position.lerp(new THREE.Vector3(x, y, z), 0.08);
    group.current.lookAt(state.camera.position.x, group.current.position.y, state.camera.position.z);

    const targetScale = hovered || active ? 1.15 : 1;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.1));
  });

  const w = 1.35;
  const h = 1.7;

  return (
    <group
      ref={group}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <RoundedBox args={[w + 0.12, h + 0.12, 0.08]} radius={0.04} position={[0, 0, -0.05]}>
        <meshStandardMaterial
          color="#0a0f16"
          emissive={hovered || active ? '#34d399' : '#1e293b'}
          emissiveIntensity={hovered || active ? 0.8 : 0.2}
          metalness={0.9}
          roughness={0.2}
        />
      </RoundedBox>
      <Image url={src} scale={[w, h]} transparent radius={0.03} position={[0, 0, 0.02]} />
      {(hovered || active) && (
        <Text
          position={[0, -h / 2 - 0.22, 0.08]}
          fontSize={0.11}
          color="#a7f3d0"
          anchorX="center"
          maxWidth={1.8}
          outlineWidth={0.015}
          outlineColor="#010208"
        >
          {caption}
        </Text>
      )}
    </group>
  );
}

function GalleryScene({ activeIndex, onSelect }: { activeIndex: number; onSelect: (i: number) => void }) {
  const rig = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rig.current) return;
    rig.current.rotation.y = THREE.MathUtils.lerp(
      rig.current.rotation.y,
      state.pointer.x * 0.35,
      0.04
    );
  });

  return (
    <group ref={rig}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#ecfdf5" />
      <pointLight position={[-3, 2, 4]} intensity={3} color="#22d3ee" />
      {SPEAKING_PHOTOS.map((photo, i) => (
        <PhotoCard
          key={photo.src}
          src={photo.src}
          caption={photo.caption}
          index={i}
          total={SPEAKING_PHOTOS.length}
          active={i === activeIndex}
          onSelect={() => onSelect(i)}
        />
      ))}
    </group>
  );
}

interface SpeakingGalleryCanvasProps {
  reducedMotion?: boolean;
}

const SpeakingGalleryCanvas = ({ reducedMotion = false }: SpeakingGalleryCanvasProps) => {
  const [active, setActive] = useState(0);

  return (
    <div className="relative w-full h-[min(52vh,480px)] min-h-[320px] rounded-xl overflow-hidden">
      <Canvas
        dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, 0.5, 7.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <GalleryScene activeIndex={active} onSelect={setActive} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3.5} />
        </Suspense>
      </Canvas>
      <p className="absolute bottom-3 left-4 font-mono text-[10px] text-readable-dim pointer-events-none">
        Drag orbit · hover cards · click to focus
      </p>
      <div className="absolute top-3 right-4 flex gap-1.5 pointer-events-none">
        {SPEAKING_PHOTOS.map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i === active ? 'bg-emerald-400' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpeakingGalleryCanvas;
