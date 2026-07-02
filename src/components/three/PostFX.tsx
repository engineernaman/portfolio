import { Bloom, EffectComposer, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

interface PostFXProps {
  lowPower?: boolean;
}

const PostFX = ({ lowPower = false }: PostFXProps) => (
  <EffectComposer multisampling={0}>
    <Bloom
      intensity={lowPower ? 0.65 : 1.1}
      luminanceThreshold={0.15}
      luminanceSmoothing={0.75}
      mipmapBlur={!lowPower}
    />
    {!lowPower && (
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0008, 0.0008)}
      />
    )}
    <Vignette eskil={false} offset={0.18} darkness={lowPower ? 0.4 : 0.55} />
  </EffectComposer>
);

export default PostFX;
