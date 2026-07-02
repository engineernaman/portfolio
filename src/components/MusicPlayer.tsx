import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, VolumeX, X, Search, Loader2, Youtube } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURATED_YOUTUBE } from '../data/speakingMedia';
import { searchMusic, parseYouTubeId, type MusicResult } from '../lib/musicSearch';

type PlayMode = 'youtube' | 'audio';

const MusicPlayer = () => {
  const { reducedMotion } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [current, setCurrent] = useState<MusicResult | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [mode, setMode] = useState<PlayMode>('youtube');
  const [ytId, setYtId] = useState<string | null>(null);
  const [pasteUrl, setPasteUrl] = useState('');
  const [error, setError] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  const playYouTube = useCallback(
    (id: string, track: MusicResult) => {
      stopAudio();
      setMode('youtube');
      setYtId(id);
      setCurrent(track);
      setPlaying(true);
      setError('');
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
        setError('');
      } catch {
        setError('Could not play preview — try a YouTube result instead.');
      }
    },
    [muted, volume, stopAudio]
  );

  const playTrack = useCallback(
    (track: MusicResult) => {
      if (track.youtubeId) {
        playYouTube(track.youtubeId, track);
      } else if (track.previewUrl) {
        playAudioPreview(track);
      }
    },
    [playYouTube, playAudioPreview]
  );

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    setError('');
    try {
      const found = await searchMusic(q);
      setResults(found);
      if (found.length === 0) setError('No results — try another search or paste a YouTube link.');
    } catch {
      setError('Search failed — check connection or paste a YouTube URL.');
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runSearch(query), 450);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const togglePlay = () => {
    if (mode === 'audio' && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => setError('Playback blocked — click play again.'));
      }
      return;
    }
    if (mode === 'youtube' && ytId) {
      setPlaying((p) => !p);
    }
  };

  const playCurated = (id: string, title: string, artist: string) => {
    playYouTube(id, { id: `cur-${id}`, title, artist, youtubeId: id, source: 'curated' });
    setOpen(true);
  };

  const handlePastePlay = () => {
    const id = parseYouTubeId(pasteUrl);
    if (!id) {
      setError('Invalid YouTube URL or video ID');
      return;
    }
    playYouTube(id, { id: `paste-${id}`, title: 'YouTube', artist: 'Custom link', youtubeId: id, source: 'youtube' });
    setPasteUrl('');
    setOpen(true);
  };

  const stopAll = () => {
    stopAudio();
    setYtId(null);
    setPlaying(false);
  };

  if (reducedMotion) return null;

  const ytSrc =
    ytId && playing
      ? `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`
      : ytId
        ? `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`
        : null;

  return (
    <>
      {ytSrc && playing && mode === 'youtube' && (
        <div className="fixed bottom-24 left-6 z-[54] w-[min(92vw,320px)] aspect-video rounded-xl overflow-hidden border border-red-500/20 shadow-2xl pointer-events-auto">
          <iframe
            title="YouTube music"
            src={ytSrc}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      )}

      <div className="fixed bottom-6 left-6 z-[55] pointer-events-auto font-mono">
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-emerald-500/30 bg-[rgba(8,12,18,0.92)] backdrop-blur-md text-emerald-400 hover:border-emerald-400/50 transition-all shadow-[0_0_24px_rgba(52,211,153,0.15)]"
          >
            <Music className="w-4 h-4" />
            <span className="text-[10px] tracking-widest uppercase hidden sm:inline">Music</span>
            {playing && (
              <span className="flex gap-0.5 items-end h-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-emerald-400 rounded-full animate-pulse"
                    style={{ height: `${6 + (i % 2) * 4}px` }}
                  />
                ))}
              </span>
            )}
          </button>
        )}

        {open && (
          <div className="w-[min(94vw,380px)] max-h-[min(80vh,520px)] flex flex-col rounded-2xl border border-emerald-500/25 bg-[rgba(6,10,16,0.97)] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.55)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
              <div>
                <p className="text-[9px] tracking-[0.2em] text-emerald-400/70 uppercase">Search · YouTube · Deezer</p>
                <p className="text-sm text-white font-medium mt-0.5 truncate max-w-[220px]">
                  {current ? `${current.title}` : 'Pick a track'}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="p-1.5 text-slate/50 hover:text-white" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-3 py-2 border-b border-white/5 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate/40" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search songs, artists, cyber ambient…"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-slate/40 focus:border-emerald-500/40 outline-none"
                />
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400 animate-spin" />}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                  placeholder="Paste YouTube URL…"
                  className="flex-1 px-2 py-1.5 text-[10px] bg-black/40 border border-white/10 rounded text-white placeholder:text-slate/40 outline-none"
                />
                <button type="button" onClick={handlePastePlay} className="px-2 py-1.5 text-[10px] rounded border border-red-500/30 text-red-300 hover:bg-red-500/10 flex items-center gap-1">
                  <Youtube className="w-3 h-3" /> Play
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-2 py-2">
              {error && <p className="text-[10px] text-amber-400/90 px-2 py-1">{error}</p>}

              {results.length > 0 ? (
                <ul className="space-y-1">
                  {results.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => playTrack(r)}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-emerald-500/10 text-left transition-colors"
                      >
                        {r.thumbnail ? (
                          <img src={r.thumbnail} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                            <Music className="w-3 h-3 text-slate/50" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-white truncate">{r.title}</p>
                          <p className="text-[9px] text-slate/50 truncate">{r.artist} · {r.source}</p>
                        </div>
                        <Play className="w-3 h-3 text-emerald-400 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : !searching && !query && (
                <div>
                  <p className="text-[9px] text-slate/40 uppercase tracking-wider px-2 mb-2">Quick start</p>
                  <ul className="space-y-1">
                    {CURATED_YOUTUBE.map((c) => (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => playCurated(c.id, c.title, c.artist)}
                          className="w-full px-2 py-2 text-left rounded-lg hover:bg-cyan-500/10 text-[11px] text-slate/80"
                        >
                          <span className="text-white">{c.title}</span>
                          <span className="text-slate/50"> · {c.artist}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2 shrink-0">
              <button type="button" onClick={togglePlay} className="p-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button type="button" onClick={stopAll} className="p-2 rounded-lg border border-white/10 text-slate/60 text-[10px]">Stop</button>
              <button type="button" onClick={() => setMuted((m) => !m)} className="p-2 rounded-lg border border-white/10 text-slate/70">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="flex-1 h-1 accent-emerald-500" aria-label="Volume" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;
