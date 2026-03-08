import { transposeChord } from "./music-theory";

const CHORD_REGEX = /\[([A-G][#b]?[^[\]]*)\]/g;

export function transposeChordPro(
  chordpro: string,
  semitones: number
): string {
  if (semitones === 0) return chordpro;

  return chordpro.replace(CHORD_REGEX, (_, chord) => {
    const transposed = transposeChord(chord, semitones);
    return `[${transposed}]`;
  });
}

export function extractChordsFromChordPro(chordpro: string): string[] {
  const chords: string[] = [];
  let match;
  const regex = new RegExp(CHORD_REGEX);

  while ((match = regex.exec(chordpro)) !== null) {
    if (!chords.includes(match[1])) {
      chords.push(match[1]);
    }
  }

  return chords;
}

export function getTransposedKey(
  originalKey: string,
  semitones: number
): string {
  return transposeChord(originalKey, semitones);
}
