import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import ExperienceScene from './ExperienceScene';

interface FixedExperienceProps {
  lowEffects?: boolean;
}

const FixedExperience = ({ lowEffects = false }: FixedExperienceProps) => (
  <>
    <div
      className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#030508] from-0% via-[#030508]/96 via-[34%] to-transparent to-[68%]"
      aria-hidden="true"
    />

    <div className="fixed inset-y-0 right-0 w-[58%] z-0 pointer-events-none lg:pointer-events-auto max-lg:hidden">
      <Canvas
        shadows={!lowEffects}
        dpr={lowEffects ? 1 : Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [8.5, 1.2, 6], fov: 50, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ExperienceScene lowPower={lowEffects} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  </>
);

export default FixedExperience;
