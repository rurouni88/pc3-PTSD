// SoundEngine — Web Audio API sound effects for PTSD.
// Each sound is a sequence of frequency notes with timing, gain, and decay.
// Lazy-initialised on first user interaction (browser policy).
// Toggle on/off via SettingsModal; volume persists in localStorage.

const AUDIO_KEY = 'ptsd_audio';
const VOLUME_KEY = 'ptsd_volume';

export type SoundType =
  | 'click'
  | 'success'
  | 'failure'
  | 'notification'
  | 'interrupt'
  | 'charger'
  | 'battery-low'
  | 'achievement'
  | 'ticker';

interface SoundDef {
  oscType?: OscillatorType;
  notes: { freq: number; time: number; ramp?: boolean }[];
  gain: number;
  gainRampEnd: number;
  gainRampDuration: number;
}

const SOUND_DEFS: Record<SoundType, SoundDef> = {
  // --- UI feedback ---
  click: {
    notes: [{ freq: 800, time: 0 }],
    gain: 0.08,
    gainRampEnd: 0.005,
    gainRampDuration: 0.04,
  },
  success: {
    oscType: 'sine',
    notes: [
      { freq: 523, time: 0 },
      { freq: 659, time: 0.08 },
      { freq: 784, time: 0.16 },
    ],
    gain: 0.12,
    gainRampEnd: 0.005,
    gainRampDuration: 0.25,
  },
  failure: {
    oscType: 'sawtooth',
    notes: [
      { freq: 200, time: 0 },
      { freq: 120, time: 0.2, ramp: true },
    ],
    gain: 0.08,
    gainRampEnd: 0.005,
    gainRampDuration: 0.2,
  },

  // --- Phone/tech support themed ---
  notification: {
    oscType: 'sine',
    notes: [
      { freq: 880, time: 0 },
      { freq: 660, time: 0.1 },
    ],
    gain: 0.1,
    gainRampEnd: 0.005,
    gainRampDuration: 0.2,
  },
  interrupt: {
    oscType: 'square',
    notes: [
      { freq: 440, time: 0 },
      { freq: 440, time: 0.1 },
      { freq: 440, time: 0.2 },
    ],
    gain: 0.06,
    gainRampEnd: 0.005,
    gainRampDuration: 0.3,
  },
  charger: {
    oscType: 'sine',
    notes: [
      { freq: 300, time: 0 },
      { freq: 600, time: 0.2, ramp: true },
    ],
    gain: 0.1,
    gainRampEnd: 0.005,
    gainRampDuration: 0.3,
  },
  'battery-low': {
    oscType: 'square',
    notes: [
      { freq: 400, time: 0 },
      { freq: 300, time: 0.15 },
      { freq: 200, time: 0.3 },
    ],
    gain: 0.1,
    gainRampEnd: 0.005,
    gainRampDuration: 0.4,
  },
  achievement: {
    oscType: 'sine',
    notes: [
      { freq: 523, time: 0 },
      { freq: 659, time: 0.1 },
      { freq: 784, time: 0.2 },
      { freq: 1047, time: 0.3 },
    ],
    gain: 0.12,
    gainRampEnd: 0.005,
    gainRampDuration: 0.4,
  },
  ticker: {
    oscType: 'square',
    notes: [
      { freq: 1200, time: 0 },
    ],
    gain: 0.06,
    gainRampEnd: 0.001,
    gainRampDuration: 0.08,
  },
};

let audioCtx: AudioContext | null = null;
let audioOn = loadAudioPref();
let volume = loadVolume();

export function loadAudioPref(): boolean {
  try {
    const raw = localStorage.getItem(AUDIO_KEY);
    if (raw !== null) return raw === 'true';
  } catch {
    // ignore
  }
  return true;
}

export function saveAudioPref(on: boolean): void {
  try {
    localStorage.setItem(AUDIO_KEY, String(on));
  } catch {
    // ignore
  }
  audioOn = on;
}

export function loadVolume(): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw !== null) {
      const v = parseFloat(raw);
      if (!isNaN(v) && v >= 0 && v <= 1) return v;
    }
  } catch {
    // ignore
  }
  return 0.5;
}

export function saveVolume(v: number): void {
  try {
    localStorage.setItem(VOLUME_KEY, String(v));
  } catch {
    // ignore
  }
  volume = v;
}

export function getVolume(): number {
  return volume;
}

export function toggleAudio(): boolean {
  audioOn = !audioOn;
  saveAudioPref(audioOn);
  return audioOn;
}

function initAudio(): void {
  if (audioCtx) return;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  audioCtx = new Ctx();
}

export function playSound(type: SoundType): void {
  if (!audioOn) return;
  const def = SOUND_DEFS[type];
  if (!def) return;
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const ctx = audioCtx;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  if (def.oscType) osc.type = def.oscType;
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  for (const { freq, time, ramp } of def.notes) {
    if (ramp) {
      osc.frequency.linearRampToValueAtTime(freq, now + time);
    } else {
      osc.frequency.setValueAtTime(freq, now + time);
    }
  }

  gain.gain.setValueAtTime(def.gain * volume, now);
  gain.gain.exponentialRampToValueAtTime(def.gainRampEnd, now + def.gainRampDuration);

  const lastNote = def.notes[def.notes.length - 1];
  osc.start(now);
  osc.stop(now + Math.max(lastNote.time, def.gainRampDuration));
}
