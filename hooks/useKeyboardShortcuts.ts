"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onTransposeUp?: () => void;
  onTransposeDown?: () => void;
  onToggleFavorite?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Niet triggeren als focus in een input zit
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowUp" && e.shiftKey) {
        e.preventDefault();
        handlers.onTransposeUp?.();
      } else if (e.key === "ArrowDown" && e.shiftKey) {
        e.preventDefault();
        handlers.onTransposeDown?.();
      } else if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        // Laat default browser search toe
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
