import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

interface PostFXProps {
  lowPower?: boolean;
}

const PostFX = ({ lowPower = false }: PostFXProps) => (
  <EffectComposer multisampling={0}>
    <Bloom
      intensity={lowPower ? 0.45 : 0.75}
      luminanceThreshold={0.2}
      luminanceSmoothing={0.85}
      mipmapBlur={!lowPower}
    />
    <Vignette eskil={false} offset={0.22} darkness={lowPower ? 0.35 : 0.5} />
  </EffectComposer>
);

export default PostFX;
