"use client";

import { useAppContext } from "@/contexts/AppContext";
import { getSong } from "@/lib/storage";
import type { SetlistSong } from "@/types/setlist";

export function useSetlists() {
  const {
    setlists,
    addSetlist,
    updateSetlist,
    removeSetlist,
    addSongToSetlist,
    removeSongFromSetlist,
  } = useAppContext();

  function getSetlistSongs(setlistId: string): SetlistSong[] {
    const setlist = setlists.find((s) => s.id === setlistId);
    if (!setlist) return [];

    const result: SetlistSong[] = [];
    for (const id of setlist.songIds) {
      const song = getSong(id);
      if (song) {
        result.push({
          songId: song.id,
          title: song.title,
          artist: song.artist,
          key: song.key,
        });
      }
    }
    return result;
  }

  return {
    setlists,
    addSetlist,
    updateSetlist,
    removeSetlist,
    addSongToSetlist,
    removeSongFromSetlist,
    getSetlistSongs,
  };
}
