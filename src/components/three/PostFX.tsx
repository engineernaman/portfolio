import { Bloom, EffectComposer, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

interface PostFXProps {
  lowPower?: boolean;
}

const PostFX = ({ lowPower = false }: PostFXProps) => {
  const progress = useScrollProgress();
  const vignetteDark = lowPower ? 0.3 : 0.28 + progress * 0.25;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={lowPower ? 1 : 2}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.9}
        mipmapBlur={!lowPower}
        radius={lowPower ? 0.5 : 0.85}
      />
      {!lowPower && (
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(0.0015, 0.0015)}
        />
      )}
      {!lowPower && <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />}
      <Vignette eskil={false} offset={0.12} darkness={vignetteDark} />
    </EffectComposer>
  );
};

export default PostFX;
