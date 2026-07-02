import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const NODE_COUNT = 64;

interface NeuralPulseFieldProps {
  lowPower?: boolean;
}

function NeuralPulseField({ lowPower = false }: NeuralPulseFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const progress = useScrollProgress();
  const count = lowPower ? 28 : NODE_COUNT;

  const { positions, velocities, linePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const lines = new Float32Array(count * 6);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 6;
      pos[i * 3] = 5.5 + Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = -Math.random() * 18 - 2;
      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 2] = 0.015 + Math.random() * 0.02;
    }

    for (let i = 0; i < count; i++) {
      const j = (i + 1 + Math.floor(Math.random() * 3)) % count;
      lines[i * 6] = pos[i * 3];
      lines[i * 6 + 1] = pos[i * 3 + 1];
      lines[i * 6 + 2] = pos[i * 3 + 2];
      lines[i * 6 + 3] = pos[j * 3];
      lines[i * 6 + 4] = pos[j * 3 + 1];
      lines[i * 6 + 5] = pos[j * 3 + 2];
    }

    return { positions: pos, velocities: vel, linePositions: lines };
  }, [count]);

  const pointGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geo;
  }, [linePositions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    const attractZ = 2 + progress * 4;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] + Math.sin(t + i) * 0.002;
      pos[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(t * 0.7 + i) * 0.0015;
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      const dx = 5.5 - pos[i * 3];
      const dy = 0.4 - pos[i * 3 + 1];
      pos[i * 3] += dx * 0.0008;
      pos[i * 3 + 1] += dy * 0.0008;

      if (pos[i * 3 + 2] > attractZ) {
        pos[i * 3 + 2] = -20 - Math.random() * 8;
        pos[i * 3] = 5.5 + (Math.random() - 0.5) * 10;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    if (linesRef.current && !lowPower) {
      const lp = linesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        lp[i * 6] = pos[i * 3];
        lp[i * 6 + 1] = pos[i * 3 + 1];
        lp[i * 6 + 2] = pos[i * 3 + 2];
        const j = (i + 1) % count;
        lp[i * 6 + 3] = pos[j * 3];
        lp[i * 6 + 4] = pos[j * 3 + 1];
        lp[i * 6 + 5] = pos[j * 3 + 2];
      }
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial
          size={0.12}
          color="#22d3ee"
          transparent
          opacity={0.75}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {!lowPower && (
        <lineSegments ref={linesRef} geometry={lineGeo}>
          <lineBasicMaterial color="#34d399" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
        </lineSegments>
      )}
    </group>
  );
}

export default NeuralPulseField;
