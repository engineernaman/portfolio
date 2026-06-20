import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const BLOCK_COUNT = 9;

const BlockchainChain = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[9.5, -1.2, -14]} rotation={[0, -0.45, 0]}>
      {Array.from({ length: BLOCK_COUNT }).map((_, i) => (
        <group key={i} position={[i * 0.72, Math.sin(i * 0.6) * 0.12, Math.cos(i * 0.4) * 0.1]}>
          {i > 0 && (
            <mesh position={[-0.36, 0, 0]}>
              <boxGeometry args={[0.2, 0.06, 0.06]} />
              <meshBasicMaterial color="#818cf8" />
            </mesh>
          )}
          <mesh>
            <boxGeometry args={[0.52, 0.52, 0.52]} />
            <meshStandardMaterial
              color="#1e1b4b"
              emissive="#6366f1"
              emissiveIntensity={0.55}
              metalness={0.92}
              roughness={0.15}
            />
          </mesh>
          <Line
            points={[
              [-0.26, -0.26, 0.26],
              [0.26, -0.26, -0.26],
              [0.26, 0.26, 0.26],
              [-0.26, 0.26, -0.26],
            ]}
            color="#a5b4fc"
            lineWidth={1}
            transparent
            opacity={0.35}
          />
        </group>
      ))}
    </group>
  );
};

export default BlockchainChain;
