// BGMEngine — Looping background music for PTSD.
// "Tech Support On Hold" — a cheerful-but-slightly-off corporate hold jingle.
// 16 beats at 120 BPM (8-second loop). Never resolves. You're still on hold.
// Uses the same AudioContext as the SFX engine.
// Respects audio on/off and volume settings.

import { getVolume } from './sound';

const BGM_KEY = 'ptsd_bgm';

const BPM = 120;
const BEAT = 60 / BPM; // 0.5s per beat

interface BgmNote {
  freq: number;
  time: number; // offset in seconds from loop start
  duration: number;
  gain: number;
  oscType: OscillatorType;
}

// 16-second loop (32 beats at 120 BPM). A-B-A'-B' structure.
// "Corporate Tech Support On Hold" — pleasant, bouncy, never resolves.

// Section A (beats 1-8): "Hey, you've reached... please hold."
const MELODY_A: BgmNote[] = [
  { freq: 523, time: 0, duration: 0.35, gain: 0.04, oscType: 'sine' },           // C4
  { freq: 659, time: BEAT * 0.75, duration: 0.3, gain: 0.04, oscType: 'sine' },  // E4 (syncopated)
  { freq: 784, time: BEAT * 1.5, duration: 0.4, gain: 0.04, oscType: 'sine' },   // G4
  { freq: 659, time: BEAT * 2.5, duration: 0.35, gain: 0.035, oscType: 'sine' }, // E4
  { freq: 698, time: BEAT * 4, duration: 0.35, gain: 0.04, oscType: 'sine' },    // F4
  { freq: 880, time: BEAT * 4.75, duration: 0.3, gain: 0.04, oscType: 'sine' },  // A4 (syncopated)
  { freq: 1047, time: BEAT * 5.5, duration: 0.4, gain: 0.04, oscType: 'sine' },  // C5
  { freq: 880, time: BEAT * 6.5, duration: 0.35, gain: 0.035, oscType: 'sine' }, // A4
];

// Section B (beats 9-16): "Your call is important to us..." (descending, then back up)
const MELODY_B: BgmNote[] = [
  { freq: 784, time: BEAT * 8, duration: 0.35, gain: 0.04, oscType: 'sine' },    // G4
  { freq: 698, time: BEAT * 8.75, duration: 0.3, gain: 0.04, oscType: 'sine' },  // F4 (syncopated)
  { freq: 659, time: BEAT * 9.5, duration: 0.35, gain: 0.04, oscType: 'sine' },  // E4
  { freq: 587, time: BEAT * 10.5, duration: 0.4, gain: 0.035, oscType: 'sine' }, // D4
  { freq: 523, time: BEAT * 12, duration: 0.35, gain: 0.04, oscType: 'sine' },   // C4
  { freq: 587, time: BEAT * 12.75, duration: 0.3, gain: 0.04, oscType: 'sine' }, // D4 (syncopated)
  { freq: 659, time: BEAT * 13.5, duration: 0.35, gain: 0.04, oscType: 'sine' }, // E4
  { freq: 698, time: BEAT * 14.5, duration: 0.4, gain: 0.035, oscType: 'sine' }, // F4 (building...)
];

// Section A' (beats 17-24): A variation — same notes, different rhythm (more bouncy)
const MELODY_A2: BgmNote[] = [
  { freq: 523, time: BEAT * 16, duration: 0.5, gain: 0.04, oscType: 'sine' },    // C4 (longer)
  { freq: 659, time: BEAT * 17, duration: 0.25, gain: 0.04, oscType: 'sine' },   // E4 (shorter)
  { freq: 784, time: BEAT * 17.5, duration: 0.4, gain: 0.04, oscType: 'sine' },  // G4 (syncopated)
  { freq: 659, time: BEAT * 18.5, duration: 0.3, gain: 0.035, oscType: 'sine' }, // E4
  { freq: 698, time: BEAT * 20, duration: 0.5, gain: 0.04, oscType: 'sine' },    // F4 (longer)
  { freq: 880, time: BEAT * 21, duration: 0.25, gain: 0.04, oscType: 'sine' },   // A4 (shorter)
  { freq: 1047, time: BEAT * 21.5, duration: 0.5, gain: 0.04, oscType: 'sine' }, // C5 (bigger)
  { freq: 1175, time: BEAT * 22.5, duration: 0.3, gain: 0.035, oscType: 'sine' },// D5 (new!)
];

