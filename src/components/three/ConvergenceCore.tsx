import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const ConvergenceCore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.25;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.4;
  });

  const spokes: [THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.2, 0.6, 0)],
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1.0, 0.4, 0.3)],
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, -1.0, 0.2)],
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.2, 0.2, -1.0)],
  ];

  const colors = ['#f59e0b', '#00d4aa', '#38bdf8', '#6366f1'];

  return (
    <group ref={groupRef} position={[9.5, 0, -12]}>
      {spokes.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color={colors[i]} transparent opacity={0.5} lineWidth={2} />
      ))}
      <mesh>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#e2e8f0"
          emissiveIntensity={0.8}
          metalness={1}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.7, 0.015, 8, 48]} />
        <meshBasicMaterial color="#e2e8f0" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

export default ConvergenceCore;
