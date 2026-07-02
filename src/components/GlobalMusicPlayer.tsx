import { useMusic } from '../context/MusicContext';
import YouTubePlayer from './YouTubePlayer';

/** Hidden YouTube iframe only — UI lives in QuickActionDock */
const GlobalMusicPlayer = () => {
  const { mode, ytId, playing, volume, muted, setPlayerReady, setPlaying } = useMusic();

  if (mode !== 'youtube' || !ytId) return null;

  return (
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
  );
};

export default GlobalMusicPlayer;
