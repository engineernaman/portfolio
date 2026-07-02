import { Pause, Play, Music, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { useSitePage } from '../hooks/useSitePage';
import { pageToHash } from '../data/siteNav';
import YouTubePlayer from './YouTubePlayer';

const GlobalMusicPlayer = () => {
  const {
    current,
    playing,
    volume,
    muted,
    mode,
    ytId,
    togglePlay,
    stop,
    setPlayerReady,
    setPlaying,
    hasActiveTrack,
  } = useMusic();
  const { page } = useSitePage();
  const onMusicPage = page === 'music';

  return (
    <>
      {mode === 'youtube' && ytId && (
        <div
          className="fixed overflow-hidden pointer-events-none"
          style={{ left: -9999, top: 0, width: 320, height: 180, opacity: 0 }}
          aria-hidden
        >
          <YouTubePlayer
            videoId={ytId}
            playing={playing}
            volume={volume}
            muted={muted}
            onReady={() => setPlayerReady(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>
      )}

      <AnimatePresence>
        {hasActiveTrack && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[70] pointer-events-auto"
          >
            <div className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-2xl border border-emerald-500/30 bg-[rgba(6,10,16,0.88)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] max-w-[min(320px,calc(100vw-3rem))]">
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/70">
                  {playing ? 'Now playing' : 'Paused'}
                </p>
                <p className="text-sm text-white font-medium truncate">{current?.title ?? 'Music'}</p>
                <p className="text-[10px] text-slate/50 truncate">{current?.artist}</p>
              </div>

              <button
                type="button"
                onClick={togglePlay}
                className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition-colors shrink-0"
                aria-label={playing ? 'Pause music' : 'Play music'}
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {!onMusicPage && (
                <a
                  href={pageToHash('music')}
                  className="p-2.5 rounded-xl border border-white/10 text-slate/60 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors shrink-0"
                  aria-label="Open music studio"
                >
                  <Music className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={stop}
                className="p-2 rounded-lg text-slate/40 hover:text-rose-400 transition-colors shrink-0"
                aria-label="Stop music"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasActiveTrack && (
        <a
          href={pageToHash('music')}
          className="fixed bottom-6 right-6 z-[70] p-3.5 rounded-2xl border border-white/10 bg-[rgba(6,10,16,0.75)] backdrop-blur-md text-slate/50 hover:text-emerald-400 hover:border-emerald-500/30 transition-all pointer-events-auto shadow-lg"
          aria-label="Open music studio"
        >
          <Music className="w-5 h-5" />
        </a>
      )}
    </>
  );
};

export default GlobalMusicPlayer;
