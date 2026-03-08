"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PitchDetector } from "@/lib/pitch-detection";
import type { TunerReading } from "@/types/music";

export function useTuner() {
  const [isActive, setIsActive] = useState(false);
  const [reading, setReading] = useState<TunerReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<PitchDetector | null>(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      const detector = new PitchDetector();
      detectorRef.current = detector;
      await detector.start(setReading);
      setIsActive(true);
    } catch {
      setError("Microfoon niet beschikbaar");
    }
  }, []);

  const stop = useCallback(() => {
    detectorRef.current?.stop();
    detectorRef.current = null;
    setIsActive(false);
    setReading(null);
  }, []);

  const toggle = useCallback(() => {
    if (isActive) {
      stop();
    } else {
      start();
    }
  }, [isActive, start, stop]);

  // Cleanup bij unmount
  useEffect(() => {
    return () => {
      detectorRef.current?.stop();
    };
  }, []);

  return { isActive, reading, error, toggle, start, stop };
}
