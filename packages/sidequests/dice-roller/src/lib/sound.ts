import type { DieThrow } from "./dice";

export type CueKind = "rattle" | "land" | "bounce" | "settle";

export interface SoundCue {
  /** Milliseconds after the roll starts. */
  at: number;
  kind: CueKind;
}

/** Points in the toss animation (see Die.tsx) where the die hits the table. */
const LAND_AT = 0.58;
const BOUNCE_AT = 0.86;
const SETTLE_AT = 0.93;

/** Clicks per die as it leaves the hand, and the time between them. */
const RATTLE_CLICKS = 3;
const RATTLE_GAP_MS = 45;

/**
 * When each die makes a noise, timed to its throw: a short rattle as it
 * leaves the hand, a clack when it lands, a softer one on the bounce and a
 * tick as it settles. A die that doesn't animate just clacks down, a beat after the last.
 */
export function soundCues(throws: readonly DieThrow[], random: () => number = Math.random) {
  const cues: SoundCue[] = [];
  throws.forEach((thrown, index) => {
    if (thrown.duration === 0) {
      cues.push({ at: index * 35, kind: "land" });
      return;
    }
    const { delay, duration } = thrown;
    for (let click = 0; click < RATTLE_CLICKS; click++) {
      cues.push({ at: Math.round(delay + click * RATTLE_GAP_MS + random() * 20), kind: "rattle" });
    }
    cues.push({ at: Math.round(delay + duration * LAND_AT), kind: "land" });
    cues.push({ at: Math.round(delay + duration * BOUNCE_AT), kind: "bounce" });
    cues.push({ at: Math.round(delay + duration * SETTLE_AT), kind: "settle" });
  });
  return cues.sort((a, b) => a.at - b.at);
}

/** How each kind of hit sounds: a filtered noise click, plus a low thump for the table. */
const VOICES: Record<
  CueKind,
  { pitch: [number, number]; peak: number; decay: number; thump: number }
> = {
  rattle: { pitch: [3000, 4500], peak: 0.12, decay: 0.03, thump: 0 },
  land: { pitch: [1600, 2400], peak: 0.35, decay: 0.07, thump: 0.25 },
  bounce: { pitch: [2000, 2800], peak: 0.18, decay: 0.05, thump: 0.1 },
  settle: { pitch: [3000, 3600], peak: 0.07, decay: 0.025, thump: 0 },
};

type AudioContextConstructor = typeof AudioContext;

function getAudioContextClass(): AudioContextConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext
  );
}

export interface DiceSound {
  /** Plays the cues. Call from a click, since browsers block sound that isn't. */
  play: (cues: readonly SoundCue[]) => void;
}

/**
 * Dice noises made with Web Audio, so there is no sound file to download.
 * Silently does nothing where audio is unavailable or blocked.
 */
export function createDiceSound(): DiceSound {
  let context: AudioContext | null = null;
  let output: AudioNode | null = null;
  let noise: AudioBuffer | null = null;

  function ensureContext(): AudioContext | null {
    if (context) return context;
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return null;
    try {
      context = new AudioContextClass();
    } catch {
      return null;
    }
    // Five dice landing together would clip; a compressor keeps them loud but clean.
    const compressor = context.createDynamicsCompressor();
    compressor.connect(context.destination);
    output = compressor;
    // One short burst of white noise, reused for every click.
    noise = context.createBuffer(1, Math.round(context.sampleRate * 0.15), context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;
    return context;
  }

  function hit(audio: AudioContext, at: number, kind: CueKind) {
    const voice = VOICES[kind];
    const [low, high] = voice.pitch;

    const source = audio.createBufferSource();
    source.buffer = noise;
    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = low + Math.random() * (high - low);
    filter.Q.value = 5;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(voice.peak, at + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + voice.decay);
    source.connect(filter).connect(gain).connect(output!);
    source.start(at);
    source.stop(at + voice.decay + 0.02);

    if (voice.thump === 0) return;
    const thump = audio.createOscillator();
    const thumpGain = audio.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(160, at);
    thump.frequency.exponentialRampToValueAtTime(70, at + 0.09);
    thumpGain.gain.setValueAtTime(0.0001, at);
    thumpGain.gain.exponentialRampToValueAtTime(voice.thump, at + 0.004);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.1);
    thump.connect(thumpGain).connect(output!);
    thump.start(at);
    thump.stop(at + 0.12);
  }

  return {
    play(cues) {
      const audio = ensureContext();
      if (!audio) return;
      if (audio.state === "suspended") void audio.resume().catch(() => {});
      // A few milliseconds of headroom so the first click isn't scheduled in the past.
      const start = audio.currentTime + 0.01;
      for (const cue of cues) hit(audio, start + cue.at / 1000, cue.kind);
    },
  };
}
