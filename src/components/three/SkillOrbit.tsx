import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const ORBIT_ITEMS = [
  { label: 'Pentest', color: '#ff0040', angle: 0 },
  { label: 'DevSecOps', color: '#ff5c38', angle: Math.PI * 0.4 },
  { label: 'Cloud', color: '#8b6dff', angle: Math.PI * 0.8 },
  { label: 'Forensics', color: '#8b5cf6', angle: Math.PI * 1.2 },
  { label: 'Architecture', color: '#f59e0b', angle: Math.PI * 1.6 },
];

function OrbitItem({
  label,
  color,
  angle,
  radius,
  scrollOffset,
}: {
  label: string;
  color: string;
  angle: number;
  radius: number;
  scrollOffset: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const a = angle + t * 0.3;
    const r = radius * THREE.MathUtils.lerp(0.3, 1, scrollOffset);
    ref.current.position.set(Math.cos(a) * r, Math.sin(a * 0.5) * 1.5, Math.sin(a) * r);
    ref.current.rotation.set(t * 0.5, t * 0.8, 0);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(0, 1, scrollOffset));
  });

  return (
    <Float speed={2} floatIntensity={0.5}>
      <group ref={ref}>
        <mesh>
          <torusKnotGeometry args={[0.35, 0.1, 64, 8]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            distort={0.25}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        <Text position={[0, -0.9, 0]} fontSize={0.14} color={color} anchorX="center">
          {label}
        </Text>
      </group>
    </Float>
  );
}

const SkillOrbit = () => {
  const progress = useScrollProgress();
  const groupRef = useRef<THREE.Group>(null);
  const orbitStrength = THREE.MathUtils.clamp((progress - 0.12) * 5, 0, 1);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = progress * Math.PI * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {ORBIT_ITEMS.map((item) => (
        <OrbitItem key={item.label} {...item} radius={4} scrollOffset={orbitStrength} />
      ))}
    </group>
  );
};

export default SkillOrbit;
