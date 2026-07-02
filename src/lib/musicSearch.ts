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
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=8`
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

/** Server-proxied YouTube search (no browser CORS issues) */
export async function searchYouTube(query: string): Promise<MusicResult[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

export { parseYouTubeId, youTubeWatchUrl } from './youtubeApi';

export async function searchMusic(query: string): Promise<MusicResult[]> {
  const [youtube, deezer] = await Promise.all([searchYouTube(query), searchDeezer(query)]);
  return [...youtube, ...deezer].slice(0, 14);
}
