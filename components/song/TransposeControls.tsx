"use client";

interface TransposeControlsProps {
  currentKey: string;
  transpose: number;
  onTranspose: (n: number) => void;
}

export default function TransposeControls({
  currentKey,
  transpose,
  onTranspose,
}: TransposeControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 uppercase tracking-wide">Key</span>
      <span className="text-sm font-bold text-amber-400 min-w-[2ch] text-center">
        {currentKey}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onTranspose(transpose - 1)}
          className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
          title="Transpose omlaag"
        >
          -
        </button>
        <button
          onClick={() => onTranspose(transpose + 1)}
          className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
          title="Transpose omhoog"
        >
          +
        </button>
        {transpose !== 0 && (
          <button
            onClick={() => onTranspose(0)}
            className="ml-1 px-1.5 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 text-xs transition-colors"
            title="Reset transpositie"
          >
            {transpose > 0 ? `+${transpose}` : transpose}
          </button>
        )}
      </div>
    </div>
  );
}
