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
  play: () => void;
}

/**
 * A short two-note chime made with Web Audio, so there is no sound file to
 * download. Silently does nothing where audio is unavailable or blocked.
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
      [659.25, 880].forEach((frequency, index) => {
        const at = start + index * 0.18;
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.25, at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.6);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.65);
      });
    },
  };
}
