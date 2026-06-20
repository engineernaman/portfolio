import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const LAYERS = [
  { count: 3, y: 1.8, z: -7 },
  { count: 5, y: 0.6, z: -9 },
  { count: 4, y: -0.6, z: -11 },
  { count: 3, y: -1.8, z: -13 },
];

const NeuralMesh = () => {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0.2);

  const { nodes, connections } = useMemo(() => {
    const nodeList: THREE.Vector3[] = [];
    const layerNodes: THREE.Vector3[][] = [];

    LAYERS.forEach((layer, li) => {
      const row: THREE.Vector3[] = [];
      const spread = (layer.count - 1) * 0.55;
      for (let i = 0; i < layer.count; i++) {
        const v = new THREE.Vector3(
          7.5 + li * 0.3,
          layer.y,
          layer.z + (i * 0.55 - spread / 2)
        );
        row.push(v);
        nodeList.push(v);
      }
      layerNodes.push(row);
    });

    const conn: [THREE.Vector3, THREE.Vector3][] = [];
    for (let l = 0; l < layerNodes.length - 1; l++) {
      layerNodes[l].forEach((a) => {
        layerNodes[l + 1].forEach((b) => {
          conn.push([a.clone(), b.clone()]);
        });
      });
    }

    return { nodes: nodeList, connections: conn };
  }, []);

  useFrame((state) => {
    opacityRef.current = 0.14 + (Math.sin(state.clock.elapsedTime * 2) + 1) * 0.06;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {connections.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color="#00d4aa" transparent opacity={0.2} lineWidth={1} />
      ))}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#00d4aa" />
        </mesh>
      ))}
      <mesh position={[5.2, 2.4, -7]}>
        {/* label handled via drei Text in parent if needed */}
      </mesh>
    </group>
  );
};

export default NeuralMesh;
