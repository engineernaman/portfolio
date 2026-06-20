import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

interface PostFXProps {
  lowPower?: boolean;
}

const PostFX = ({ lowPower = false }: PostFXProps) => {
  if (lowPower) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
      <Vignette eskil={false} offset={0.25} darkness={0.45} />
    </EffectComposer>
  );
};

export default PostFX;
