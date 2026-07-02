import { Component, useRef, useMemo, useCallback, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { detectWebGL } from '../../lib/webglDetect';
import { createWebGLRenderer } from '../../lib/webglRenderer';

function SentinelCore({ lowPower = false }: { lowPower?: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  const satellites = useMemo(
    () =>
      Array.from({ length: lowPower ? 4 : 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        radius: 1.55 + (i % 3) * 0.12,
        speed: 0.35 + (i % 4) * 0.08,
        color: i % 2 === 0 ? '#34d399' : '#22d3ee',
      })),
    [lowPower]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { pointer } = state;

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.35 + pointer.y * 0.25;
      coreRef.current.rotation.y = t * 0.5 + pointer.x * 0.35;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
      ringRef.current.rotation.x = Math.PI / 2 + pointer.y * 0.1;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * 0.22;
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 4]} intensity={2.5} color="#34d399" />
      <pointLight position={[-3, -2, 2]} intensity={1.8} color="#22d3ee" />

      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.5}>
        <mesh ref={ringRef}>
          <torusKnotGeometry args={[1.35, 0.08, 128, 24]} />
          <meshStandardMaterial
            color="#010208"
            emissive="#34d399"
            emissiveIntensity={1.4}
            metalness={0.9}
            roughness={0.2}
            wireframe
          />
        </mesh>

        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial
            color="#010208"
            emissive="#22d3ee"
            emissiveIntensity={1.6}
            metalness={0.95}
            roughness={0.1}
            wireframe
          />
        </mesh>

        <mesh scale={1.18}>
          <icosahedronGeometry args={[0.72, 0]} />
          <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.22} />
        </mesh>
      </Float>

      <group ref={orbitRef}>
        {satellites.map((sat, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(sat.angle) * sat.radius,
              Math.sin(sat.angle * 2) * 0.25,
              Math.sin(sat.angle) * sat.radius,
            ]}
          >
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color={sat.color} />
          </mesh>
        ))}
      </group>

      {!lowPower && (
        <Sparkles count={50} scale={5} size={2.5} speed={0.35} color="#22d3ee" opacity={0.55} />
      )}
    </>
  );
}

class PortalErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: Error) {
    console.warn('[HeroPortal3D]', err.message);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function CssRingFallback() {
  return (
    <div className="relative w-full h-full" aria-hidden>
      <div className="motion-hero-ring absolute inset-0 rounded-full border border-emerald-500/30" />
      <div className="motion-hero-ring-inner absolute inset-8 rounded-full border border-cyan-400/25" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_32px_rgba(52,211,153,0.8)]" />
      </div>
    </div>
  );
}

interface HeroPortal3DProps {
  reducedMotion?: boolean;
}

const HeroPortal3D = ({ reducedMotion = false }: HeroPortal3DProps) => {
  const support = useMemo(() => detectWebGL(), []);
  const lowPower = reducedMotion || support.prefersWebGL1;

  const createRenderer = useCallback(
    (canvas: HTMLCanvasElement) =>
      createWebGLRenderer(canvas, {
        antialias: !lowPower,
        alpha: true,
        prefersWebGL1: support.prefersWebGL1,
      }),
    [lowPower, support.prefersWebGL1]
  );

  if (support.capability === 'none') {
    return <CssRingFallback />;
  }

  return (
    <PortalErrorBoundary fallback={<CssRingFallback />}>
      <Canvas
        gl={createRenderer}
        dpr={lowPower ? 1 : Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <SentinelCore lowPower={lowPower} />
      </Canvas>
    </PortalErrorBoundary>
  );
};

export default HeroPortal3D;
