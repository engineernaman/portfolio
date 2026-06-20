import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Grid, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveNode from './InteractiveNode';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const JOURNEY_STAGES = [
  { label: 'Recon', color: '#ff5c38', shape: 'sphere' as const, offset: [-4, 0, -2] },
  { label: 'Assess', color: '#8b6dff', shape: 'octahedron' as const, offset: [-1.5, 1, -4] },
  { label: 'Exploit', color: '#ff0040', shape: 'box' as const, offset: [1.5, -0.5, -6] },
  { label: 'Remediate', color: '#8b5cf6', shape: 'torus' as const, offset: [4, 0.5, -8] },
  { label: 'Secure', color: '#f59e0b', shape: 'sphere' as const, offset: [0, 2, -12] },
];

function ScrollCamera() {
  const progress = useScrollProgress();

  useFrame(({ camera }) => {
    const z = THREE.MathUtils.lerp(8, -18, progress);
    const y = THREE.MathUtils.lerp(2, -1, Math.sin(progress * Math.PI));
    const x = THREE.MathUtils.lerp(0, Math.sin(progress * Math.PI * 2) * 2, progress);

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
    camera.lookAt(0, 0, z - 6);
  });

  return null;
}

function DataTunnel() {
  const tunnelRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  const rings = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        z: -i * 1.5,
        scale: 3 + (i % 3) * 0.5,
        color: i % 2 === 0 ? '#8b6dff' : '#ff5c38',
      })),
    []
  );

  useFrame(() => {
    if (tunnelRef.current) {
      tunnelRef.current.position.z = THREE.MathUtils.lerp(0, 12, progress);
    }
  });

  return (
    <group ref={tunnelRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.scale, 0.02, 8, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function CyberWorld({ lowPower = false }: { lowPower?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useScrollProgress();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05 * (1 + progress);
    }
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000510', 8, 35]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff5c38" />
      <pointLight position={[-10, -5, -5]} intensity={0.8} color="#8b6dff" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#8b5cf6"
        castShadow
      />

      <ScrollCamera />
      <DataTunnel />

      <group ref={groupRef}>
        {JOURNEY_STAGES.map((stage, i) => {
          const reveal = Math.max(0, Math.min(1, (progress - i * 0.15) * 4));
          return (
            <group key={stage.label} scale={reveal}>
              <InteractiveNode
                position={stage.offset as [number, number, number]}
                color={stage.color}
                label={stage.label}
                shape={stage.shape}
                scale={reveal}
              />
            </group>
          );
        })}
      </group>

      <Grid
        position={[0, -3, -6]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#8b6dff"
        sectionSize={2}
        sectionThickness={1.2}
        sectionColor="#ff5c38"
        fadeDistance={30}
        fadeStrength={1.5}
        infiniteGrid
      />

      <Stars radius={80} depth={50} count={lowPower ? 500 : 3000} factor={3} saturation={0} fade speed={0.5} />
      <Sparkles count={lowPower ? 40 : 120} scale={[20, 8, 30]} size={2} speed={0.3} color="#8b6dff" />
    </>
  );
}

export default CyberWorld;
