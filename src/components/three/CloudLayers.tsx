import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LAYERS = [
  { y: 1.4, z: -16, opacity: 0.1 },
  { y: 0.2, z: -17.5, opacity: 0.14 },
  { y: -1.0, z: -19, opacity: 0.18 },
];

const RACKS = [-1.2, 0, 1.2];

const CloudLayers = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[10, 0, 0]}>
      {LAYERS.map((layer, i) => (
        <mesh
          key={i}
          position={[0, layer.y, layer.z]}
          rotation={[-Math.PI / 2, 0, 0.15]}
        >
          <planeGeometry args={[10, 10, 20, 20]} />
          <meshBasicMaterial
            color="#38bdf8"
            wireframe
            transparent
            opacity={layer.opacity}
          />
        </mesh>
      ))}

      {RACKS.map((x, i) => (
        <group key={i} position={[x, -1.6, -17]}>
          <mesh>
            <boxGeometry args={[0.35, 1.4, 0.25]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#38bdf8"
              emissiveIntensity={0.25 + i * 0.1}
              metalness={0.85}
              roughness={0.35}
            />
          </mesh>
          {[0.4, 0, -0.4].map((dy) => (
            <mesh key={dy} position={[0, dy, 0.13]}>
              <boxGeometry args={[0.28, 0.06, 0.02]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      ))}

    </group>
  );
};

export default CloudLayers;
