export interface Song {
  id: string;
  title: string;
  artist: string;
  chordpro: string;
  key?: string;
  bpm?: number;
  timeSignature?: string;
  albumArt?: string;
  youtubeId?: string;
  spotifyId?: string;
  capo?: number;
  transpose?: number;
  lastPlayed?: string;
  favorite?: boolean;
}

export interface SongMetadata {
  key?: string;
  bpm?: number;
  timeSignature?: string;
  albumArt?: string;
  spotifyId?: string;
}

export interface SearchResult {
  title: string;
  artist: string;
  source: string;
}

export interface ChordLine {
  type: "chord" | "lyric" | "chordlyric" | "empty" | "comment" | "section";
  content: string;
  chords?: string[];
}
