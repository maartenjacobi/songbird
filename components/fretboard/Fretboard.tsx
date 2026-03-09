"use client";

import { useMemo } from "react";
import { getScale, getFretboardNotes, getChordInfo, getScaleTypes } from "@/lib/music-theory";
import { useFretboardContext } from "@/contexts/FretboardContext";
import { useSongContext } from "@/contexts/SongContext";
import { Note } from "tonal";
import type { FretNote, ScaleType } from "@/types/music";

const NUM_FRETS = 12;
const NUM_STRINGS = 6;
const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];
const FRET_MARKERS = [3, 5, 7, 9, 12];

// SVG dimensions
const PADDING_LEFT = 28;
const PADDING_RIGHT = 8;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 16;
const FRET_WIDTH = 36;
const STRING_SPACING = 16;
const TOTAL_WIDTH = PADDING_LEFT + FRET_WIDTH * NUM_FRETS + PADDING_RIGHT;
const TOTAL_HEIGHT = PADDING_TOP + STRING_SPACING * (NUM_STRINGS - 1) + PADDING_BOTTOM;

export default function Fretboard() {
  const { scaleType, setScaleType, highlightedChord } = useFretboardContext();
  const { displayKey } = useSongContext();

  const effectiveRoot = displayKey?.replace(/m$/, "") || "E";

  const fretNotes = useMemo(() => {
    const scale = getScale(effectiveRoot, scaleType);
    return getFretboardNotes(scale, undefined, NUM_FRETS);
  }, [effectiveRoot, scaleType]);

  // Bereken welke chromas bij het highlighted chord horen
  const highlightedChromas = useMemo(() => {
    if (!highlightedChord) return null;
    const info = getChordInfo(highlightedChord);
    if (!info || info.notes.length === 0) return null;
    return new Set(info.notes.map((n) => Note.chroma(n)).filter((c): c is number => c !== null));
  }, [highlightedChord]);

  const scaleTypes = getScaleTypes();

  function getNoteColor(note: FretNote): string {
    // Als er een chord is gehighlight, kleur alleen die noten
    if (highlightedChromas) {
      const chroma = Note.chroma(note.note);
      if (chroma !== null && highlightedChromas.has(chroma)) {
        return note.isRoot ? "#d97706" : "#22c55e"; // amber voor root, groen voor chord tonen
      }
      return "#3f3f46"; // Dim de rest
    }
    // Standaard: root = amber, rest = blauw
    return note.isRoot ? "#d97706" : "#3b82f6";
  }

  function getNoteOpacity(note: FretNote): number {
    if (highlightedChromas) {
      const chroma = Note.chroma(note.note);
      if (chroma !== null && highlightedChromas.has(chroma)) return 1;
      return 0.2;
    }
    return note.isRoot ? 1 : 0.8;
  }

  return (
    <div className="space-y-2">
      {/* Scale selector + chord indicator */}
      <div className="flex items-center gap-0.5 flex-wrap">
        <span className="text-[11px] text-zinc-500 mr-0.5">{effectiveRoot}</span>
        {scaleTypes.map((st) => (
          <button
            key={st.value}
            onClick={() => setScaleType(st.value)}
            className={`px-1.5 py-0.5 text-[11px] rounded transition-colors ${
              scaleType === st.value
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 border border-transparent"
            }`}
          >
            {st.label}
          </button>
        ))}
        {highlightedChord && (
          <span className="ml-auto text-xs text-green-400 font-medium">
            {highlightedChord}
          </span>
        )}
      </div>

      {/* Fretboard SVG */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}
          className="w-full"
        >
          {/* Achtergrond */}
          <rect
            x={PADDING_LEFT}
            y={PADDING_TOP - 2}
            width={FRET_WIDTH * NUM_FRETS}
            height={STRING_SPACING * (NUM_STRINGS - 1) + 4}
            fill="#1a1a1a"
            rx="2"
          />

          {/* Nut (nulde fret) */}
          <line
            x1={PADDING_LEFT}
            y1={PADDING_TOP - 2}
            x2={PADDING_LEFT}
            y2={PADDING_TOP + STRING_SPACING * (NUM_STRINGS - 1) + 2}
            stroke="#d4d4d8"
            strokeWidth="3"
          />

          {/* Frets */}
          {Array.from({ length: NUM_FRETS }, (_, i) => (
            <line
              key={`fret-${i + 1}`}
              x1={PADDING_LEFT + FRET_WIDTH * (i + 1)}
              y1={PADDING_TOP - 2}
              x2={PADDING_LEFT + FRET_WIDTH * (i + 1)}
              y2={PADDING_TOP + STRING_SPACING * (NUM_STRINGS - 1) + 2}
              stroke="#3f3f46"
              strokeWidth="1"
            />
          ))}

          {/* Fret markers */}
          {FRET_MARKERS.map((fret) => (
            <g key={`marker-${fret}`}>
              {fret === 12 ? (
                <>
                  <circle
                    cx={PADDING_LEFT + FRET_WIDTH * fret - FRET_WIDTH / 2}
                    cy={PADDING_TOP + STRING_SPACING * 1.5}
                    r="3"
                    fill="#3f3f46"
                  />
                  <circle
                    cx={PADDING_LEFT + FRET_WIDTH * fret - FRET_WIDTH / 2}
                    cy={PADDING_TOP + STRING_SPACING * 3.5}
                    r="3"
                    fill="#3f3f46"
                  />
                </>
              ) : (
                <circle
                  cx={PADDING_LEFT + FRET_WIDTH * fret - FRET_WIDTH / 2}
                  cy={PADDING_TOP + STRING_SPACING * 2.5}
                  r="3"
                  fill="#3f3f46"
                />
              )}
            </g>
          ))}

          {/* Fret numbers */}
          {Array.from({ length: NUM_FRETS }, (_, i) => (
            <text
              key={`fretnum-${i + 1}`}
              x={PADDING_LEFT + FRET_WIDTH * (i + 1) - FRET_WIDTH / 2}
              y={PADDING_TOP - 10}
              textAnchor="middle"
              className="text-[9px] fill-zinc-600"
            >
              {i + 1}
            </text>
          ))}

          {/* Strings */}
          {Array.from({ length: NUM_STRINGS }, (_, i) => (
            <g key={`string-${i}`}>
              <line
                x1={PADDING_LEFT}
                y1={PADDING_TOP + STRING_SPACING * i}
                x2={PADDING_LEFT + FRET_WIDTH * NUM_FRETS}
                y2={PADDING_TOP + STRING_SPACING * i}
                stroke="#71717a"
                strokeWidth={1 + (NUM_STRINGS - 1 - i) * 0.3}
              />
              <text
                x={PADDING_LEFT - 14}
                y={PADDING_TOP + STRING_SPACING * i + 4}
                textAnchor="middle"
                className="text-[10px] fill-zinc-500"
              >
                {STRING_NAMES[i]}
              </text>
            </g>
          ))}

          {/* Scale notes */}
          {fretNotes.map((note, i) => {
            const cx =
              note.fret === 0
                ? PADDING_LEFT - 4
                : PADDING_LEFT + FRET_WIDTH * note.fret - FRET_WIDTH / 2;
            const cy = PADDING_TOP + STRING_SPACING * note.string;

            return (
              <g key={`note-${i}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill={getNoteColor(note)}
                  opacity={getNoteOpacity(note)}
                  className="transition-all duration-150"
                />
                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  className="text-[8px] fill-white font-bold"
                  style={{
                    pointerEvents: "none",
                    opacity: getNoteOpacity(note),
                  }}
                >
                  {note.degree}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
