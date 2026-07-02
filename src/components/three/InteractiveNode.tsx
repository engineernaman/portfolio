import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollToSection } from '../../lib/scrollToSection';

interface InteractiveNodeProps {
  position: [number, number, number];
  color: string;
  label: string;
  scale?: number;
  shape?: 'sphere' | 'box' | 'octahedron' | 'torus';
  sectionId?: string;
  physics?: boolean;
}

const InteractiveNode = ({
  position,
  color,
  label,
  scale = 1,
  shape = 'sphere',
  sectionId,
  physics = false,
}: InteractiveNodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const offsetGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const velocity = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const driftVelocity = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (!dragging) {
      meshRef.current.rotation.x += delta * (physics ? 0.15 : 0.3);
      meshRef.current.rotation.y += delta * (physics ? 0.25 : 0.5);
    }

    const targetScale = hovered ? scale * 1.2 : scale;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    if (ringRef.current) {
      const ringScale = hovered ? 1.6 : 1.2;
      ringRef.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), 0.12);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, hovered ? 0.55 : 0.15, 0.1);
    }

    if (physics) {
      if (!dragging) {
        const spring = offset.current.clone().multiplyScalar(-3.5);
        velocity.current.add(spring.multiplyScalar(delta));
        velocity.current.multiplyScalar(0.88);
        offset.current.add(velocity.current.clone().multiplyScalar(delta * 8));
        offset.current.clampLength(0, 2.5);
      }
      if (offsetGroupRef.current) {
        offsetGroupRef.current.position.copy(offset.current);
      }
    } else {
      driftVelocity.current.multiplyScalar(0.9);
      meshRef.current.position.add(driftVelocity.current);
    }
  });

  const applyPush = (direction: THREE.Vector3) => {
    if (physics) {
      velocity.current.add(direction.multiplyScalar(0.35));
    } else {
      driftVelocity.current.add(direction.multiplyScalar(0.08));
    }
  };

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (sectionId) scrollToSection(sectionId);
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    applyPush(new THREE.Vector3(e.movementX * 0.01, -e.movementY * 0.01, 0));
  };

  const geometry = {
    sphere: <sphereGeometry args={[0.6, 32, 32]} />,
    box: <boxGeometry args={[1, 1, 1]} />,
    octahedron: <octahedronGeometry args={[0.7]} />,
    torus: <torusGeometry args={[0.5, 0.2, 16, 32]} />,
  }[shape];

  return (
    <group position={position}>
      <group ref={offsetGroupRef}>
        <mesh
          ref={meshRef}
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerMove={onPointerMove}
          onClick={onClick}
          castShadow
        >
          {geometry}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.85 : 0.35}
            roughness={0.2}
            metalness={0.85}
            transparent
            opacity={0.92}
          />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.012, 8, 48]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </group>
  );
};

export default InteractiveNode;
