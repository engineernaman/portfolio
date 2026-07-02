import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function HeroCore() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.45 + state.pointer.x * 0.35;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.12 + state.pointer.y * 0.25;
  });

  return (
    <group ref={ref}>
      <Float speed={3} rotationIntensity={0.6} floatIntensity={1}>
        {[3.4, 2.6, 1.9].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.4]}>
            <torusGeometry args={[r, 0.045, 16, 96]} />
            <meshBasicMaterial color={i % 2 ? '#22d3ee' : '#34d399'} transparent opacity={0.65} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
        <mesh>
          <icosahedronGeometry args={[1.45, 2]} />
          <MeshDistortMaterial color="#041a12" emissive="#34d399" emissiveIntensity={2.8} distort={0.55} speed={4} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh>
          <torusKnotGeometry args={[1.7, 0.14, 160, 28]} />
          <meshStandardMaterial color="#010208" emissive="#22d3ee" emissiveIntensity={2.2} wireframe />
        </mesh>
        <mesh scale={1.25}>
          <icosahedronGeometry args={[1.45, 0]} />
          <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.3} />
        </mesh>
      </Float>
      <Sparkles count={90} scale={8} size={4} speed={0.7} color="#22d3ee" />
      <pointLight position={[0, 0, 5]} intensity={8} color="#34d399" />
      <pointLight position={[-4, 3, 3]} intensity={4} color="#22d3ee" />
      <spotLight position={[5, 8, 6]} intensity={2} angle={0.5} penumbra={1} color="#a7f3d0" />
    </group>
  );
}

interface HeroSceneCanvasProps {
  reducedMotion?: boolean;
}

const HeroSceneCanvas = ({ reducedMotion = false }: HeroSceneCanvasProps) => (
  <div className="relative w-full h-full min-h-[300px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-[#010208] via-[#041018] to-[#010208] shadow-[0_0_80px_rgba(52,211,153,0.15)]">
    <Canvas
      dpr={reducedMotion ? 1 : Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0.2, 6], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', minHeight: 300 }}
    >
      <color attach="background" args={['#010208']} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#d1fae5" />
      <Suspense fallback={null}>
        <HeroCore />
        <Stars radius={50} count={1200} factor={4} fade speed={0.5} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reducedMotion} autoRotateSpeed={0.5} />
      </Suspense>
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
