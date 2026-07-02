import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { AMBIENT_TRACKS } from '../lib/ambientTracks';
import { useApp } from '../context/AppContext';

const AmbientPlayer = () => {
  const { reducedMotion } = useApp();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.35);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = AMBIENT_TRACKS[trackIndex];

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.loop = false;
    }
    return audioRef.current;
  }, []);

  const loadTrack = useCallback(
    (index: number, autoplay = false) => {
      const audio = ensureAudio();
      audio.src = AMBIENT_TRACKS[index].src;
      audio.volume = muted ? 0 : volume;
      if (autoplay) {
        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    },
    [ensureAudio, muted, volume]
  );

  useEffect(() => {
    const audio = ensureAudio();
    const onEnded = () => {
      setTrackIndex((i) => {
        const next = (i + 1) % AMBIENT_TRACKS.length;
        loadTrack(next, true);
        return next;
      });
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [ensureAudio, loadTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = async () => {
    const audio = ensureAudio();
    if (!audio.src) loadTrack(trackIndex, false);

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
        setOpen(true);
      } catch {
        setOpen(true);
      }
    }
  };

  const nextTrack = () => {
    const next = (trackIndex + 1) % AMBIENT_TRACKS.length;
    setTrackIndex(next);
    loadTrack(next, playing);
  };

  if (reducedMotion) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[55] pointer-events-auto font-mono">
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            if (!playing) togglePlay();
          }}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-emerald-500/30 bg-[rgba(8,12,18,0.92)] backdrop-blur-md text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all shadow-[0_0_24px_rgba(52,211,153,0.15)]"
          aria-label="Open soundtrack player"
        >
          <Music className="w-4 h-4 group-hover:animate-pulse" />
          <span className="text-[10px] tracking-widest uppercase hidden sm:inline">Soundtrack</span>
          {playing && (
            <span className="flex gap-0.5 items-end h-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-0.5 bg-emerald-400 rounded-full animate-pulse"
                  style={{ height: `${6 + (i % 2) * 4}px`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          )}
        </button>
      )}

      {open && (
        <div className="w-[min(92vw,320px)] rounded-2xl border border-emerald-500/25 bg-[rgba(6,10,16,0.95)] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase">Ad-free · royalty-free</p>
              <p className="text-sm text-white font-medium mt-0.5 truncate">{track.title}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 text-slate/50 hover:text-white rounded-lg"
              aria-label="Minimize player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              className="p-2 rounded-lg border border-white/10 text-slate/70 hover:text-white hover:border-white/20"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="p-2 rounded-lg border border-white/10 text-slate/70 hover:text-white"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 accent-emerald-500"
              aria-label="Volume"
            />
          </div>

          <p className="px-4 pb-3 text-[9px] text-slate/40">
            Mixkit · free for commercial use · no ads
          </p>
        </div>
      )}
    </div>
  );
};

export default AmbientPlayer;