// Section B' (beats 25-32): "And we're sorry for the wait." (hangs on F — unresolved)
const MELODY_B2: BgmNote[] = [
  { freq: 880, time: BEAT * 24, duration: 0.35, gain: 0.04, oscType: 'sine' },   // A4
  { freq: 784, time: BEAT * 24.75, duration: 0.3, gain: 0.04, oscType: 'sine' }, // G4 (syncopated)
  { freq: 698, time: BEAT * 25.5, duration: 0.35, gain: 0.04, oscType: 'sine' }, // F4
  { freq: 659, time: BEAT * 26.5, duration: 0.4, gain: 0.035, oscType: 'sine' }, // E4
  { freq: 587, time: BEAT * 28, duration: 0.35, gain: 0.04, oscType: 'sine' },   // D4
  { freq: 659, time: BEAT * 28.75, duration: 0.3, gain: 0.04, oscType: 'sine' }, // E4 (syncopated)
  { freq: 698, time: BEAT * 29.5, duration: 1.2, gain: 0.04, oscType: 'sine' },  // F4 (long hang, unresolved)
  { freq: 784, time: BEAT * 30.5, duration: 0.15, gain: 0.02, oscType: 'sine' }, // G4 (sigh up...)
  { freq: 698, time: BEAT * 31, duration: 0.8, gain: 0.035, oscType: 'sine' },   // F4 (back down, still unresolved)
];

const MELODY: BgmNote[] = [...MELODY_A, ...MELODY_B, ...MELODY_A2, ...MELODY_B2];

// "Ding" accents — like a phone notification. Short, bright, high.
const DINGS: BgmNote[] = [
  { freq: 1568, time: BEAT * 3.5, duration: 0.12, gain: 0.02, oscType: 'sine' },  // G5 ding (end of A)
  { freq: 1568, time: BEAT * 11.5, duration: 0.12, gain: 0.02, oscType: 'sine' }, // G5 ding (end of B)
  { freq: 1319, time: BEAT * 19.5, duration: 0.12, gain: 0.02, oscType: 'sine' }, // E5 ding (end of A')
  { freq: 1568, time: BEAT * 27.5, duration: 0.12, gain: 0.02, oscType: 'sine' }, // G5 ding (end of B')
];

// Soft percussion — "dun" on every other beat. Very quiet, adds bounce.
const PERC: BgmNote[] = Array.from({ length: 16 }, (_, i) => ({
  freq: 100 + (i % 4 === 0 ? 0 : 20), // Slight pitch variation
  time: BEAT * (i * 2),
  duration: 0.08,
  gain: 0.012,
  oscType: 'triangle' as OscillatorType,
}));

