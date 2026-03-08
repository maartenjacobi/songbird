import type { Song } from "@/types/song";
import type { Setlist } from "@/types/setlist";

const SONGS_KEY = "songbird_songs";
const SETLISTS_KEY = "songbird_setlists";
const RECENT_KEY = "songbird_recent";

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Songs
export function getSongs(): Song[] {
  return getItem<Song[]>(SONGS_KEY, []);
}

export function getSong(id: string): Song | undefined {
  return getSongs().find((s) => s.id === id);
}

export function saveSong(song: Song): void {
  const songs = getSongs();
  const index = songs.findIndex((s) => s.id === song.id);
  if (index >= 0) {
    songs[index] = song;
  } else {
    songs.push(song);
  }
  setItem(SONGS_KEY, songs);
}

export function deleteSong(id: string): void {
  const songs = getSongs().filter((s) => s.id !== id);
  setItem(SONGS_KEY, songs);
}

export function findSong(
  artist: string,
  title: string
): Song | undefined {
  return getSongs().find(
    (s) =>
      s.artist.toLowerCase() === artist.toLowerCase() &&
      s.title.toLowerCase() === title.toLowerCase()
  );
}

// Setlists
export function getSetlists(): Setlist[] {
  return getItem<Setlist[]>(SETLISTS_KEY, []);
}

export function saveSetlist(setlist: Setlist): void {
  const setlists = getSetlists();
  const index = setlists.findIndex((s) => s.id === setlist.id);
  if (index >= 0) {
    setlists[index] = setlist;
  } else {
    setlists.push(setlist);
  }
  setItem(SETLISTS_KEY, setlists);
}

export function deleteSetlist(id: string): void {
  const setlists = getSetlists().filter((s) => s.id !== id);
  setItem(SETLISTS_KEY, setlists);
}

// Recent
export function getRecentSongs(): string[] {
  return getItem<string[]>(RECENT_KEY, []);
}

export function addRecentSong(songId: string): void {
  const recent = getRecentSongs().filter((id) => id !== songId);
  recent.unshift(songId);
  setItem(RECENT_KEY, recent.slice(0, 20));
}

// Favorites
export function toggleFavorite(songId: string): boolean {
  const song = getSong(songId);
  if (!song) return false;
  song.favorite = !song.favorite;
  saveSong(song);
  return song.favorite;
}

export function getFavorites(): Song[] {
  return getSongs().filter((s) => s.favorite);
}
