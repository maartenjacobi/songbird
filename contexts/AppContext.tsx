"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Setlist } from "@/types/setlist";
import * as storage from "@/lib/storage";

interface AppContextType {
  setlists: Setlist[];
  addSetlist: (name: string) => Setlist;
  updateSetlist: (setlist: Setlist) => void;
  removeSetlist: (id: string) => void;
  addSongToSetlist: (setlistId: string, songId: string) => void;
  removeSongFromSetlist: (setlistId: string, songId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [setlists, setSetlists] = useState<Setlist[]>([]);

  useEffect(() => {
    setSetlists(storage.getSetlists());
  }, []);

  const addSetlist = useCallback((name: string): Setlist => {
    const setlist: Setlist = {
      id: crypto.randomUUID(),
      name,
      songIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveSetlist(setlist);
    setSetlists((prev) => [...prev, setlist]);
    return setlist;
  }, []);

  const updateSetlist = useCallback((setlist: Setlist) => {
    setlist.updatedAt = new Date().toISOString();
    storage.saveSetlist(setlist);
    setSetlists((prev) =>
      prev.map((s) => (s.id === setlist.id ? setlist : s))
    );
  }, []);

  const removeSetlist = useCallback((id: string) => {
    storage.deleteSetlist(id);
    setSetlists((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addSongToSetlist = useCallback(
    (setlistId: string, songId: string) => {
      setSetlists((prev) =>
        prev.map((s) => {
          if (s.id === setlistId && !s.songIds.includes(songId)) {
            const updated = {
              ...s,
              songIds: [...s.songIds, songId],
              updatedAt: new Date().toISOString(),
            };
            storage.saveSetlist(updated);
            return updated;
          }
          return s;
        })
      );
    },
    []
  );

  const removeSongFromSetlist = useCallback(
    (setlistId: string, songId: string) => {
      setSetlists((prev) =>
        prev.map((s) => {
          if (s.id === setlistId) {
            const updated = {
              ...s,
              songIds: s.songIds.filter((id) => id !== songId),
              updatedAt: new Date().toISOString(),
            };
            storage.saveSetlist(updated);
            return updated;
          }
          return s;
        })
      );
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        setlists,
        addSetlist,
        updateSetlist,
        removeSetlist,
        addSongToSetlist,
        removeSongFromSetlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext buiten AppProvider");
  return ctx;
}
