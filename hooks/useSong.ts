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
        fetchMetaInBackground(artist, title, updateMetadataRef);
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
      fetchMetaInBackground(artist, title, updateMetadataRef);
    },
    [ctx.setSong, ctx.setLoading]
  );

  return {
    ...ctx,
    loadSong,
  };
}

async function fetchMetaInBackground(
  artist: string,
  title: string,
  updateRef: React.RefObject<(meta: SongMetadata) => void>
) {
  // Spotify metadata
  try {
    const spotifyRes = await fetch(
      `/api/spotify?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`
    );
    if (spotifyRes.ok) {
      const meta: SongMetadata = await spotifyRes.json();
      updateRef.current(meta);
    }
  } catch {
    // Spotify is optioneel
  }

  // YouTube video
  try {
    const ytRes = await fetch(
      `/api/youtube?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`
    );
    if (ytRes.ok) {
      const data = await ytRes.json();
      if (data.videoId) {
        updateRef.current({ youtubeId: data.videoId });
      }
    }
  } catch {
    // YouTube is optioneel
  }
}
