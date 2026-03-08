import { Note } from "tonal";
import type { TunerReading } from "@/types/music";

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function autoCorrelate(
  buffer: Float32Array,
  sampleRate: number
): number {
  // Check of er genoeg signaal is
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 0.01) return -1; // Te stil

  // Autocorrelatie
  const size = buffer.length;
  const correlations = new Float32Array(size);

  for (let lag = 0; lag < size; lag++) {
    let sum = 0;
    for (let i = 0; i < size - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlations[lag] = sum;
  }

  // Zoek eerste dip en dan eerste piek na de dip
  let foundDip = false;
  let bestLag = -1;
  let bestCorr = 0;

  for (let lag = 1; lag < size; lag++) {
    if (!foundDip && correlations[lag] < correlations[lag - 1]) {
      foundDip = true;
    }
    if (foundDip && correlations[lag] > bestCorr) {
      bestCorr = correlations[lag];
      bestLag = lag;
    }
    if (foundDip && correlations[lag] < correlations[lag - 1] && bestLag > 0) {
      break;
    }
  }

  if (bestLag === -1) return -1;
  return sampleRate / bestLag;
}

function frequencyToNote(
  frequency: number
): { note: string; octave: number; cents: number } {
  // A4 = 440 Hz
  const noteNum = 12 * (Math.log2(frequency / 440)) + 69;
  const roundedNote = Math.round(noteNum);
  const cents = Math.round((noteNum - roundedNote) * 100);

  const noteIndex = ((roundedNote % 12) + 12) % 12;
  const octave = Math.floor(roundedNote / 12) - 1;

  return {
    note: NOTE_NAMES[noteIndex],
    octave,
    cents,
  };
}

export class PitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isRunning = false;
  private animationFrame: number | null = null;

  async start(
    onReading: (reading: TunerReading) => void
  ): Promise<void> {
    if (this.isRunning) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 4096;

      this.source = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );
      this.source.connect(this.analyser);

      this.isRunning = true;
      this.detectPitch(onReading);
    } catch (err) {
      console.error("Microfoon toegang geweigerd:", err);
      throw err;
    }
  }

  private detectPitch(
    onReading: (reading: TunerReading) => void
  ): void {
    if (!this.isRunning || !this.analyser || !this.audioContext) return;

    const buffer = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, this.audioContext.sampleRate);

    if (frequency > 0) {
      const { note, octave, cents } = frequencyToNote(frequency);
      onReading({
        frequency,
        note,
        octave,
        cents,
        isInTune: Math.abs(cents) < 5,
      });
    }

    this.animationFrame = requestAnimationFrame(() =>
      this.detectPitch(onReading)
    );
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.source) {
      this.source.disconnect();
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.source = null;
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }
}
