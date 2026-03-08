"use client";

import ChordSheet from "./ChordSheet";
import CapoSuggestion from "./CapoSuggestion";
import { useSongContext } from "@/contexts/SongContext";
import { useFretboardContext } from "@/contexts/FretboardContext";
import { getMetaFromChordPro } from "@/lib/chord-parser";

export default function SongView() {
  const { song, displayChordPro, displayKey, chords } = useSongContext();
  const { setHighlightedChord } = useFretboardContext();

  if (!song) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600">
        <div className="text-center space-y-3">
          <svg
            className="w-16 h-16 mx-auto text-zinc-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <p className="text-sm">Zoek een nummer om te beginnen</p>
          <p className="text-xs text-zinc-700">
            Bijv. &quot;John Mayer - Gravity&quot;
          </p>
        </div>
      </div>
    );
  }

  const meta = getMetaFromChordPro(song.chordpro);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Song header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800/50">
        {song.albumArt && (
          <img
            src={song.albumArt}
            alt={`${song.title} album art`}
            className="w-14 h-14 rounded-md shadow-lg"
          />
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-zinc-100 truncate">
            {meta.title || song.title}
          </h2>
          <p className="text-sm text-zinc-400 truncate">
            {meta.artist || song.artist}
          </p>
        </div>
      </div>

      {/* Chord sheet */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
        <ChordSheet
          chordpro={displayChordPro}
          onChordClick={(chord) => setHighlightedChord(chord)}
        />
      </div>

      {/* Capo suggestions (inklapbaar) */}
      <details className="border-t border-zinc-800/50">
        <summary className="px-6 py-2 text-xs text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">
          Capo suggesties
        </summary>
        <div className="px-6 pb-4">
          <CapoSuggestion chords={chords} songKey={displayKey} />
        </div>
      </details>
    </div>
  );
}
