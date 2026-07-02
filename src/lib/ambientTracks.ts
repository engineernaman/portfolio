/** Royalty-free ambient tracks — Mixkit License (free, no ads, no attribution required). */
export interface AmbientTrack {
  id: string;
  title: string;
  src: string;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'deep-urban',
    title: 'Deep Urban',
    src: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3',
  },
  {
    id: 'serene-view',
    title: 'Serene View',
    src: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
  },
  {
    id: 'tech-house',
    title: 'Tech House Vibes',
    src: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
  },
  {
    id: 'dreaming-big',
    title: 'Dreaming Big',
    src: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-587.mp3',
  },
];
