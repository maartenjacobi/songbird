"use client";

import SongView from "@/components/song/SongView";

export default function LeftPanel() {
  return (
    <div className="flex-1 min-w-0 h-full border-r border-zinc-800/50">
      <SongView />
    </div>
  );
}
