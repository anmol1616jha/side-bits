type AudioContextConstructor = typeof AudioContext;

function getAudioContextClass(): AudioContextConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext
  );
}

export interface Chime {
  /** Call from a click so browsers allow sound later, when a timer ends. */
  unlock: () => void;
  /** The gentle chime for the end of the test. */
  play: () => void;
  /** An alarm clock going off, for the end of research. */
  alarm: () => void;
}

/** Alarm: bursts of four quick beeps, one burst a second, for 5 seconds. */
const ALARM_HZ = 1320;
const ALARM_BURSTS = 5;
const ALARM_BEEPS_PER_BURST = 4;
const ALARM_BEEP_S = 0.08;
const ALARM_BEEP_GAP_S = 0.06;
const ALARM_BURST_S = 1;

/** A rising E-A-C♯ (an A major chord), in Hz. */
const NOTES = [659.25, 880, 1108.73];
/** Time between notes, and how long each one rings: about 3 seconds in all. */
const NOTE_GAP_S = 0.3;
const NOTE_RING_S = 2.4;

/**
 * A three-note chime of about 3 seconds, made with Web Audio so there is no
 * sound file to download. Silently does nothing where audio is unavailable or blocked.
 */
export function createChime(): Chime {
  let context: AudioContext | null = null;

  function ensureContext(): AudioContext | null {
    if (context) return context;
    const AudioContextClass = getAudioContextClass();
    if (!AudioContextClass) return null;
    try {
      context = new AudioContextClass();
    } catch {
      return null;
    }
    return context;
  }

  return {
    unlock() {
      const audio = ensureContext();
      if (audio?.state === "suspended") void audio.resume().catch(() => {});
    },
    play() {
      const audio = ensureContext();
      if (!audio) return;
      if (audio.state === "suspended") void audio.resume().catch(() => {});
      const start = audio.currentTime;
      NOTES.forEach((frequency, index) => {
        const at = start + index * NOTE_GAP_S;
        // Each note plus a quieter overtone an octave up, which fades sooner, so it rings like a bell.
        for (const [multiple, peak, ring] of [
          [1, 0.18, NOTE_RING_S],
          [2, 0.04, NOTE_RING_S / 2],
        ] as const) {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency * multiple;
          gain.gain.setValueAtTime(0.0001, at);
          gain.gain.exponentialRampToValueAtTime(peak, at + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, at + ring);
          oscillator.connect(gain).connect(audio.destination);
          oscillator.start(at);
          oscillator.stop(at + ring + 0.05);
        }
      });
    },
    alarm() {
      const audio = ensureContext();
      if (!audio) return;
      if (audio.state === "suspended") void audio.resume().catch(() => {});
      const start = audio.currentTime;
      // One square-wave tone for the whole alarm, switched on and off by its gain.
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = ALARM_HZ;
      gain.gain.setValueAtTime(0, start);
      for (let burst = 0; burst < ALARM_BURSTS; burst++) {
        for (let beep = 0; beep < ALARM_BEEPS_PER_BURST; beep++) {
          const at = start + burst * ALARM_BURST_S + beep * (ALARM_BEEP_S + ALARM_BEEP_GAP_S);
          // 5 ms ramps on each edge so the beeps don't click.
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(0.06, at + 0.005);
          gain.gain.setValueAtTime(0.06, at + ALARM_BEEP_S - 0.005);
          gain.gain.linearRampToValueAtTime(0, at + ALARM_BEEP_S);
        }
      }
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(start);
      oscillator.stop(start + ALARM_BURSTS * ALARM_BURST_S);
    },
  };
}
