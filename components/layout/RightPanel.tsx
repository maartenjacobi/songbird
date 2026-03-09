"use client";

import YouTubeEmbed from "@/components/video/YouTubeEmbed";
import Fretboard from "@/components/fretboard/Fretboard";
import Tuner from "@/components/tuner/Tuner";
import { useSongContext } from "@/contexts/SongContext";

export default function RightPanel() {
  const { song } = useSongContext();

  return (
    <div className="w-[480px] shrink-0 h-full overflow-y-auto p-4 space-y-3">
      {/* YouTube */}
      <YouTubeEmbed videoId={song?.youtubeId} />

      {/* Fretboard */}
      <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/50">
        <Fretboard />
      </div>

      {/* Tuner */}
      <div className="bg-zinc-900/30 rounded-lg p-3 border border-zinc-800/50">
        <Tuner />
      </div>
    </div>
  );
}
