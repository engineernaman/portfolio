import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { SPEAKING_PHOTOS } from '../../data/speakingMedia';
import { useScrollProgress } from '../../hooks/useScrollProgress';

function PhotoFrame3D({
  src,
  caption,
  position,
  rotation,
  size,
  delay,
  heroBoost,
}: {
  src: string;
  caption: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  delay: number;
  heroBoost: number;
}) {
  const group = useRef<THREE.Group>(null);
  const frameW = size[0] + 0.14;
  const frameH = size[1] + 0.14;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime + delay;
    const float = Math.sin(t * 0.85) * 0.2;
    const sway = Math.sin(t * 0.45) * 0.06;
    group.current.position.y = position[1] + float;
    group.current.rotation.y = rotation[1] + sway;
    group.current.rotation.z = rotation[2] + Math.sin(t * 0.3) * 0.02;
    const pulse = 1 + Math.sin(t * 1.8) * 0.015 * heroBoost;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[frameW, frameH, 0.06]} />
        <meshStandardMaterial
          color="#010208"
          emissive="#34d399"
          emissiveIntensity={0.9}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[frameW - 0.04, frameH - 0.04]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
      </mesh>
      <Image url={src} scale={size} transparent radius={0.03} position={[0, 0, 0.02]} />
      <Billboard follow lockZ={false}>
        <Text
          position={[0, -size[1] / 2 - 0.22, 0.08]}
          fontSize={0.11}
          color="#34d399"
          anchorX="center"
          outlineWidth={0.015}
          outlineColor="#010208"
          maxWidth={2.2}
        >
          {caption}
        </Text>
      </Billboard>
    </group>
  );
}

interface SpeakerPhotoGallery3DProps {
  lowPower?: boolean;
}

const SpeakerPhotoGallery3D = ({ lowPower = false }: SpeakerPhotoGallery3DProps) => {
  const progress = useScrollProgress();
  const orbitRef = useRef<THREE.Group>(null);

  const photos = useMemo(
    () => (lowPower ? SPEAKING_PHOTOS.slice(0, 4) : SPEAKING_PHOTOS),
    [lowPower]
  );

  useFrame((state) => {
    if (!orbitRef.current) return;
    orbitRef.current.rotation.y = state.clock.elapsedTime * 0.035 + progress * 0.4;
  });

  return (
    <group ref={orbitRef} position={[0.5, 0, 0]}>
      {photos.map((photo, i) => {
        const reveal = THREE.MathUtils.clamp(1 - i * 0.05 + progress * 0.5, 0.4, 1);
        if (reveal < 0.35) return null;
        return (
          <group key={photo.src} scale={reveal}>
            <PhotoFrame3D {...photo} heroBoost={i === 0 ? 1.5 : 1} />
          </group>
        );
      })}
    </group>
  );
};

export default SpeakerPhotoGallery3D;
