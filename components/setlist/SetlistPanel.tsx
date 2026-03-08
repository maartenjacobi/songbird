"use client";

import { useState } from "react";
import { useSetlists } from "@/hooks/useSetlists";
import { useSongContext } from "@/contexts/SongContext";
import { getSong } from "@/lib/storage";

export default function SetlistPanel() {
  const {
    setlists,
    addSetlist,
    removeSetlist,
    addSongToSetlist,
    removeSongFromSetlist,
    getSetlistSongs,
  } = useSetlists();
  const { song, setSong } = useSongContext();
  const [newName, setNewName] = useState("");
  const [activeSetlist, setActiveSetlist] = useState<string | null>(null);

  const handleAddSetlist = () => {
    if (!newName.trim()) return;
    const setlist = addSetlist(newName.trim());
    setNewName("");
    setActiveSetlist(setlist.id);
  };

  const handleLoadSong = (songId: string) => {
    const s = getSong(songId);
    if (s) setSong(s);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
      {/* Setlist tabs */}
      {setlists.map((sl) => (
        <div key={sl.id} className="relative group">
          <button
            onClick={() =>
              setActiveSetlist(activeSetlist === sl.id ? null : sl.id)
            }
            className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
              activeSetlist === sl.id
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 border border-zinc-700/50"
            }`}
          >
            {sl.name}
            <span className="ml-1 text-zinc-600">
              ({sl.songIds.length})
            </span>
          </button>
        </div>
      ))}

      {/* Voeg toe knop */}
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSetlist()}
          placeholder="Nieuwe setlist..."
          className="w-28 px-2 py-1 text-xs bg-zinc-800/30 border border-zinc-800 rounded text-zinc-400 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600"
        />
        {newName.trim() && (
          <button
            onClick={handleAddSetlist}
            className="text-xs text-amber-500 hover:text-amber-400"
          >
            +
          </button>
        )}
      </div>

      {/* Voeg huidig nummer toe aan actieve setlist */}
      {song && activeSetlist && (
        <button
          onClick={() => addSongToSetlist(activeSetlist, song.id)}
          className="px-2 py-1 text-xs bg-zinc-800/50 text-zinc-500 hover:text-amber-400 rounded border border-zinc-700/50 whitespace-nowrap transition-colors"
        >
          + Voeg toe
        </button>
      )}
    </div>
  );
}
