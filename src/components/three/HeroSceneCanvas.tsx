import { Component, Suspense, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Stars, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function HeroCore() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.45;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.15 + state.pointer.y * 0.2;
  });

  return (
    <group ref={ref}>
      <Float speed={3} rotationIntensity={0.6} floatIntensity={1}>
        {[2.2, 1.7, 1.2].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.4]}>
            <torusGeometry args={[r, 0.035, 12, 80]} />
            <meshBasicMaterial color={i % 2 ? '#22d3ee' : '#34d399'} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
        <mesh>
          <icosahedronGeometry args={[1.1, 1]} />
          <MeshDistortMaterial color="#041a12" emissive="#34d399" emissiveIntensity={2.2} distort={0.5} speed={4} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh rotation={[0, 0, 0]}>
          <torusKnotGeometry args={[1.3, 0.1, 128, 24]} />
          <meshStandardMaterial color="#010208" emissive="#22d3ee" emissiveIntensity={1.8} wireframe />
        </mesh>
      </Float>
      <Sparkles count={60} scale={6} size={3} speed={0.7} color="#22d3ee" />
      <pointLight position={[0, 0, 4]} intensity={6} color="#34d399" />
      <pointLight position={[-3, 2, 2]} intensity={3} color="#22d3ee" />
    </group>
  );
}

class MiniBoundary extends Component<{ children: ReactNode }, { ok: boolean }> {
  state = { ok: true };
  static getDerivedStateFromError() {
    return { ok: false };
  }
  render() {
    if (!this.state.ok) {
      return (
        <mesh>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      );
    }
    return this.props.children;
  }
}

interface HeroSceneCanvasProps {
  reducedMotion?: boolean;
}

const HeroSceneCanvas = ({ reducedMotion = false }: HeroSceneCanvasProps) => (
  <div className="relative w-full h-full min-h-[320px] lg:min-h-[480px] rounded-2xl overflow-hidden border border-emerald-500/25 bg-[#010208]/40 shadow-[0_0_60px_rgba(52,211,153,0.12)]">
    <Canvas
      dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', minHeight: 320 }}
    >
      <color attach="background" args={['#010208']} />
      <ambientLight intensity={1} />
      <MiniBoundary>
        <Suspense fallback={null}>
          <HeroCore />
          <Stars radius={40} count={800} factor={3} fade speed={0.5} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reducedMotion} autoRotateSpeed={0.6} />
        </Suspense>
      </MiniBoundary>
    </Canvas>
    <div className="absolute top-3 left-3 font-mono text-[9px] tracking-widest text-emerald-400/80 uppercase pointer-events-none">
      WebGL · Live
    </div>
    <div className="absolute bottom-3 right-3 font-mono text-[9px] tracking-widest text-cyan-400/60 uppercase pointer-events-none">
      Drag to orbit
    </div>
  </div>
);

export default HeroSceneCanvas;
