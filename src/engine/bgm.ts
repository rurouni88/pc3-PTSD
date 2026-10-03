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

// Melody: 4 bars, C major. Ascends, descends, then hangs on F (no resolution).
// Rhythm has syncopation — feels like a corporate hold track.
const MELODY: BgmNote[] = [
  // Bar 1 (beats 1-4): "Hey, you've reached..."
  { freq: 523, time: 0, duration: 0.35, gain: 0.04, oscType: 'sine' },           // C4
  { freq: 659, time: BEAT * 0.75, duration: 0.3, gain: 0.04, oscType: 'sine' },  // E4 (syncopated)
  { freq: 784, time: BEAT * 1.5, duration: 0.4, gain: 0.04, oscType: 'sine' },   // G4
  { freq: 659, time: BEAT * 2.5, duration: 0.35, gain: 0.035, oscType: 'sine' }, // E4

  // Bar 2 (beats 5-8): "...tech support. Please hold."
  { freq: 698, time: BEAT * 4, duration: 0.35, gain: 0.04, oscType: 'sine' },    // F4
  { freq: 880, time: BEAT * 4.75, duration: 0.3, gain: 0.04, oscType: 'sine' },  // A4 (syncopated)
  { freq: 1047, time: BEAT * 5.5, duration: 0.4, gain: 0.04, oscType: 'sine' },  // C5
  { freq: 880, time: BEAT * 6.5, duration: 0.35, gain: 0.035, oscType: 'sine' }, // A4

  // Bar 3 (beats 9-12): "Your call is important to us."
  { freq: 784, time: BEAT * 8, duration: 0.35, gain: 0.04, oscType: 'sine' },    // G4
  { freq: 659, time: BEAT * 8.75, duration: 0.3, gain: 0.04, oscType: 'sine' },  // E4 (syncopated)
  { freq: 587, time: BEAT * 9.5, duration: 0.4, gain: 0.04, oscType: 'sine' },   // D4
  { freq: 523, time: BEAT * 10.5, duration: 0.35, gain: 0.035, oscType: 'sine' }, // C4

  // Bar 4 (beats 13-16): "And we're sorry for the wait." (hangs on F — unresolved)
  { freq: 587, time: BEAT * 12, duration: 0.35, gain: 0.04, oscType: 'sine' },   // D4
  { freq: 659, time: BEAT * 12.75, duration: 0.3, gain: 0.04, oscType: 'sine' }, // E4 (syncopated)
  { freq: 698, time: BEAT * 13.5, duration: 0.7, gain: 0.04, oscType: 'sine' },  // F4 (hangs, unresolved)
];

// "Ding" accents — like a phone notification. Short, bright, high.
const DINGS: BgmNote[] = [
  { freq: 1568, time: BEAT * 3.5, duration: 0.12, gain: 0.02, oscType: 'sine' }, // G5 ding (end of bar 1)
  { freq: 1568, time: BEAT * 7.5, duration: 0.12, gain: 0.02, oscType: 'sine' }, // G5 ding (end of bar 2)
  { freq: 1319, time: BEAT * 11.5, duration: 0.12, gain: 0.02, oscType: 'sine' },// E5 ding (end of bar 3)
];

// Walking bass — gives it a "corporate elevator" feel.
const BASS: BgmNote[] = [
  { freq: 131, time: 0, duration: 1.8, gain: 0.025, oscType: 'triangle' },          // C3
  { freq: 175, time: BEAT * 2, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // F2 (bar 1)
  { freq: 131, time: BEAT * 4, duration: 1.8, gain: 0.025, oscType: 'triangle' },   // C3
  { freq: 196, time: BEAT * 6, duration: 1.8, gain: 0.02, oscType: 'triangle' },    // G2 (bar 2)
  { freq: 131, time: BEAT * 8, duration: 1.8, gain: 0.025, oscType: 'triangle' },   // C3
  { freq: 175, time: BEAT * 10, duration: 1.8, gain: 0.02, oscType: 'triangle' },   // F2 (bar 3)
  { freq: 131, time: BEAT * 12, duration: 1.8, gain: 0.025, oscType: 'triangle' },  // C3
  { freq: 175, time: BEAT * 14, duration: 1.8, gain: 0.02, oscType: 'triangle' },   // F2 (bar 4 — unresolved)
];

const LOOP_DURATION = BEAT * 16; // 8 seconds

let bgmOn = true;
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
  const notes = [...MELODY, ...DINGS, ...BASS];
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
