"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ScaleType } from "@/types/music";

interface FretboardContextType {
  scaleType: ScaleType;
  setScaleType: (type: ScaleType) => void;
  highlightedChord: string | null;
  setHighlightedChord: (chord: string | null) => void;
  rootNote: string;
  setRootNote: (note: string) => void;
}

const FretboardContext = createContext<FretboardContextType | null>(null);

export function FretboardProvider({ children }: { children: ReactNode }) {
  const [scaleType, setScaleType] = useState<ScaleType>("pentatonic minor");
  const [highlightedChord, setHighlightedChord] = useState<string | null>(null);
  const [rootNote, setRootNote] = useState("E");

  return (
    <FretboardContext.Provider
      value={{
        scaleType,
        setScaleType,
        highlightedChord,
        setHighlightedChord,
        rootNote,
        setRootNote,
      }}
    >
      {children}
    </FretboardContext.Provider>
  );
}

export function useFretboardContext() {
  const ctx = useContext(FretboardContext);
  if (!ctx) throw new Error("useFretboardContext buiten FretboardProvider");
  return ctx;
}
