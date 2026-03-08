export type NoteName =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

export type ScaleType =
  | "major"
  | "minor"
  | "pentatonic major"
  | "pentatonic minor"
  | "blues"
  | "dorian"
  | "mixolydian";

export interface ScaleInfo {
  name: string;
  type: ScaleType;
  notes: string[];
  intervals: string[];
}

export interface ChordInfo {
  name: string;
  root: string;
  quality: string;
  notes: string[];
  intervals: string[];
}

export interface FretNote {
  string: number;
  fret: number;
  note: string;
  degree: number;
  isRoot: boolean;
}

export interface TunerReading {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  isInTune: boolean;
}

export const ALL_NOTES: NoteName[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const STANDARD_TUNING = ["E2", "A2", "D3", "G3", "B3", "E4"];