// Walking bass — gives it a "corporate elevator" feel.
const BASS: BgmNote[] = [
  // Section A
  { freq: 131, time: 0, duration: 1.8, gain: 0.025, oscType: 'triangle' },           // C3
  { freq: 175, time: BEAT * 2, duration: 1.8, gain: 0.02, oscType: 'triangle' },     // F2
  { freq: 131, time: BEAT * 4, duration: 1.8, gain: 0.025, oscType: 'triangle' },    // C3
  { freq: 196, time: BEAT * 6, duration: 1.8, gain: 0.02, oscType: 'triangle' },     // G2
  // Section B
  { freq: 196, time: BEAT * 8, duration: 1.8, gain: 0.02, oscType: 'triangle' },     // G2
  { freq: 175, time: BEAT * 10, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // F2
  { freq: 147, time: BEAT * 12, duration: 1.8, gain: 0.025, oscType: 'triangle' },   // D3 (new!)
  { freq: 175, time: BEAT * 14, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // F2
  // Section A'
  { freq: 131, time: BEAT * 16, duration: 1.8, gain: 0.025, oscType: 'triangle' },   // C3
  { freq: 175, time: BEAT * 18, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // F2
  { freq: 131, time: BEAT * 20, duration: 1.8, gain: 0.025, oscType: 'triangle' },   // C3
  { freq: 196, time: BEAT * 22, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // G2
  // Section B'
  { freq: 196, time: BEAT * 24, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // G2
  { freq: 175, time: BEAT * 26, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // F2
  { freq: 147, time: BEAT * 28, duration: 1.8, gain: 0.025, oscType: 'triangle' },   // D3
  { freq: 175, time: BEAT * 30, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // F2 (unresolved)
];

// Harmony layer — 3rd above the melody, very quiet. Adds width.
const HARMONY: BgmNote[] = [
  { freq: 784, time: BEAT * 0.5, duration: 0.3, gain: 0.01, oscType: 'sine' },  // G4 (3rd above C4)
  { freq: 988, time: BEAT * 4.5, duration: 0.3, gain: 0.01, oscType: 'sine' },  // B4 (3rd above F4)
  { freq: 1175, time: BEAT * 16.5, duration: 0.3, gain: 0.01, oscType: 'sine' },// D5 (3rd above C4')
  { freq: 1319, time: BEAT * 24.5, duration: 0.3, gain: 0.01, oscType: 'sine' },// E5 (3rd above A4')
];

const LOOP_DURATION = BEAT * 32; // 16 seconds

let bgmOn = loadBgmPref();
let intervalId: ReturnType<typeof setInterval> | null = null;
let ctx: AudioContext | null = null;
let nextLoopTime = 0;
let activeOscillators: OscillatorNode[] = [];

export function loadBgmPref(): boolean {
  try {
    const raw = localStorage.getItem(BGM_KEY);
    if (raw !== null) return raw === 'true';
  } catch {
    // ignore
  }
  return true;
}

export function saveBgmPref(on: boolean): void {
  try {
    localStorage.setItem(BGM_KEY, String(on));
  } catch {
    // ignore
  }
  bgmOn = on;
  if (on) {
    startBgm();
  } else {
    stopBgm();
  }
}

export function toggleBgm(): boolean {
  bgmOn = !bgmOn;
  saveBgmPref(bgmOn);
  if (bgmOn) {
    startBgm();
  } else {
    stopBgm();
  }
  return bgmOn;
}

function ensureContext(): AudioContext | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function killOscillators(): void {
  for (const osc of activeOscillators) {
    try {
      osc.stop();
    } catch {
      // already stopped
    }
  }
  activeOscillators = [];
}

function scheduleLoop(audioCtx: AudioContext, startTime: number): void {
  const notes = [...MELODY, ...DINGS, ...PERC, ...BASS, ...HARMONY];
  for (const note of notes) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = note.oscType;
    osc.frequency.setValueAtTime(note.freq, startTime + note.time);
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const t = startTime + note.time;
    const attack = 0.015;
    const release = Math.min(0.08, note.duration * 0.3);
    const vol = note.gain * getVolume();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + attack);
    gain.gain.setValueAtTime(vol, t + note.duration - release);
    gain.gain.linearRampToValueAtTime(0, t + note.duration);

    osc.start(t);
    osc.stop(t + note.duration + 0.01);
    activeOscillators.push(osc);
  }
}

export function startBgm(): void {
  if (!bgmOn || intervalId !== null) return;
  const audioCtx = ensureContext();
  if (!audioCtx) return;

  // Kill any leftover oscillators from a previous session
  killOscillators();

  nextLoopTime = audioCtx.currentTime + 0.1;
  scheduleLoop(audioCtx, nextLoopTime);

  intervalId = setInterval(() => {
    if (!audioCtx) return;
    if (nextLoopTime - audioCtx.currentTime < LOOP_DURATION * 0.6) {
      nextLoopTime += LOOP_DURATION;
      scheduleLoop(audioCtx, nextLoopTime);
    }
  }, 200);
}

export function stopBgm(): void {
  killOscillators();
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/** Call on first user interaction to start the BGM (browser autoplay policy). */
export function initBgm(): void {
  if (bgmOn && intervalId === null) {
    startBgm();
  }
}

// --- One-shot jingles (victory / defeat) ---

interface JingleNote {
  freq: number;
  time: number;
  duration: number;
  gain: number;
  oscType: OscillatorType;
}

// Victory: ascending C major arpeggio + bright "ta-da" hold.
// Feels like a slightly over-the-top "level complete" fanfare.
const VICTORY_NOTES: JingleNote[] = [
  { freq: 523, time: 0, duration: 0.15, gain: 0.05, oscType: 'sine' },      // C5
  { freq: 659, time: 0.12, duration: 0.15, gain: 0.05, oscType: 'sine' },   // E5
  { freq: 784, time: 0.24, duration: 0.15, gain: 0.05, oscType: 'sine' },   // G5
  { freq: 1047, time: 0.36, duration: 0.5, gain: 0.06, oscType: 'sine' },   // C6 (hold)
  { freq: 1319, time: 0.36, duration: 0.4, gain: 0.02, oscType: 'sine' },   // E6 (sparkle)
  { freq: 1568, time: 0.36, duration: 0.3, gain: 0.015, oscType: 'sine' },  // G6 (sparkle)
];

// Defeat: slow descending "womp womp". Minor key, sad trombone energy.
const DEFEAT_NOTES: JingleNote[] = [
  { freq: 330, time: 0, duration: 0.3, gain: 0.05, oscType: 'triangle' },   // E4
  { freq: 294, time: 0.3, duration: 0.3, gain: 0.05, oscType: 'triangle' }, // D4
  { freq: 262, time: 0.6, duration: 0.3, gain: 0.05, oscType: 'triangle' }, // C4
  { freq: 233, time: 0.9, duration: 0.6, gain: 0.06, oscType: 'triangle' }, // Bb3 (sad hold)
  { freq: 117, time: 0.9, duration: 0.5, gain: 0.03, oscType: 'sine' },     // Bb2 (bass womp)
];

function playJingle(notes: JingleNote[]): void {
  const audioCtx = ensureContext();
  if (!audioCtx) return;

  const startTime = audioCtx.currentTime + 0.05;
  for (const note of notes) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = note.oscType;
    osc.frequency.setValueAtTime(note.freq, startTime + note.time);
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const t = startTime + note.time;
    const attack = 0.01;
    const release = Math.min(0.1, note.duration * 0.4);
    const vol = note.gain * getVolume();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + attack);
    gain.gain.setValueAtTime(vol, t + note.duration - release);
    gain.gain.linearRampToValueAtTime(0, t + note.duration);

    osc.start(t);
    osc.stop(t + note.duration + 0.01);
  }
}

/** Play the victory fanfare. Call on Results screen when success. */
export function playVictoryJingle(): void {
  playJingle(VICTORY_NOTES);
}

/** Play the defeat "womp womp". Call on Results screen when failure. */
export function playDefeatJingle(): void {
  playJingle(DEFEAT_NOTES);
}
