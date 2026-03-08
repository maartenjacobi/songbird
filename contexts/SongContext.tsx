"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Song, SongMetadata } from "@/types/song";
import { transposeChordPro, extractChordsFromChordPro, getTransposedKey } from "@/lib/transpose";
import { detectKeyFromChords } from "@/lib/music-theory";
import { saveSong, addRecentSong } from "@/lib/storage";

interface SongContextType {
  song: Song | null;
  setSong: (song: Song | null) => void;
  transpose: number;
  setTranspose: (n: number) => void;
  displayChordPro: string;
  displayKey: string;
  chords: string[];
  updateMetadata: (meta: SongMetadata) => void;
  toggleFavorite: () => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
}

const SongContext = createContext<SongContextType | null>(null);

export function SongProvider({ children }: { children: ReactNode }) {
  const [song, setSongState] = useState<Song | null>(null);
  const [transpose, setTranspose] = useState(0);
  const [loading, setLoading] = useState(false);

  const setSong = useCallback((s: Song | null) => {
    setSongState(s);
    setTranspose(0);
    if (s) {
      saveSong(s);
      addRecentSong(s.id);
    }
  }, []);

  const displayChordPro = song
    ? transposeChordPro(song.chordpro, transpose)
    : "";

  const chords = song
    ? extractChordsFromChordPro(displayChordPro)
    : [];

  const originalKey =
    song?.key || (song ? detectKeyFromChords(extractChordsFromChordPro(song.chordpro)) : null) || "C";

  const displayKey = getTransposedKey(originalKey, transpose);

  const updateMetadata = useCallback(
    (meta: SongMetadata) => {
      if (!song) return;
      const updated = { ...song, ...meta };
      setSongState(updated);
      saveSong(updated);
    },
    [song]
  );

  const toggleFavorite = useCallback(() => {
    if (!song) return;
    const updated = { ...song, favorite: !song.favorite };
    setSongState(updated);
    saveSong(updated);
  }, [song]);

  return (
    <SongContext.Provider
      value={{
        song,
        setSong,
        transpose,
        setTranspose,
        displayChordPro,
        displayKey,
        chords,
        updateMetadata,
        toggleFavorite,
        loading,
        setLoading,
      }}
    >
      {children}
    </SongContext.Provider>
  );
}

export function useSongContext() {
  const ctx = useContext(SongContext);
  if (!ctx) throw new Error("useSongContext buiten SongProvider");
  return ctx;
}
