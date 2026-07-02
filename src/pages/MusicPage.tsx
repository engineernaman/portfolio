import { useState, useEffect, useCallback, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Search, Loader2, Youtube, Radio, ExternalLink, ArrowLeft } from 'lucide-react';
import { CURATED_YOUTUBE } from '../data/speakingMedia';
import { searchMusic, youTubeWatchUrl, type MusicResult } from '../lib/musicSearch';
import { pageToHash } from '../data/siteNav';
import { useMusic } from '../context/MusicContext';

const MusicPage = () => {
  const {
    current,
    playing,
    volume,
    muted,
    mode,
    ytId,
    playerReady,
    playTrack,
    playCurated,
    playFromUrl,
    togglePlay,
    stop,
    setVolume,
    setMuted,
    setPlayerReady,
  } = useMusic();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [pasteUrl, setPasteUrl] = useState('');
  const [error, setError] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

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
      if (found.length === 0) setError('No results — paste a YouTube link directly.');
    } catch {
      setError('Search failed — paste a YouTube URL to play instantly.');
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runSearch(query), 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query, runSearch]);

  const handlePastePlay = () => {
    if (!playFromUrl(pasteUrl)) {
      setError('Invalid YouTube URL — try youtube.com/watch?v=… or youtu.be/…');
      return;
    }
    setPasteUrl('');
    setError('');
  };

  return (
    <main className="min-h-screen pt-20 pb-28 pointer-events-auto">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <a
          href={pageToHash('home')}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate/60 hover:text-emerald-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Portfolio
        </a>

        <header className="mb-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-emerald-400/80 mb-2">Music Studio</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-readable">Focus &amp; flow</h1>
          <p className="text-sm text-readable-dim mt-2">Search YouTube · plays in background across the entire site</p>
        </header>

        <div className="rounded-2xl border border-emerald-500/20 bg-[rgba(6,10,16,0.65)] backdrop-blur-xl overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-0 min-h-[min(70vh,600px)]">
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/5 font-mono order-2 lg:order-1">
              <div className="p-4 sm:p-5 border-b border-white/5 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate/40" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search YouTube songs, artists, lofi…"
                    className="w-full pl-10 pr-10 py-3 text-sm bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate/40 focus:border-emerald-500/40 outline-none"
                  />
                  {searching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pasteUrl}
                    onChange={(e) => setPasteUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePastePlay()}
                    placeholder="Paste any YouTube link…"
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
                            current?.id === r.id
                              ? 'bg-emerald-500/15 border border-emerald-500/25'
                              : 'hover:bg-white/5'
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
                            <p className="text-[10px] text-slate/50 truncate">
                              {r.artist} · {r.source}
                            </p>
                          </div>
                          <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : !searching && !query ? (
                  <div>
                    <p className="text-[10px] text-slate/40 uppercase tracking-wider px-1 mb-3 flex items-center gap-2">
                      <Radio className="w-3 h-3" /> Live stations
                    </p>
                    <ul className="space-y-1">
                      {CURATED_YOUTUBE.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => playCurated(c.id, c.title, c.artist)}
                            className="w-full px-3 py-2.5 text-left rounded-xl hover:bg-cyan-500/10 text-sm transition-colors"
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
                <button type="button" onClick={stop} className="px-3 py-2 rounded-lg border border-white/10 text-slate/60 text-xs">
                  Stop
                </button>
                <button
                  type="button"
                  onClick={() => setMuted(!muted)}
                  className="p-2 rounded-lg border border-white/10 text-slate/70"
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
            </div>

            <div className="flex flex-col bg-black/30 min-h-[260px] order-1 lg:order-2">
              <div className="p-4 border-b border-white/5 shrink-0 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400/70">Now playing</p>
                  <p className="text-lg text-white font-medium mt-1 truncate">{current?.title ?? 'Pick a station'}</p>
                  <p className="text-xs text-slate/50 truncate">{current?.artist ?? 'YouTube · background playback'}</p>
                </div>
                {ytId && (
                  <a
                    href={youTubeWatchUrl(ytId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-lg border border-white/10 text-slate/50 hover:text-red-300"
                    aria-label="Open on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div id="music-player-slot" className="flex-1 flex items-center justify-center p-3 sm:p-4 min-h-[240px]">
                {ytId && mode === 'youtube' ? (
                  <div className="w-full max-w-xl relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
                    {current?.thumbnail && (
                      <img
                        src={current.thumbnail}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-110"
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50">
                      <div className="flex gap-1 h-8 items-end">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-1 bg-emerald-400 rounded-full animate-pulse"
                            style={{
                              height: playing ? `${12 + (i % 3) * 8}px` : '8px',
                              animationDelay: `${i * 0.12}s`,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-emerald-400 font-mono">
                        {playing ? 'Streaming · background active' : 'Paused'}
                      </p>
                      <p className="text-xs text-slate/50 text-center px-4">
                        Hover the grip icon bottom-right for music controls anywhere on the site
                      </p>
                      {!playerReady && playing && (
                        <p className="text-xs text-slate/40 animate-pulse">Buffering…</p>
                      )}
                    </div>
                  </div>
                ) : mode === 'audio' && current ? (
                  <div className="text-center space-y-4">
                    {current.thumbnail && (
                      <img src={current.thumbnail} alt="" className="w-36 h-36 rounded-2xl object-cover mx-auto shadow-xl" />
                    )}
                    <p className="text-sm text-slate/60">Preview · loops in background</p>
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
                    <span className="text-sm text-white font-medium">Start {CURATED_YOUTUBE[0]?.title}</span>
                    <span className="text-xs text-slate/50">Keeps playing as you browse the portfolio</span>
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
