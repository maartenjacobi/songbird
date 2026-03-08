"use client";

interface YouTubeEmbedProps {
  videoId: string | undefined;
}

export default function YouTubeEmbed({ videoId }: YouTubeEmbedProps) {
  if (!videoId) {
    return (
      <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800/50">
        <div className="text-center text-zinc-600">
          <svg
            className="w-10 h-10 mx-auto mb-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <p className="text-xs">Video verschijnt hier</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden border border-zinc-800/50">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
