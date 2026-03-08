"use client";

import { useTuner } from "@/hooks/useTuner";

export default function Tuner() {
  const { isActive, reading, error, toggle } = useTuner();

  const centsOffset = reading?.cents || 0;
  const meterWidth = Math.min(Math.abs(centsOffset), 50);
  const isSharp = centsOffset > 0;
  const isInTune = reading?.isInTune || false;

  const noteColor = isInTune
    ? "text-green-400"
    : Math.abs(centsOffset) > 10
      ? "text-red-400"
      : "text-amber-400";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs text-zinc-500 uppercase tracking-wide font-medium">
          Tuner
        </h3>
        <button
          onClick={toggle}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            isActive
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
          }`}
        >
          {isActive ? "Stop" : "Start"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {isActive && (
        <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
          {/* Noot display */}
          <div className="text-center mb-3">
            <span className={`text-3xl font-bold ${noteColor} transition-colors`}>
              {reading?.note || "-"}
            </span>
            <span className="text-zinc-500 text-lg ml-1">
              {reading?.octave ?? ""}
            </span>
          </div>

          {/* Cents meter */}
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-600" />
            {reading && (
              <div
                className={`absolute top-0 bottom-0 rounded-full transition-all duration-75 ${
                  isInTune
                    ? "bg-green-500"
                    : Math.abs(centsOffset) > 10
                      ? "bg-red-500"
                      : "bg-amber-500"
                }`}
                style={{
                  left: isSharp ? "50%" : `${50 - meterWidth}%`,
                  width: `${meterWidth}%`,
                }}
              />
            )}
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-1 text-[10px] text-zinc-600">
            <span>Flat</span>
            <span>
              {reading ? `${centsOffset > 0 ? "+" : ""}${centsOffset}c` : ""}
            </span>
            <span>Sharp</span>
          </div>

          {/* Frequentie */}
          {reading && (
            <p className="text-center text-[10px] text-zinc-600 mt-1">
              {reading.frequency.toFixed(1)} Hz
            </p>
          )}
        </div>
      )}
    </div>
  );
}
