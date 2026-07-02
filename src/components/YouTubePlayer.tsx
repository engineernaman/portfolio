import { useEffect, useRef, useId, useCallback } from 'react';
import { loadYouTubeAPI, type YTPlayer } from '../lib/youtubeApi';

type YouTubePlayerProps = {
  videoId: string | null;
  playing: boolean;
  volume: number;
  muted: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: () => void;
};

const YouTubePlayer = ({
  videoId,
  playing,
  volume,
  muted,
  onReady,
  onPlay,
  onPause,
  onError,
}: YouTubePlayerProps) => {
  const uid = useId().replace(/:/g, '');
  const containerId = `yt-player-${uid}`;
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);

  const destroy = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        /* already destroyed */
      }
      playerRef.current = null;
      readyRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!videoId) {
      destroy();
      return;
    }

    let cancelled = false;

    loadYouTubeAPI()
      .then((YT) => {
        if (cancelled) return;
        destroy();

        playerRef.current = new YT.Player(containerId, {
          videoId,
          playerVars: {
            autoplay: playing ? 1 : 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              readyRef.current = true;
              e.target.setVolume(Math.round(volume * 100));
              if (muted) e.target.mute();
              else e.target.unMute();
              if (playing) e.target.playVideo();
              onReady?.();
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) onPlay?.();
              if (e.data === YT.PlayerState.PAUSED) onPause?.();
            },
            onError: () => onError?.(),
          },
        });
      })
      .catch(() => onError?.());

    return () => {
      cancelled = true;
      destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recreate only when videoId changes
  }, [videoId]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    if (playing) p.playVideo();
    else p.pauseVideo();
  }, [playing]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !readyRef.current) return;
    p.setVolume(Math.round(volume * 100));
    if (muted) p.mute();
    else p.unMute();
  }, [volume, muted]);

  return (
    <div className="w-full h-full min-h-[200px] rounded-xl overflow-hidden bg-black">
      <div id={containerId} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:min-h-[200px]" />
    </div>
  );
};

export default YouTubePlayer;
