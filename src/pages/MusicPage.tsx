import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Search, Loader2, Youtube, Radio } from 'lucide-react';
import { CURATED_YOUTUBE } from '../data/speakingMedia';
import { searchMusic, parseYouTubeId, type MusicResult } from '../lib/musicSearch';
import { pageToHash } from '../data/siteNav';
import { ArrowLeft } from 'lucide-react';

type PlayMode = 'youtube' | 'audio';

const MusicPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [current, setCurrent] = useState<MusicResult | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.55);
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
      if (track.youtubeId) playYouTube(track.youtubeId, track);
      else if (track.previewUrl) playAudioPreview(track);
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
    if (mode === 'youtube' && ytId) setPlaying((p) => !p);
  };

  const playCurated = (id: string, title: string, artist: string) => {
    playYouTube(id, { id: `cur-${id}`, title, artist, youtubeId: id, source: 'curated' });
  };

  const handlePastePlay = () => {
    const id = parseYouTubeId(pasteUrl);
    if (!id) {
      setError('Invalid YouTube URL or video ID');
      return;
    }
    playYouTube(id, { id: `paste-${id}`, title: 'YouTube', artist: 'Custom link', youtubeId: id, source: 'youtube' });
    setPasteUrl('');
  };

  const stopAll = () => {
    stopAudio();
    setYtId(null);
    setPlaying(false);
  };

  const ytSrc = ytId
    ? `https://www.youtube-nocookie.com/embed/${ytId}?${playing ? 'autoplay=1&' : ''}rel=0&modestbranding=1&playsinline=1`
    : null;

  return (
    <main className="min-h-screen pt-20 pb-28 pointer-events-auto">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <a
          href={pageToHash('home')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate/60 hover:text-emerald-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Portfolio
        </a>

        <header className="mb-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-400/80 mb-2">Music Studio</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-readable">Focus & flow</h1>
        </header>

        <div className="rounded-2xl border border-emerald-500/20 bg-[rgba(6,10,16,0.78)] backdrop-blur-xl shadow-[0_0_60px_rgba(52,211,153,0.06)] overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-0 min-h-[min(70vh,600px)]">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 font-mono order-2 lg:order-1">
              <div className="p-4 sm:p-5 border-b border-white/5 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/40" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search songs, artists, lofi, cyber ambient…"
                    className="w-full pl-10 pr-10 py-3 text-sm bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate/40 focus:border-emerald-500/40 outline-none"
                  />
                  {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pasteUrl}
                    onChange={(e) => setPasteUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePastePlay()}
                    placeholder="Paste YouTube URL or video ID…"
                    className="flex-1 px-3 py-2 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-slate/40 outline-none focus:border-red-500/30"
                  />
                  <button
                    type="button"
                    onClick={handlePastePlay}
                    className="px-3 py-2 text-xs rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 flex items-center gap-1.5 shrink-0"
                  >
                    <Youtube className="w-3.5 h-3.5" /> Play
                  </button>
                </div>
                {error && <p className="text-xs text-amber-400/90">{error}</p>}
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-[200px] max-h-[340px] lg:max-h-none">
                {results.length > 0 ? (
                  <ul className="space-y-1">
                    {results.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => playTrack(r)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                            current?.id === r.id ? 'bg-emerald-500/15 border border-emerald-500/25' : 'hover:bg-white/5'
                          }`}
                        >
                          {r.thumbnail ? (
                            <img src={r.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                              <Music className="w-4 h-4 text-slate/50" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-white truncate">{r.title}</p>
                            <p className="text-[10px] text-slate/50 truncate">{r.artist} · {r.source}</p>
                          </div>
                          <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : !searching && !query ? (
                  <div>
                    <p className="text-[10px] text-slate/40 uppercase tracking-wider px-1 mb-3 flex items-center gap-2">
                      <Radio className="w-3 h-3" /> Tap to play
                    </p>
                    <ul className="space-y-1">
                      {CURATED_YOUTUBE.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => playCurated(c.id, c.title, c.artist)}
                            className="w-full px-3 py-2.5 text-left rounded-xl hover:bg-cyan-500/10 text-sm text-slate/80 transition-colors"
                          >
                            <span className="text-white">{c.title}</span>
                            <span className="text-slate/50"> · {c.artist}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="p-4 border-t border-white/5 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!current}
                  className="p-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 disabled:opacity-40"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button type="button" onClick={stopAll} className="px-3 py-2 rounded-lg border border-white/10 text-slate/60 text-xs">
                  Stop
                </button>
                <button type="button" onClick={() => setMuted((m) => !m)} className="p-2 rounded-lg border border-white/10 text-slate/70">
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
            </div>

            <div className="flex flex-col bg-black/40 min-h-[240px] order-1 lg:order-2">
              <div className="p-4 border-b border-white/5 shrink-0">
                <p className="text-[10px] uppercase tracking-widest text-emerald-400/70">Now playing</p>
                <p className="text-lg text-white font-medium mt-1 truncate">{current?.title ?? 'Pick a station'}</p>
                <p className="text-xs text-slate/50 truncate">{current?.artist ?? 'Curated streams & search'}</p>
              </div>
              <div className="flex-1 flex items-center justify-center p-3 sm:p-4 min-h-[220px]">
                {ytSrc && mode === 'youtube' ? (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <iframe
                      key={ytId}
                      title="YouTube music"
                      src={ytSrc}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : mode === 'audio' && current ? (
                  <div className="text-center space-y-4">
                    {current.thumbnail && (
                      <img src={current.thumbnail} alt="" className="w-36 h-36 rounded-2xl object-cover mx-auto shadow-xl" />
                    )}
                    <p className="text-sm text-slate/60">Deezer preview · loops</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const first = CURATED_YOUTUBE[0];
                      if (first) playCurated(first.id, first.title, first.artist);
                    }}
                    className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/15 transition-colors text-center"
                  >
                    <Play className="w-10 h-10 text-emerald-400 p-2 rounded-full border border-emerald-500/40 bg-emerald-500/20" />
                    <span className="text-sm text-white font-medium">Start {CURATED_YOUTUBE[0]?.title ?? 'listening'}</span>
                    <span className="text-xs text-slate/50">One tap · YouTube stream</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MusicPage;
