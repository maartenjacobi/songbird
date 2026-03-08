import { textToChordPro } from "./chord-parser";

export interface FetchResult {
  chordpro: string;
  source: string;
}

async function fetchFromApi(
  artist: string,
  title: string
): Promise<FetchResult | null> {
  try {
    const response = await fetch(`/api/chords?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.chordpro) {
      return { chordpro: data.chordpro, source: data.source };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchChords(
  artist: string,
  title: string
): Promise<FetchResult | null> {
  // Probeer de server-side API (die de waterval afhandelt)
  const result = await fetchFromApi(artist, title);
  if (result) return result;

  return null;
}

export function generateSongId(artist: string, title: string): string {
  return `${artist.toLowerCase().replace(/\s+/g, "-")}_${title.toLowerCase().replace(/\s+/g, "-")}`;
}
