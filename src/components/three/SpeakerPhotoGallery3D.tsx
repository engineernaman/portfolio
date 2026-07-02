import { useRef, useState, useMemo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Image, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { SPEAKING_PHOTOS } from '../../data/speakingMedia';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const ORBIT_CENTER: [number, number, number] = [2.8, 0.4, 0];
const ORBIT_RADIUS = 4.2;

function SwirlRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} position={ORBIT_CENTER} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.018, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </mesh>
  );
}

function InteractivePhotoFrame({
  src,
  caption,
  size,
  index,
  total,
  isHero,
}: {
  src: string;
  caption: string;
  size: [number, number];
  index: number;
  total: number;
  isHero: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const progress = useScrollProgress();
  const frameW = size[0] + 0.16;
  const frameH = size[1] + 0.16;
  const baseAngle = (index / total) * Math.PI * 2;

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  const onOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const scrollSpin = progress * Math.PI * 1.8;
    const spin = isHero ? t * 0.08 : t * 0.14 + scrollSpin;
    const angle = isHero ? 0 : baseAngle + spin;
    const radius = isHero ? 0 : ORBIT_RADIUS + Math.sin(t * 0.5 + index) * 0.35;
    const yWave = Math.sin(t * 0.9 + index * 0.7) * (isHero ? 0.15 : 0.45);

    const x = ORBIT_CENTER[0] + (isHero ? 0 : Math.cos(angle) * radius);
    const y = ORBIT_CENTER[1] + yWave + (isHero ? 0 : Math.sin(angle * 0.5) * 0.3);
    const z = ORBIT_CENTER[2] + (isHero ? 0.8 : Math.sin(angle) * radius);

    group.current.position.lerp(new THREE.Vector3(x, y, z), 0.08);
    group.current.lookAt(state.camera.position);

    const targetScale = hovered ? (isHero ? 1.12 : 1.28) : isHero ? 1.05 : 1;
    const s = group.current.scale.x;
    group.current.scale.setScalar(THREE.MathUtils.lerp(s, targetScale, 0.12));

    if (hovered) {
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z,
        state.pointer.x * 0.15,
        0.1
      );
    }
  });

  return (
    <group ref={group} onPointerOver={onOver} onPointerOut={onOut}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[frameW, frameH, 0.08]} />
        <meshStandardMaterial
          color="#010208"
          emissive={hovered ? '#34d399' : '#22d3ee'}
          emissiveIntensity={hovered ? 1.4 : 0.7}
          metalness={0.95}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[0, 0, -0.03]} rotation={[0, 0, 0]}>
        <planeGeometry args={[frameW - 0.05, frameH - 0.05]} />
        <meshBasicMaterial color={hovered ? '#34d399' : '#22d3ee'} transparent opacity={hovered ? 0.35 : 0.12} />
      </mesh>
      <Image url={src} scale={size} transparent radius={0.04} position={[0, 0, 0.02]} />
      {(hovered || isHero) && (
        <Billboard follow>
          <Text
            position={[0, -size[1] / 2 - 0.28, 0.1]}
            fontSize={isHero ? 0.14 : 0.11}
            color="#34d399"
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="#010208"
            maxWidth={2.4}
          >
            {caption}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

interface SpeakerPhotoGallery3DProps {
  lowPower?: boolean;
}

const SpeakerPhotoGallery3D = ({ lowPower = false }: SpeakerPhotoGallery3DProps) => {
  const orbitRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  const photos = useMemo(
    () => (lowPower ? SPEAKING_PHOTOS.slice(0, 5) : SPEAKING_PHOTOS),
    [lowPower]
  );

  const orbitPhotos = photos.slice(1);
  const hero = photos[0];

  useFrame((state) => {
    if (!orbitRef.current) return;
    orbitRef.current.rotation.y = state.clock.elapsedTime * 0.04 + progress * 0.6;
    orbitRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
  });

  return (
    <group>
      {!lowPower && (
        <>
          <SwirlRing radius={ORBIT_RADIUS + 0.6} speed={0.06} color="#34d399" />
          <SwirlRing radius={ORBIT_RADIUS - 0.4} speed={-0.09} color="#22d3ee" />
          <SwirlRing radius={ORBIT_RADIUS + 1.4} speed={0.03} color="#6366f1" />
        </>
      )}

      <mesh position={[ORBIT_CENTER[0], ORBIT_CENTER[1] - 1.8, ORBIT_CENTER[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[ORBIT_RADIUS + 1.8, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} />
      </mesh>
      <mesh position={[ORBIT_CENTER[0], ORBIT_CENTER[1] - 1.79, ORBIT_CENTER[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ORBIT_RADIUS - 0.2, ORBIT_RADIUS + 0.2, 64]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {hero && (
        <InteractivePhotoFrame
          src={hero.src}
          caption={hero.caption}
          size={[2.8, 2.8]}
          index={0}
          total={1}
          isHero
        />
      )}

      <group ref={orbitRef}>
        {orbitPhotos.map((photo, i) => (
          <InteractivePhotoFrame
            key={photo.src}
            src={photo.src}
            caption={photo.caption}
            size={photo.size}
            index={i}
            total={orbitPhotos.length}
            isHero={false}
          />
        ))}
      </group>
    </group>
  );
};

export default SpeakerPhotoGallery3D;
