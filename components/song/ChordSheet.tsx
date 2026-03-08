"use client";

import { useMemo } from "react";
import { parseChordPro } from "@/lib/chord-parser";

interface ChordSheetProps {
  chordpro: string;
  onChordClick?: (chord: string) => void;
}

export default function ChordSheet({ chordpro, onChordClick }: ChordSheetProps) {
  const lines = useMemo(() => parseChordPro(chordpro), [chordpro]);

  return (
    <div className="font-mono text-sm leading-relaxed space-y-0">
      {lines.map((line, i) => {
        if (line.type === "empty") {
          return <div key={i} className="h-4" />;
        }

        if (line.type === "section") {
          return (
            <div
              key={i}
              className="text-amber-500 font-bold text-xs uppercase tracking-wider mt-6 mb-2"
            >
              {line.label}
            </div>
          );
        }

        if (line.type === "chordlyric" && line.pairs) {
          const hasChords = line.pairs.some((p) => p.chord);

          return (
            <div key={i} className="whitespace-pre-wrap">
              {hasChords && (
                <div className="text-amber-400 font-bold select-none h-5">
                  {line.pairs.map((pair, j) => (
                    <span key={j}>
                      {pair.chord ? (
                        <span
                          className="cursor-pointer hover:text-amber-300 transition-colors"
                          onClick={() => onChordClick?.(pair.chord)}
                        >
                          {pair.chord}
                        </span>
                      ) : null}
                      {pair.text ? (
                        <span className="invisible">
                          {pair.text.replace(/./g, "\u00A0")}
                        </span>
                      ) : null}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-zinc-300">
                {line.pairs.map((pair, j) => (
                  <span key={j}>
                    {pair.chord ? (
                      <span className="invisible font-bold">
                        {pair.chord.replace(/./g, "\u00A0")}
                      </span>
                    ) : null}
                    {pair.text || ""}
                  </span>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
