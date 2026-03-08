import { transposeChord } from "./music-theory";

const OPEN_CHORDS = new Set([
  "A",
  "Am",
  "Am7",
  "A7",
  "C",
  "C7",
  "Cmaj7",
  "D",
  "Dm",
  "Dm7",
  "D7",
  "E",
  "Em",
  "Em7",
  "E7",
  "G",
  "G7",
  "F",
  "Fmaj7",
]);

interface CapoSuggestion {
  capo: number;
  chords: string[];
  score: number;
  key: string;
}

function chordScore(chord: string): number {
  if (OPEN_CHORDS.has(chord)) return 3;
  // Deels open (bijv. Asus4)
  const root = chord.match(/^[A-G][#b]?/)?.[0];
  if (root && OPEN_CHORDS.has(root)) return 1;
  return 0; // Barre akkoord
}

export function calculateCapoSuggestions(
  chords: string[],
  originalKey: string
): CapoSuggestion[] {
  const suggestions: CapoSuggestion[] = [];

  for (let capo = 0; capo <= 9; capo++) {
    const transposedChords = chords.map((c) => transposeChord(c, -capo));
    const score = transposedChords.reduce((sum, c) => sum + chordScore(c), 0);
    const transposedKey = transposeChord(originalKey, -capo);

    suggestions.push({
      capo,
      chords: [...new Set(transposedChords)],
      score,
      key: transposedKey,
    });
  }

  return suggestions.sort((a, b) => b.score - a.score);
}

export function getBestCapo(
  chords: string[],
  originalKey: string
): CapoSuggestion | null {
  const suggestions = calculateCapoSuggestions(chords, originalKey);
  // Geef niet capo 0 terug als dat al het origineel is
  const best = suggestions.find((s) => s.capo > 0);
  return best && best.score > suggestions[0].score * 0.5 ? best : null;
}
