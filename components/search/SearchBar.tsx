"use client";

import { useState, useCallback, type FormEvent } from "react";

interface SearchBarProps {
  onSearch: (artist: string, title: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;

      // Probeer "artist - title" formaat
      const parts = trimmed.split(/\s*[-–]\s*/);
      if (parts.length >= 2) {
        onSearch(parts[0].trim(), parts.slice(1).join(" - ").trim());
      } else {
        // Gebruik alles als titel, artist leeg
        onSearch("", trimmed);
      }
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1 max-w-lg">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artiest - Titel"
          className="w-full pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-colors"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          "Zoek"
        )}
      </button>
    </form>
  );
}
