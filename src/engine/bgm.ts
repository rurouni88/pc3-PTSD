// BGMEngine — Looping background music for PTSD.
// Three themes, one per difficulty:
//   Dad     — "Corporate Hold" (120 BPM, C major, syncopated, percussion)
//   Mum     — "Elevator Smooth" (100 BPM, F major, legato, no percussion)
//   Grandma — "Music Box" (90 BPM, high register, bell-like, slight detune)
//
// Uses the same AudioContext as the SFX engine.
// Respects audio on/off and volume settings.

import { getVolume } from './sound';

const BGM_KEY = 'ptsd_bgm';

export type BgmTheme = 'dad' | 'mum' | 'grandma';

interface BgmNote {
  freq: number;
  time: number;
  duration: number;
  gain: number;
  oscType: OscillatorType;
}

interface BgmConfig {
  bpm: number;
  loopBeats: number;
  melody: BgmNote[];
  bass: BgmNote[];
  perc: BgmNote[];
  harmony: BgmNote[];
  dings: BgmNote[];
}

// --- Helper: build a note with a beat-based time ---
function note(freq: number, beat: number, duration: number, gain: number, oscType: OscillatorType = 'sine', bpm: number = 120): BgmNote {
  return { freq, time: (60 / bpm) * beat, duration, gain, oscType };
}

// ===================================================================
// DAD — "Corporate Tech Support On Hold"
// 120 BPM, C major, A-B-A'-B' (16 seconds), syncopated, percussion
// ===================================================================
const DAD_BPM = 120;
const D = DAD_BPM;

const DAD_MELODY: BgmNote[] = [
  // Section A (beats 1-8): "Hey, you've reached... please hold."
  note(523, 0, 0.35, 0.04, 'sine', D),
  note(659, 0.75, 0.3, 0.04, 'sine', D),
  note(784, 1.5, 0.4, 0.04, 'sine', D),
  note(659, 2.5, 0.35, 0.035, 'sine', D),
  note(698, 4, 0.35, 0.04, 'sine', D),
  note(880, 4.75, 0.3, 0.04, 'sine', D),
  note(1047, 5.5, 0.4, 0.04, 'sine', D),
  note(880, 6.5, 0.35, 0.035, 'sine', D),
  // Section B (beats 9-16): "Your call is important to us..."
  note(784, 8, 0.35, 0.04, 'sine', D),
  note(698, 8.75, 0.3, 0.04, 'sine', D),
  note(659, 9.5, 0.35, 0.04, 'sine', D),
  note(587, 10.5, 0.4, 0.035, 'sine', D),
  note(523, 12, 0.35, 0.04, 'sine', D),
  note(587, 12.75, 0.3, 0.04, 'sine', D),
  note(659, 13.5, 0.35, 0.04, 'sine', D),
  note(698, 14.5, 0.4, 0.035, 'sine', D),
  // Section A' (beats 17-24): varied rhythm
  note(523, 16, 0.5, 0.04, 'sine', D),
  note(659, 17, 0.25, 0.04, 'sine', D),
  note(784, 17.5, 0.4, 0.04, 'sine', D),
  note(659, 18.5, 0.3, 0.035, 'sine', D),
  note(698, 20, 0.5, 0.04, 'sine', D),
  note(880, 21, 0.25, 0.04, 'sine', D),
  note(1047, 21.5, 0.5, 0.04, 'sine', D),
  note(1175, 22.5, 0.3, 0.035, 'sine', D),
  // Section B' (beats 25-32): "sorry for the wait" (unresolved F)
  note(880, 24, 0.35, 0.04, 'sine', D),
  note(784, 24.75, 0.3, 0.04, 'sine', D),
  note(698, 25.5, 0.35, 0.04, 'sine', D),
  note(659, 26.5, 0.4, 0.035, 'sine', D),
  note(587, 28, 0.35, 0.04, 'sine', D),
  note(659, 28.75, 0.3, 0.04, 'sine', D),
  note(698, 29.5, 1.2, 0.04, 'sine', D),
  note(784, 30.5, 0.15, 0.02, 'sine', D),
  note(698, 31, 0.8, 0.035, 'sine', D),
];

