import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

type Vec3 = [number, number, number];

function revealAt(progress: number, threshold: number, speed = 4) {
  return THREE.MathUtils.clamp((progress - threshold) * speed, 0, 1);
}

function VignetteLabel({
  position,
  label,
  reveal,
  color = '#34d399',
}: {
  position: Vec3;
  label: string;
  reveal: number;
  color?: string;
}) {
  if (reveal < 0.2) return null;
  return (
    <Text
      position={position}
      fontSize={0.14}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.015}
      outlineColor="#010208"
      fillOpacity={reveal * 0.85}
    >
      {label}
    </Text>
  );
}

function SignalRings({ active }: { active: boolean }) {
  const rings = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rings.current || !active) return;
    rings.current.children.forEach((child, i) => {
      const t = ((state.clock.elapsedTime + i * 0.6) % 2.4) / 2.4;
      child.scale.setScalar(0.4 + t * 2.2);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 * (1 - t);
    });
  });

  if (!active) return null;

  return (
    <group ref={rings} position={[0, 2.2, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.008, 8, 48]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function CellTower({ position, reveal }: { position: Vec3; reveal: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  if (reveal < 0.05) return null;

  return (
    <group ref={groupRef} position={position} scale={reveal}>
      <VignetteLabel position={[0, 2.8, 0]} label="TELECOM · 5G" reveal={reveal} color="#22d3ee" />
      {/* lattice legs */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.35, 0.5, Math.sin(a) * 0.35]} rotation={[0, a, 0.12]}>
          <boxGeometry args={[0.04, 1.2, 0.04]} />
          <meshStandardMaterial color="#334155" emissive="#22d3ee" emissiveIntensity={0.2} metalness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 0.7, 6]} />
        <meshStandardMaterial color="#1e293b" emissive="#22d3ee" emissiveIntensity={0.3} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.8]} />
        <meshStandardMaterial color="#475569" emissive="#34d399" emissiveIntensity={0.4} metalness={0.85} />
      </mesh>
      {/* dish */}
      <mesh position={[0.25, 1.9, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.18, 0.05, 0.06, 16]} />
        <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.5} metalness={0.95} />
      </mesh>
      {[0, Math.PI / 2, Math.PI].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.4, 2.1, Math.sin(angle) * 0.4]} rotation={[0, angle, Math.PI / 2]}>
          <boxGeometry args={[0.85, 0.025, 0.025]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.85} />
        </mesh>
      ))}
      <SignalRings active={reveal > 0.5} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#22d3ee" distance={4} />
      <Sparkles count={12} scale={2} size={1.2} color="#22d3ee" opacity={0.4} position={[0, 1.5, 0]} />
    </group>
  );
}

function VentureRocket({ position, reveal }: { position: Vec3; reveal: number }) {
  const ref = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Points>(null);

  const exhaustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(30 * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.4) * 0.12;
    }
    if (exhaustRef.current) {
      const pos = exhaustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 30; i++) {
        pos[i * 3 + 1] -= 0.03 + Math.random() * 0.02;
        if (pos[i * 3 + 1] < -1.2) {
          pos[i * 3] = (Math.random() - 0.5) * 0.15;
          pos[i * 3 + 1] = -0.5;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
        }
      }
      exhaustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (reveal < 0.05) return null;

  return (
    <group ref={ref} position={position} scale={reveal * 0.85}>
      <VignetteLabel position={[0, 1.4, 0]} label="VENTURES" reveal={reveal} />
      <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.28, 0.9, 10]} />
        <meshStandardMaterial color="#0f172a" emissive="#34d399" emissiveIntensity={0.45} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.45, 10]} />
        <meshStandardMaterial color="#1e293b" emissive="#22d3ee" emissiveIntensity={0.35} />
      </mesh>
      {[0, Math.PI * 0.66, Math.PI * 1.33].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.28, -0.15, Math.sin(a) * 0.28]} rotation={[0, a, Math.PI / 2]}>
          <boxGeometry args={[0.35, 0.025, 0.14]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
      ))}
      <points ref={exhaustRef} geometry={exhaustGeo} position={[0, -0.6, 0]}>
        <pointsMaterial size={0.08} color="#22d3ee" transparent opacity={0.7} sizeAttenuation />
      </points>
      <pointLight position={[0, -0.5, 0]} intensity={0.3} color="#34d399" distance={2} />
    </group>
  );
}

function Podium({ position, reveal }: { position: Vec3; reveal: number }) {
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (spotRef.current) {
      const t = state.clock.elapsedTime;
      spotRef.current.position.x = Math.sin(t * 0.8) * 1.2;
      spotRef.current.intensity = 0.5 + Math.sin(t * 2) * 0.15;
    }
  });

  if (reveal < 0.05) return null;

  return (
    <group position={position} scale={reveal}>
      <VignetteLabel position={[0, 1.6, 0]} label="ISS WORLD · STAGE" reveal={reveal} color="#22d3ee" />
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[1, 1.15, 0.28, 8]} />
        <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.12} metalness={0.8} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.45, 8]} />
        <meshStandardMaterial color="#1e293b" emissive="#34d399" emissiveIntensity={0.25} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* mic stand */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5]} />
        <meshStandardMaterial color="#64748b" emissive="#34d399" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.6} />
      </mesh>
      {/* audience dots */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.2, -1.5, Math.sin(a) * 1.5]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color="#34d399" transparent opacity={0.35} />
          </mesh>
        );
      })}
      <spotLight ref={spotRef} position={[0, 3.5, 1]} angle={0.35} penumbra={0.8} intensity={0.6} color="#34d399" />
    </group>
  );
}

