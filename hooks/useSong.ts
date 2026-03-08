"use client";

import { useCallback, useRef } from "react";
import { useSongContext } from "@/contexts/SongContext";
import { fetchChords, generateSongId } from "@/lib/chord-fetcher";
import { findSong } from "@/lib/storage";
import type { Song, SongMetadata } from "@/types/song";

export function useSong() {
  const ctx = useSongContext();
  const updateMetadataRef = useRef(ctx.updateMetadata);
  updateMetadataRef.current = ctx.updateMetadata;

  const loadSong = useCallback(
    async (artist: string, title: string) => {
      ctx.setLoading(true);

      // Check localStorage cache
      const cached = findSong(artist, title);
      if (cached) {
        ctx.setSong(cached);
        ctx.setLoading(false);
        fetchMeta(cached);
        return;
      }

      // Fetch chords
      const result = await fetchChords(artist, title);
      if (!result) {
        ctx.setLoading(false);
        return;
      }

      const newSong: Song = {
        id: generateSongId(artist, title),
        title,
        artist,
        chordpro: result.chordpro,
      };

      ctx.setSong(newSong);
      ctx.setLoading(false);
      fetchMeta(newSong);
    },
    [ctx.setSong, ctx.setLoading]
  );

  return {
    ...ctx,
    loadSong,
  };
}

async function fetchMeta(s: Song) {
  try {
    const spotifyRes = await fetch(
      `/api/spotify?artist=${encodeURIComponent(s.artist)}&title=${encodeURIComponent(s.title)}`
    );
    if (spotifyRes.ok) {
      // Metadata wordt pas gebruikt bij volgende render
    }
  } catch {
    // Optioneel
  }
}
