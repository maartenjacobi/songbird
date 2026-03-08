"use client";

import { useSongContext } from "@/contexts/SongContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function KeyboardHandler() {
  const { transpose, setTranspose } = useSongContext();

  useKeyboardShortcuts({
    onTransposeUp: () => setTranspose(transpose + 1),
    onTransposeDown: () => setTranspose(transpose - 1),
  });

  return null;
}
