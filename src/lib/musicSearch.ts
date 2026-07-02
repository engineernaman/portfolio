export interface MusicResult {
  id: string;
  title: string;
  artist: string;
  thumbnail?: string;
  previewUrl?: string;
  youtubeId?: string;
  source: 'deezer' | 'youtube' | 'curated';
}

export async function searchDeezer(query: string): Promise<MusicResult[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=10`
    );
    const data = await res.json();
    return (data.data ?? []).map((t: { id: number; title: string; artist: { name: string }; album: { cover_small: string }; preview: string }) => ({
      id: `dz-${t.id}`,
      title: t.title,
      artist: t.artist.name,
      thumbnail: t.album?.cover_small,
      previewUrl: t.preview,
      source: 'deezer' as const,
    }));
  } catch {
    return [];
  }
}

/** Search YouTube via Piped public API (full-track embed playback) */
export async function searchYouTube(query: string): Promise<MusicResult[]> {
  if (!query.trim()) return [];
  const instances = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.adminforge.de',
  ];

  for (const base of instances) {
    try {
      const res = await fetch(
        `${base}/search?q=${encodeURIComponent(query)}&filter=music_songs`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const items = data.items ?? data.relatedStreams ?? [];
      return items.slice(0, 10).map((v: { url: string; title: string; uploaderName: string; thumbnail: string }) => {
        const id = v.url?.replace('https://youtube.com/watch?v=', '') ?? '';
        return {
          id: `yt-${id}`,
          title: v.title,
          artist: v.uploaderName ?? 'YouTube',
          thumbnail: v.thumbnail,
          youtubeId: id,
          source: 'youtube' as const,
        };
      });
    } catch {
      continue;
    }
  }
  return [];
}

export function parseYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  return null;
}

export async function searchMusic(query: string): Promise<MusicResult[]> {
  const [deezer, youtube] = await Promise.all([
    searchDeezer(query),
    searchYouTube(query),
  ]);
  return [...youtube, ...deezer].slice(0, 12);
}
