"use client";

import SearchBar from "@/components/search/SearchBar";
import TransposeControls from "@/components/song/TransposeControls";
import { useSong } from "@/hooks/useSong";

export default function TopBar() {
  const { song, displayKey, transpose, setTranspose, toggleFavorite, loading, loadSong } =
    useSong();

  return (
    <header className="flex items-center gap-4 px-4 py-2.5 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <svg
          className="w-6 h-6 text-amber-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <span className="text-sm font-bold text-zinc-100 hidden sm:block">
          SongBird
        </span>
      </div>

      {/* Search */}
      <SearchBar onSearch={loadSong} loading={loading} />

      {/* Song controls */}
      {song && (
        <div className="flex items-center gap-4 shrink-0">
          <TransposeControls
            currentKey={displayKey}
            transpose={transpose}
            onTranspose={setTranspose}
          />

          {/* BPM */}
          {song.bpm && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-500">BPM</span>
              <span className="text-sm text-zinc-300">{song.bpm}</span>
            </div>
          )}

          {/* Favorite */}
          <button
            onClick={toggleFavorite}
            className={`text-lg transition-colors ${
              song.favorite
                ? "text-amber-400"
                : "text-zinc-600 hover:text-zinc-400"
            }`}
            title={song.favorite ? "Verwijder favoriet" : "Maak favoriet"}
          >
            {song.favorite ? "\u2605" : "\u2606"}
          </button>
        </div>
      )}
    </header>
  );
}