const DAD_BASS: BgmNote[] = [
  note(131, 0, 1.8, 0.025, 'triangle', D),
  note(175, 2, 1.8, 0.02, 'triangle', D),
  note(131, 4, 1.8, 0.025, 'triangle', D),
  note(196, 6, 1.8, 0.02, 'triangle', D),
  note(196, 8, 1.8, 0.02, 'triangle', D),
  note(175, 10, 1.8, 0.02, 'triangle', D),
  note(147, 12, 1.8, 0.025, 'triangle', D),
  note(175, 14, 1.8, 0.02, 'triangle', D),
  note(131, 16, 1.8, 0.025, 'triangle', D),
  note(175, 18, 1.8, 0.02, 'triangle', D),
  note(131, 20, 1.8, 0.025, 'triangle', D),
  note(196, 22, 1.8, 0.02, 'triangle', D),
  note(196, 24, 1.8, 0.02, 'triangle', D),
  note(175, 26, 1.8, 0.02, 'triangle', D),
  note(147, 28, 1.8, 0.025, 'triangle', D),
  note(175, 30, 1.8, 0.02, 'triangle', D),
];

const DAD_PERC: BgmNote[] = Array.from({ length: 16 }, (_, i) =>
  note(100 + (i % 4 === 0 ? 0 : 20), i * 2, 0.08, 0.012, 'triangle', D)
);

const DAD_HARMONY: BgmNote[] = [
  note(784, 0.5, 0.3, 0.01, 'sine', D),
  note(988, 4.5, 0.3, 0.01, 'sine', D),
  note(1175, 16.5, 0.3, 0.01, 'sine', D),
  note(1319, 24.5, 0.3, 0.01, 'sine', D),
];

const DAD_DINGS: BgmNote[] = [
  note(1568, 3.5, 0.12, 0.02, 'sine', D),
  note(1568, 11.5, 0.12, 0.02, 'sine', D),
  note(1319, 19.5, 0.12, 0.02, 'sine', D),
  note(1568, 27.5, 0.12, 0.02, 'sine', D),
];

// ===================================================================
// MUM — "Elevator Smooth Jazz"
// 100 BPM, F major, legato, no percussion, warm
// ===================================================================
const MUM_BPM = 100;
const M = MUM_BPM;

const MUM_MELODY: BgmNote[] = [
  // Section A (beats 1-8): warm ascending, legato
  note(349, 0, 0.7, 0.04, 'sine', M),       // F4
  note(440, 2, 0.7, 0.04, 'sine', M),       // A4
  note(523, 4, 0.7, 0.04, 'sine', M),       // C5
  note(698, 6, 0.9, 0.035, 'sine', M),      // F5 (long)
  // Section B (beats 9-16): gentle descent
  note(659, 8, 0.7, 0.04, 'sine', M),       // E5
  note(587, 10, 0.7, 0.04, 'sine', M),      // D5
  note(523, 12, 0.7, 0.04, 'sine', M),      // C5
  note(440, 14, 0.9, 0.035, 'sine', M),     // A4 (long)
  // Section A' (beats 17-24): repeat with variation
  note(349, 16, 0.7, 0.04, 'sine', M),      // F4
  note(440, 18, 0.7, 0.04, 'sine', M),      // A4
  note(523, 20, 0.7, 0.04, 'sine', M),      // C5
  note(659, 22, 0.9, 0.035, 'sine', M),     // E5 (different top)
  // Section B' (beats 25-32): "still on hold" (hangs on Bb — unresolved)
  note(587, 24, 0.7, 0.04, 'sine', M),      // D5
  note(523, 26, 0.7, 0.04, 'sine', M),      // C5
  note(466, 28, 0.7, 0.04, 'sine', M),      // Bb4
  note(440, 30, 1.4, 0.04, 'sine', M),      // A4 (long hang, unresolved)
];

const MUM_BASS: BgmNote[] = [
  note(87, 0, 3.5, 0.025, 'triangle', M),   // F2
  note(110, 4, 3.5, 0.02, 'triangle', M),   // A2
  note(87, 8, 3.5, 0.025, 'triangle', M),   // F2
  note(98, 12, 3.5, 0.02, 'triangle', M),   // G2
  note(87, 16, 3.5, 0.025, 'triangle', M),  // F2
  note(110, 20, 3.5, 0.02, 'triangle', M),  // A2
  note(87, 24, 3.5, 0.025, 'triangle', M),  // F2
  note(110, 28, 3.5, 0.02, 'triangle', M),  // A2 (unresolved)
];

const MUM_HARMONY: BgmNote[] = [
  note(523, 1, 0.5, 0.01, 'sine', M),       // C5 (3rd above F4)
  note(659, 9, 0.5, 0.01, 'sine', M),       // E5 (3rd above C5)
  note(523, 17, 0.5, 0.01, 'sine', M),      // C5
  note(698, 25, 0.5, 0.01, 'sine', M),      // F5 (3rd above D5)
];

