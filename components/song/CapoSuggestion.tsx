"use client";

import { useMemo } from "react";
import { calculateCapoSuggestions } from "@/lib/capo-calculator";

interface CapoSuggestionProps {
  chords: string[];
  songKey: string;
}

export default function CapoSuggestion({
  chords,
  songKey,
}: CapoSuggestionProps) {
  const suggestions = useMemo(() => {
    if (chords.length === 0) return [];
    return calculateCapoSuggestions(chords, songKey).slice(0, 4);
  }, [chords, songKey]);

  if (suggestions.length === 0) return null;

  const bestNonZero = suggestions.find((s) => s.capo > 0);

  return (
    <div className="space-y-2">
      <h3 className="text-xs text-zinc-500 uppercase tracking-wide font-medium">
        Capo Suggesties
      </h3>
      <div className="space-y-1">
        {suggestions.map((s) => (
          <div
            key={s.capo}
            className={`flex items-center gap-3 px-3 py-1.5 rounded text-xs ${
              s.capo === bestNonZero?.capo
                ? "bg-amber-500/10 border border-amber-500/20"
                : "bg-zinc-800/50"
            }`}
          >
            <span className="text-zinc-400 w-14">
              {s.capo === 0 ? "Geen capo" : `Capo ${s.capo}`}
            </span>
            <span className="text-amber-400 font-medium w-6">
              {s.key}
            </span>
            <span className="text-zinc-500 truncate">
              {s.chords.join("  ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
