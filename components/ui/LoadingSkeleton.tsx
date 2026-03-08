"use client";

export function ChordSheetSkeleton() {
  return (
    <div className="px-6 py-4 space-y-4 animate-pulse">
      {/* Song header skeleton */}
      <div className="flex items-center gap-4 pb-4 border-b border-zinc-800/50">
        <div className="w-14 h-14 rounded-md bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-zinc-800 rounded" />
          <div className="h-4 w-32 bg-zinc-800/60 rounded" />
        </div>
      </div>

      {/* Section header */}
      <div className="h-3 w-16 bg-zinc-800/40 rounded mt-6" />

      {/* Chord + lyric lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="space-y-1">
          <div className="flex gap-12">
            <div className="h-3 w-6 bg-amber-500/10 rounded" />
            <div className="h-3 w-8 bg-amber-500/10 rounded" />
            <div className="h-3 w-6 bg-amber-500/10 rounded" />
          </div>
          <div
            className="h-4 bg-zinc-800/40 rounded"
            style={{ width: `${50 + Math.random() * 40}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function FretboardSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-5 w-14 bg-zinc-800/50 rounded" />
        ))}
      </div>
      <div className="h-[120px] bg-zinc-800/30 rounded" />
    </div>
  );
}
