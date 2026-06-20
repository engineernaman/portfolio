import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const MorphingCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const velocity = useRef(new THREE.Vector3());
  const progress = useScrollProgress();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.06;
    const scrollScale = THREE.MathUtils.lerp(1.4, 0.5, progress);
    const targetScale = breathe * scrollScale * (hovered ? 1.12 : 1);

    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    if (!dragging) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.2;
      velocity.current.multiplyScalar(0.88);
      meshRef.current.position.lerp(new THREE.Vector3(0, 0, 0), 0.06);
      meshRef.current.position.add(velocity.current);
    }

    meshRef.current.position.x += state.pointer.x * 0.15;
    meshRef.current.position.y += state.pointer.y * 0.1;
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(true);
  };

  const onPointerUp = () => setDragging(false);

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    velocity.current.x += e.movementX * 0.012;
    velocity.current.y -= e.movementY * 0.012;
  };

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      >
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color="#1a1528"
          emissive={hovered ? '#ff5c38' : '#8b6dff'}
          emissiveIntensity={hovered ? 1.8 : 1.1}
          distort={hovered ? 0.45 : 0.28}
          speed={2.5}
          roughness={0.15}
          metalness={0.9}
          clearcoat={1}
        />
      </mesh>
    </Float>
  );
};

export default MorphingCore;