const MUM_CONFIG: BgmConfig = {
  bpm: MUM_BPM,
  loopBeats: 32,
  melody: MUM_MELODY,
  bass: MUM_BASS,
  perc: [],
  harmony: MUM_HARMONY,
  dings: [
    note(1047, 7, 0.15, 0.015, 'sine', M),
    note(1047, 23, 0.15, 0.015, 'sine', M),
  ],
};

// ===================================================================
// GRANDMA — "Music Box"
// 90 BPM, high register (5th-6th octave), bell-like, slight detune
// ===================================================================
const GM_BPM = 90;
const G = GM_BPM;

// Slight detune factor for "music box" feel
const DETUNE = 1.003;

const GRANDMA_MELODY: BgmNote[] = [
  // Section A (beats 1-8): high, delicate, bell-like
  note(1047 * DETUNE, 0, 0.5, 0.035, 'sine', G),    // C6 (detuned)
  note(1319 * DETUNE, 1.5, 0.5, 0.03, 'sine', G),   // E6
  note(1568 * DETUNE, 3, 0.5, 0.035, 'sine', G),    // G6
  note(2093 * DETUNE, 4.5, 0.7, 0.03, 'sine', G),   // C7 (high, long)
  // Section B (beats 9-16): gentle descent
  note(1568 * DETUNE, 6, 0.5, 0.035, 'sine', G),    // G6
  note(1319 * DETUNE, 7.5, 0.5, 0.03, 'sine', G),   // E6
  note(1175 * DETUNE, 9, 0.5, 0.035, 'sine', G),    // D6
  note(1047 * DETUNE, 10.5, 0.7, 0.03, 'sine', G),  // C6 (long)
  // Section A' (beats 17-24): repeat, slightly different
  note(1047 * DETUNE, 12, 0.5, 0.035, 'sine', G),   // C6
  note(1319 * DETUNE, 13.5, 0.5, 0.03, 'sine', G),  // E6
  note(1568 * DETUNE, 15, 0.5, 0.035, 'sine', G),   // G6
  note(1760 * DETUNE, 16.5, 0.7, 0.03, 'sine', G),  // F6 (different top)
  // Section B' (beats 25-32): "still winding down" (hangs, unresolved)
  note(1568 * DETUNE, 18, 0.5, 0.035, 'sine', G),   // G6
  note(1319 * DETUNE, 19.5, 0.5, 0.03, 'sine', G),  // E6
  note(1175 * DETUNE, 21, 0.5, 0.035, 'sine', G),   // D6
  note(1047 * DETUNE, 22.5, 1.5, 0.035, 'sine', G), // C6 (long hang)
  note(1319 * DETUNE, 24, 0.3, 0.015, 'sine', G),   // E6 (sparkle)
  note(1047 * DETUNE, 25, 1.2, 0.03, 'sine', G),    // C6 (final, unresolved)
];

const GRANDMA_BASS: BgmNote[] = [
  note(262, 0, 3, 0.015, 'sine', G),      // C4 (soft, high bass for music box)
  note(330, 4, 3, 0.012, 'sine', G),      // E4
  note(262, 8, 3, 0.015, 'sine', G),      // C4
  note(349, 12, 3, 0.012, 'sine', G),     // F4
  note(262, 16, 3, 0.015, 'sine', G),     // C4
  note(330, 20, 3, 0.012, 'sine', G),     // E4
  note(262, 24, 3, 0.015, 'sine', G),     // C4
  note(349, 28, 3, 0.012, 'sine', G),     // F4 (unresolved)
];

const GRANDMA_HARMONY: BgmNote[] = [
  note(1568 * DETUNE, 0.5, 0.4, 0.008, 'sine', G),  // G6 (5th above C6)
  note(2093 * DETUNE, 6.5, 0.4, 0.008, 'sine', G),  // C7 (octave above)
  note(1568 * DETUNE, 12.5, 0.4, 0.008, 'sine', G), // G6
  note(2093 * DETUNE, 18.5, 0.4, 0.008, 'sine', G), // C7
];

const GRANDMA_CONFIG: BgmConfig = {
  bpm: GM_BPM,
  loopBeats: 32,
  melody: GRANDMA_MELODY,
  bass: GRANDMA_BASS,
  perc: [],
  harmony: GRANDMA_HARMONY,
  dings: [
    note(2637, 3.5, 0.1, 0.01, 'sine', G),   // C8 sparkle
    note(2637, 11.5, 0.1, 0.01, 'sine', G),  // C8 sparkle
    note(2093, 19.5, 0.1, 0.01, 'sine', G),  // C7 sparkle
  ],
};

