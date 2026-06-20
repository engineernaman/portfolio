import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SecurityPerimeter = () => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) outerRef.current.rotation.y = t * 0.12;
    if (innerRef.current) innerRef.current.rotation.y = -t * 0.18;
    if (innerRef.current) innerRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    if (scanRef.current) {
      scanRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.04);
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group position={[9, 0.8, -8]}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.8, 1]} />
        <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={scanRef}>
        <torusGeometry args={[2.5, 0.02, 8, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

export default SecurityPerimeter;
