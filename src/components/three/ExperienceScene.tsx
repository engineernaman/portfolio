import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import BlockchainChain from './BlockchainChain';
import NeuralMesh from './NeuralMesh';
import CloudLayers from './CloudLayers';
import SecurityPerimeter from './SecurityPerimeter';
import DataStreams from './DataStreams';
import ConvergenceCore from './ConvergenceCore';
import PostFX from './PostFX';
import { useScrollProgress } from '../../hooks/useScrollProgress';

function CameraRig() {
  const progress = useScrollProgress();
  const lookAt = useRef(new THREE.Vector3(9.5, 0, -12));

  useFrame((state) => {
    const t = progress;
    const { camera, pointer } = state;

    const z = THREE.MathUtils.lerp(6, -22, t);
    const x = THREE.MathUtils.lerp(8.5, 10, t) + pointer.x * 0.5;
    const y = 1.2 + Math.sin(t * Math.PI) * 0.6 + pointer.y * 0.35;

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
    lookAt.current.set(9.5 + Math.sin(t) * 0.3, 0.2, -12);
    camera.lookAt(lookAt.current);
  });

  return null;
}

interface ExperienceSceneProps {
  lowPower?: boolean;
}

const ExperienceScene = ({ lowPower = false }: ExperienceSceneProps) => (
  <>
    <fog attach="fog" args={['#030508', 8, 45]} />

    <ambientLight intensity={0.25} />
    <pointLight position={[10, 8, 2]} intensity={2} color="#38bdf8" />
    <pointLight position={[4, -2, -10]} intensity={1.5} color="#6366f1" />
    <pointLight position={[8, 2, -16]} intensity={1.2} color="#00d4aa" />
    <spotLight position={[6, 14, -8]} angle={0.5} penumbra={1} intensity={0.8} color="#f59e0b" />

    <CameraRig />

    <SecurityPerimeter />
    <NeuralMesh />
    <BlockchainChain />
    <CloudLayers />
    <ConvergenceCore />
  {!lowPower && <DataStreams count={48} />}

    <Stars
      radius={60}
      depth={35}
      count={lowPower ? 400 : 1200}
      factor={2}
      saturation={0}
      fade
      speed={0.25}
    />

    <PostFX lowPower={lowPower} />
  </>
);

export default ExperienceScene;