// Dad uses the same structure
const DAD_CONFIG: BgmConfig = {
  bpm: DAD_BPM,
  loopBeats: 32,
  melody: DAD_MELODY,
  bass: DAD_BASS,
  perc: DAD_PERC,
  harmony: DAD_HARMONY,
  dings: DAD_DINGS,
};

const THEMES: Record<BgmTheme, BgmConfig> = {
  dad: DAD_CONFIG,
  mum: MUM_CONFIG,
  grandma: GRANDMA_CONFIG,
};

// ===================================================================
// Engine
// ===================================================================

let bgmOn = loadBgmPref();
let currentTheme: BgmTheme = 'dad';
let intervalId: ReturnType<typeof setInterval> | null = null;
let ctx: AudioContext | null = null;
let nextLoopTime = 0;
let activeOscillators: OscillatorNode[] = [];

export function loadBgmPref(): boolean {
  try {
    const raw = localStorage.getItem(BGM_KEY);
    if (raw !== null) return raw === 'true';
  } catch { /* ignore */ }
  return true;
}

export function saveBgmPref(on: boolean): void {
  try { localStorage.setItem(BGM_KEY, String(on)); } catch { /* ignore */ }
  bgmOn = on;
  if (on) startBgm();
  else stopBgm();
}

export function toggleBgm(): boolean {
  bgmOn = !bgmOn;
  saveBgmPref(bgmOn);
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
    try { osc.stop(); } catch { /* already stopped */ }
  }
  activeOscillators = [];
}

function scheduleLoop(audioCtx: AudioContext, startTime: number, config: BgmConfig): void {
  const notes = [...config.melody, ...config.dings, ...config.perc, ...config.bass, ...config.harmony];
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

function getLoopDuration(config: BgmConfig): number {
  return (60 / config.bpm) * config.loopBeats;
}

export function startBgm(theme?: BgmTheme): void {
  if (!bgmOn || intervalId !== null) return;
  if (theme) currentTheme = theme;
  const audioCtx = ensureContext();
  if (!audioCtx) return;

  killOscillators();
  const config = THEMES[currentTheme];
  const loopDuration = getLoopDuration(config);

  nextLoopTime = audioCtx.currentTime + 0.1;
  scheduleLoop(audioCtx, nextLoopTime, config);

  intervalId = setInterval(() => {
    if (!audioCtx) return;
    if (nextLoopTime - audioCtx.currentTime < loopDuration * 0.6) {
      nextLoopTime += loopDuration;
      scheduleLoop(audioCtx, nextLoopTime, config);
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
export function initBgm(theme?: BgmTheme): void {
  if (theme) currentTheme = theme;
  if (bgmOn && intervalId === null) {
    startBgm();
  }
}

/** Switch the BGM theme. Restarts the loop if already playing. */
export function setBgmTheme(theme: BgmTheme): void {
  if (theme === currentTheme) return;
  currentTheme = theme;
  if (intervalId !== null && bgmOn) {
    // Restart with new theme
    stopBgm();
    startBgm();
  }
}

// ===================================================================
// One-shot jingles (victory / defeat)
// ===================================================================

interface JingleNote {
  freq: number;
  time: number;
  duration: number;
  gain: number;
  oscType: OscillatorType;
}

const VICTORY_NOTES: JingleNote[] = [
  { freq: 523, time: 0, duration: 0.15, gain: 0.05, oscType: 'sine' },
  { freq: 659, time: 0.12, duration: 0.15, gain: 0.05, oscType: 'sine' },
  { freq: 784, time: 0.24, duration: 0.15, gain: 0.05, oscType: 'sine' },
  { freq: 1047, time: 0.36, duration: 0.5, gain: 0.06, oscType: 'sine' },
  { freq: 1319, time: 0.36, duration: 0.4, gain: 0.02, oscType: 'sine' },
  { freq: 1568, time: 0.36, duration: 0.3, gain: 0.015, oscType: 'sine' },
];

const DEFEAT_NOTES: JingleNote[] = [
  { freq: 330, time: 0, duration: 0.3, gain: 0.05, oscType: 'triangle' },
  { freq: 294, time: 0.3, duration: 0.3, gain: 0.05, oscType: 'triangle' },
  { freq: 262, time: 0.6, duration: 0.3, gain: 0.05, oscType: 'triangle' },
  { freq: 233, time: 0.9, duration: 0.6, gain: 0.06, oscType: 'triangle' },
  { freq: 117, time: 0.9, duration: 0.5, gain: 0.03, oscType: 'sine' },
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

export function playVictoryJingle(): void {
  playJingle(VICTORY_NOTES);
}

export function playDefeatJingle(): void {
  playJingle(DEFEAT_NOTES);
}
