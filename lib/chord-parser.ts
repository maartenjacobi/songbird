import ChordSheetJS from "chordsheetjs";

export interface ParsedLine {
  type: "chordlyric" | "section" | "empty" | "comment";
  pairs?: { chord: string; text: string }[];
  label?: string;
  text?: string;
}

export function parseChordPro(input: string): ParsedLine[] {
  const parser = new ChordSheetJS.ChordProParser();
  const song = parser.parse(input);
  const lines: ParsedLine[] = [];

  const META_TAGS = new Set(["title", "artist", "key", "tempo", "time", "capo", "subtitle"]);

  for (const line of song.lines) {
    if (line.items.length === 0) {
      // Voorkom opeenvolgende lege regels
      if (lines.length > 0 && lines[lines.length - 1].type !== "empty") {
        lines.push({ type: "empty" });
      }
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstItem = line.items[0] as any;

    // Skip meta-tags (title, artist, key etc.)
    if (firstItem._name && META_TAGS.has(firstItem._name)) {
      continue;
    }

    // Check voor sectie-headers (comment directive)
    if (firstItem._name === "comment" && firstItem._value) {
      lines.push({
        type: "section",
        label: String(firstItem._value),
      });
      continue;
    }

    const pairs: { chord: string; text: string }[] = [];

    for (const item of line.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const it = item as any;
      if ("chords" in it || "lyrics" in it) {
        const chordStr = it.chords ? String(it.chords) : "";
        const lyrics = it.lyrics ? String(it.lyrics) : "";
        pairs.push({ chord: chordStr, text: lyrics });
      }
    }

    if (pairs.length > 0) {
      lines.push({ type: "chordlyric", pairs });
    } else if (lines.length > 0 && lines[lines.length - 1].type !== "empty") {
      lines.push({ type: "empty" });
    }
  }

  // Strip leading/trailing empties
  while (lines.length > 0 && lines[0].type === "empty") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].type === "empty") lines.pop();

  return lines;
}

export function getMetaFromChordPro(
  input: string
): Record<string, string> {
  const meta: Record<string, string> = {};
  const regex = /\{(\w+):\s*([^}]+)\}/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    meta[match[1].toLowerCase()] = match[2].trim();
  }

  return meta;
}

export function textToChordPro(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1]?.trim() || "";

    const isChordLine = /^[A-G][#b]?[m7maj9sus2add4dim6aug/]*(\s+[A-G][#b]?[m7maj9sus2add4dim6aug/]*)*\s*$/.test(
      line
    );

    if (isChordLine && nextLine) {
      const chords = line.match(
        /[A-G][#b]?[m7maj9sus2add4dim6aug/]*/g
      );
      if (chords) {
        const positions: { pos: number; chord: string }[] = [];
        let searchFrom = 0;
        for (const chord of chords) {
          const pos = line.indexOf(chord, searchFrom);
          positions.push({ pos, chord });
          searchFrom = pos + chord.length;
        }

        let combined = "";
        let lastPos = 0;
        for (const { pos, chord } of positions) {
          if (pos <= nextLine.length) {
            combined += nextLine.slice(lastPos, pos) + `[${chord}]`;
            lastPos = pos;
          } else {
            combined += nextLine.slice(lastPos) + `[${chord}]`;
            lastPos = nextLine.length;
          }
        }
        combined += nextLine.slice(lastPos);
        result.push(combined);
        i++;
      }
    } else if (!isChordLine) {
      result.push(line);
    }
  }

  return result.join("\n");
}