function Satellite({ position, reveal }: { position: Vec3; reveal: number }) {
  const ref = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.18;
    if (orbitRef.current) orbitRef.current.rotation.z = state.clock.elapsedTime * 0.3;
  });

  if (reveal < 0.05) return null;

  return (
    <group ref={ref} position={position} scale={reveal * 0.9}>
      <VignetteLabel position={[0, 1.2, 0]} label="RESEARCH · PUBLISH" reveal={reveal} />
      <mesh>
        <boxGeometry args={[0.55, 0.38, 0.38]} />
        <meshStandardMaterial color="#1e293b" emissive="#34d399" emissiveIntensity={0.35} metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.9, 0.015, 0.55]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.9, 0.015, 0.55]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.55]} />
        <meshStandardMaterial color="#64748b" emissive="#34d399" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.004, 8, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </mesh>
      <mesh ref={orbitRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.1, 0.003, 6, 80]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function ProfileHologram({ position, reveal }: { position: Vec3; reveal: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.25;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.08;
    }
  });

  if (reveal < 0.05) return null;

  return (
    <group ref={ref} position={position} scale={reveal * 0.75}>
      <VignetteLabel position={[0, 1.3, 0]} label="PROFILE" reveal={reveal} />
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color="#010208" emissive="#34d399" emissiveIntensity={0.4} wireframe metalness={0.9} />
      </mesh>
      <Sparkles count={20} scale={1.5} size={1.5} color="#34d399" opacity={0.5} />
    </group>
  );
}

function AcademyGlobe({ position, reveal }: { position: Vec3; reveal: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  if (reveal < 0.05) return null;

  return (
    <group ref={ref} position={position} scale={reveal * 0.8}>
      <VignetteLabel position={[0, 1.4, 0]} label="GLOBAL TRAINING" reveal={reveal} color="#22d3ee" />
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color="#0f172a" emissive="#22d3ee" emissiveIntensity={0.2} wireframe metalness={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.52, 16, 16]} />
        <meshStandardMaterial color="#1e293b" emissive="#34d399" emissiveIntensity={0.15} transparent opacity={0.6} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const phi = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(phi) * 0.75, Math.sin(phi * 2) * 0.2, Math.sin(phi) * 0.75]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
        );
      })}
    </group>
  );
}

function TrophyBeacon({ position, reveal }: { position: Vec3; reveal: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  if (reveal < 0.05) return null;

  return (
    <group ref={ref} position={position} scale={reveal * 0.85}>
      <VignetteLabel position={[0, 1.5, 0]} label="RECOGNITION" reveal={reveal} />
      {/* cup */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.5, 12]} />
        <meshStandardMaterial color="#1e293b" emissive="#f59e0b" emissiveIntensity={0.35} metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.3, 0.04, 8, 24]} />
        <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={0.5} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.15, 8]} />
        <meshStandardMaterial color="#334155" emissive="#f59e0b" emissiveIntensity={0.3} metalness={0.9} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.4} color="#fbbf24" distance={3} />
      <Sparkles count={10} scale={1.2} size={1} color="#fbbf24" opacity={0.45} position={[0, 0.6, 0]} />
    </group>
  );
}

function ConnectPortal({ position, reveal }: { position: Vec3; reveal: number }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (outerRef.current) outerRef.current.rotation.z = state.clock.elapsedTime * 0.4;
    if (innerRef.current) innerRef.current.rotation.z = -state.clock.elapsedTime * 0.6;
  });

  if (reveal < 0.05) return null;

  return (
    <group position={position} scale={reveal}>
      <VignetteLabel position={[0, 1.5, 0]} label="CONNECT" reveal={reveal} color="#22d3ee" />
      <mesh ref={outerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 8, 48]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} metalness={0.9} transparent opacity={0.85} />
      </mesh>
      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.025, 6, 32]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#010208" emissive="#34d399" emissiveIntensity={0.8} />
      </mesh>
      <pointLight intensity={0.5} color="#22d3ee" distance={4} />
    </group>
  );
}

export const SECTOR_LABELS = [
  { threshold: 0.02, label: 'PROFILE SECTOR' },
  { threshold: 0.14, label: 'CAREER · TELECOM' },
  { threshold: 0.26, label: 'VENTURES LAUNCH' },
  { threshold: 0.38, label: 'SPEAKING STAGE' },
  { threshold: 0.50, label: 'RESEARCH LAB' },
  { threshold: 0.62, label: 'GLOBAL TRAINING' },
  { threshold: 0.74, label: 'RECOGNITION HALL' },
  { threshold: 0.86, label: 'CONNECT PORTAL' },
];

export function getSectorLabel(progress: number): string {
  let label = 'ENTERING GRID';
  for (const s of SECTOR_LABELS) {
    if (progress >= s.threshold) label = s.label;
  }
  return label;
}

const SectionVignettes = () => {
  const progress = useScrollProgress();

  return (
    <>
      <ProfileHologram position={[-5, 0.8, -6.5]} reveal={revealAt(progress, 0.04)} />
      <CellTower position={[-5.5, -1.5, -10.5]} reveal={revealAt(progress, 0.14)} />
      <VentureRocket position={[-5, 0.5, -15.5]} reveal={revealAt(progress, 0.26)} />
      <Podium position={[5.5, -1.8, -20.5]} reveal={revealAt(progress, 0.38)} />
      <Satellite position={[5, 1, -25.5]} reveal={revealAt(progress, 0.50)} />
      <AcademyGlobe position={[-6, 0.2, -23]} reveal={revealAt(progress, 0.62)} />
      <TrophyBeacon position={[6, -1.2, -28]} reveal={revealAt(progress, 0.74)} />
      <ConnectPortal position={[0, -1, -31]} reveal={revealAt(progress, 0.86)} />
    </>
  );
};

export default SectionVignettes;
