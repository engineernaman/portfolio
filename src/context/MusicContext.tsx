import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { searchMusic, parseYouTubeId, type MusicResult } from '../lib/musicSearch';

type PlayMode = 'youtube' | 'audio';

interface MusicState {
  current: MusicResult | null;
  playing: boolean;
  volume: number;
  muted: boolean;
  mode: PlayMode;
  ytId: string | null;
  playerReady: boolean;
}

interface MusicContextValue extends MusicState {
  playYouTube: (id: string, track: MusicResult) => void;
  playTrack: (track: MusicResult) => void;
  playCurated: (id: string, title: string, artist: string) => void;
  playFromUrl: (url: string) => boolean;
  togglePlay: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  setPlaying: (p: boolean) => void;
  setPlayerReady: (r: boolean) => void;
  searchAndPlay: (query: string) => Promise<void>;
  hasActiveTrack: boolean;
}

const STORAGE_KEY = 'soumysec-music';

function loadPersisted(): Partial<MusicState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function persist(state: MusicState) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        current: state.current,
        playing: state.playing,
        volume: state.volume,
        muted: state.muted,
        mode: state.mode,
        ytId: state.ytId,
      })
    );
  } catch {
    /* quota */
  }
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersisted();
  const [current, setCurrent] = useState<MusicResult | null>(persisted.current ?? null);
  const [playing, setPlaying] = useState(persisted.playing ?? false);
  const [volume, setVolumeState] = useState(persisted.volume ?? 0.7);
  const [muted, setMutedState] = useState(persisted.muted ?? false);
  const [mode, setMode] = useState<PlayMode>(persisted.mode ?? 'youtube');
  const [ytId, setYtId] = useState<string | null>(persisted.ytId ?? null);
  const [playerReady, setPlayerReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  }, []);

  useEffect(() => {
    persist({ current, playing, volume, muted, mode, ytId, playerReady });
  }, [current, playing, volume, muted, mode, ytId, playerReady]);

  const playYouTube = useCallback(
    (id: string, track: MusicResult) => {
      stopAudio();
      setMode('youtube');
      setPlayerReady(false);
      setYtId(id);
      setCurrent(track);
      setPlaying(true);
    },
    [stopAudio]
  );

  const playAudioPreview = useCallback(
    async (track: MusicResult) => {
      if (!track.previewUrl) return;
      setMode('audio');
      setYtId(null);
      stopAudio();
      const audio = new Audio(track.previewUrl);
      audio.volume = muted ? 0 : volume;
      audio.loop = true;
      audioRef.current = audio;
      try {
        await audio.play();
        setCurrent(track);
        setPlaying(true);
      } catch {
        /* autoplay blocked */
      }
    },
    [muted, volume, stopAudio]
  );

  const playTrack = useCallback(
    (track: MusicResult) => {
      if (track.youtubeId) playYouTube(track.youtubeId, track);
      else if (track.previewUrl) playAudioPreview(track);
    },
    [playYouTube, playAudioPreview]
  );

  const playCurated = useCallback(
    (id: string, title: string, artist: string) => {
      playYouTube(id, { id: `cur-${id}`, title, artist, youtubeId: id, source: 'curated' });
    },
    [playYouTube]
  );

  const playFromUrl = useCallback(
    (url: string) => {
      const id = parseYouTubeId(url);
      if (!id) return false;
      playYouTube(id, { id: `paste-${id}`, title: 'YouTube', artist: 'Custom link', youtubeId: id, source: 'youtube' });
      return true;
    },
    [playYouTube]
  );

  const searchAndPlay = useCallback(
    async (query: string) => {
      const results = await searchMusic(query);
      const yt = results.find((r) => r.youtubeId);
      if (yt) playTrack(yt);
      else if (results[0]) playTrack(results[0]);
    },
    [playTrack]
  );

  const togglePlay = useCallback(() => {
    if (mode === 'audio' && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
      return;
    }
    if (mode === 'youtube' && ytId) setPlaying((p) => !p);
  }, [mode, playing, ytId]);

  const stop = useCallback(() => {
    stopAudio();
    setYtId(null);
    setPlaying(false);
    setCurrent(null);
    setPlayerReady(false);
  }, [stopAudio]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = muted ? 0 : v;
  }, [muted]);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    if (audioRef.current) audioRef.current.volume = m ? 0 : volume;
  }, [volume]);

  return (
    <MusicContext.Provider
      value={{
        current,
        playing,
        volume,
        muted,
        mode,
        ytId,
        playerReady,
        playYouTube,
        playTrack,
        playCurated,
        playFromUrl,
        togglePlay,
        stop,
        setVolume,
        setMuted,
        setPlaying,
        setPlayerReady,
        searchAndPlay,
        hasActiveTrack: !!current || !!ytId,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
