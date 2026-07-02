export interface SpeakingPhoto {
  src: string;
  caption: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  delay: number;
}

/** Local copies of LinkedIn speaking / profile photos */
export const SPEAKING_PHOTOS: SpeakingPhoto[] = [
  {
    src: '/assets/speaking/profile.jpg',
    caption: 'Soumy Naman Srivastava',
    position: [5.8, 0.6, 0.5],
    rotation: [0, -0.35, 0],
    size: [2.4, 2.4],
    delay: 0,
  },
  {
    src: '/assets/speaking/speaking-03.jpg',
    caption: 'AI & ML Keynote',
    position: [8.2, 2.1, -2.5],
    rotation: [0, -0.55, 0.04],
    size: [2.6, 1.7],
    delay: 0.8,
  },
  {
    src: '/assets/speaking/speaking-06.jpg',
    caption: 'ISS World Stage',
    position: [3.2, 1.8, -1.8],
    rotation: [0, 0.45, -0.03],
    size: [2.4, 1.6],
    delay: 1.6,
  },
  {
    src: '/assets/speaking/speaking-02.jpg',
    caption: 'AI Driven Solutions',
    position: [7.5, -1.2, -3.5],
    rotation: [0, -0.5, 0.02],
    size: [2.2, 1.5],
    delay: 2.2,
  },
  {
    src: '/assets/speaking/speaking-01.jpg',
    caption: 'International Speaker',
    position: [2.8, -0.5, -4],
    rotation: [0, 0.6, 0],
    size: [2, 1.4],
    delay: 3,
  },
  {
    src: '/assets/speaking/speaking-04.jpg',
    caption: 'PertSol · Cyber Lead',
    position: [9, 0.3, -5],
    rotation: [0, -0.65, 0],
    size: [2, 1.35],
    delay: 3.8,
  },
  {
    src: '/assets/speaking/speaking-05.jpg',
    caption: 'Competition Judge',
    position: [4.5, 2.8, -5.5],
    rotation: [0, 0.2, 0.05],
    size: [1.9, 1.3],
    delay: 4.5,
  },
  {
    src: '/assets/speaking/speaking-07.jpg',
    caption: 'Tech Leadership',
    position: [6.8, -2, -6],
    rotation: [0, -0.3, 0],
    size: [1.8, 1.25],
    delay: 5.2,
  },
  {
    src: '/assets/speaking/speaking-08.jpg',
    caption: 'Global Training',
    position: [3.5, -2.2, -7],
    rotation: [0, 0.55, 0],
    size: [1.8, 1.2],
    delay: 6,
  },
];

export const SPEAKING_VIDEOS = [
  {
    title: 'SPIT Mumbai · Competition Judge',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7432367303272472576/',
    date: 'Feb 2026',
  },
  {
    title: 'Packed House Keynote · Impact & Gratitude',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7396677503928561664/',
    date: '2025',
  },
];

/** Curated YouTube ambient / cyber tracks (full playback via embed) */
export const CURATED_YOUTUBE = [
  { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio', artist: 'Lofi Girl' },
  { id: 'DWcJFNfaw9c', title: 'synthwave radio', artist: 'Nightride FM' },
  { id: '5yx6BWlEVcY', title: 'Chillhop Radio', artist: 'Chillhop' },
  { id: 'n61ULEU7CO0', title: 'Cyberpunk Ambient', artist: 'Atmospheric' },
];
