import { Key, Scale, Chord, Note, Interval } from "tonal";
import type { ScaleType, ScaleInfo, ChordInfo, FretNote } from "@/types/music";
import { STANDARD_TUNING } from "@/types/music";

const SCALE_MAP: Record<ScaleType, string> = {
  major: "major",
  minor: "minor",
  "pentatonic major": "major pentatonic",
  "pentatonic minor": "minor pentatonic",
  blues: "blues",
  dorian: "dorian",
  mixolydian: "mixolydian",
};

export function getScale(root: string, type: ScaleType): ScaleInfo {
  const tonalName = SCALE_MAP[type];
  const scale = Scale.get(`${root} ${tonalName}`);
  return {
    name: `${root} ${type}`,
    type,
    notes: scale.notes,
    intervals: scale.intervals,
  };
}

export function getChordInfo(chordName: string): ChordInfo | null {
  const chord = Chord.get(chordName);
  if (chord.empty) return null;
  return {
    name: chord.name,
    root: chord.tonic || "",
    quality: chord.quality,
    notes: chord.notes,
    intervals: chord.intervals,
  };
}

export function detectKeyFromChords(chords: string[]): string | null {
  if (chords.length === 0) return null;

  const uniqueChords = [...new Set(chords)];
  const candidates: { key: string; score: number }[] = [];

  for (const note of Note.names()) {
    for (const mode of ["major", "minor"]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const keyInfo: any = mode === "major" ? Key.majorKey(note) : Key.minorKey(note);
      const keyChords: string[] =
        mode === "major"
          ? (keyInfo.chords || []).map((c: string) => Chord.get(c).tonic).filter(Boolean)
          : ((keyInfo.natural?.chords || []) as string[])
              .map((c: string) => Chord.get(c).tonic)
              .filter(Boolean);

      let score = 0;
      for (const chord of uniqueChords) {
        const chordRoot = Chord.get(chord).tonic;
        if (chordRoot && keyChords.includes(chordRoot)) {
          score++;
        }
      }

      // Bonus als eerste akkoord = tonica
      const firstChordRoot = Chord.get(chords[0]).tonic;
      if (firstChordRoot === note) score += 2;

      candidates.push({
        key: `${note}${mode === "minor" ? "m" : ""}`,
        score,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.key || null;
}

export function transposeChord(chord: string, semitones: number): string {
  const parsed = Chord.get(chord);
  if (parsed.empty || !parsed.tonic) return chord;

  const newRoot = Note.transpose(parsed.tonic, Interval.fromSemitones(semitones));
  const simplifiedRoot = Note.simplify(newRoot);

  // Behoud suffix (m, 7, maj7, etc.)
  const suffix = chord.slice(parsed.tonic.length);
  return simplifiedRoot + suffix;
}

export function getNoteAtFret(
  openNote: string,
  fret: number
): string {
  const transposed = Note.transpose(openNote, Interval.fromSemitones(fret));
  return Note.simplify(transposed);
}

export function getFretboardNotes(
  scale: ScaleInfo,
  tuning: string[] = STANDARD_TUNING,
  numFrets: number = 12
): FretNote[] {
  const notes: FretNote[] = [];
  const scaleNotes = scale.notes.map((n) => Note.chroma(n));
  const rootChroma = Note.chroma(scale.notes[0]);

  tuning.forEach((openNote, stringIndex) => {
    for (let fret = 0; fret <= numFrets; fret++) {
      const note = getNoteAtFret(openNote, fret);
      const chroma = Note.chroma(note);

      if (chroma !== null && scaleNotes.includes(chroma)) {
        const degree = scaleNotes.indexOf(chroma) + 1;
        notes.push({
          string: stringIndex,
          fret,
          note: Note.pitchClass(note),
          degree,
          isRoot: chroma === rootChroma,
        });
      }
    }
  });

  return notes;
}

export function getScaleTypes(): { value: ScaleType; label: string }[] {
  return [
    { value: "pentatonic minor", label: "Pent. Min" },
    { value: "pentatonic major", label: "Pent. Maj" },
    { value: "blues", label: "Blues" },
    { value: "major", label: "Majeur" },
    { value: "minor", label: "Mineur" },
    { value: "dorian", label: "Dor." },
    { value: "mixolydian", label: "Mixo." },
  ];
}
