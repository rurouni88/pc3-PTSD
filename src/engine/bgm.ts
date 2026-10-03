// BGMEngine — Looping background music for PTSD.
// A simple "phone on hold" / tech-support jingle that loops.
// Uses the same AudioContext as the SFX engine.
// Respects audio on/off and volume settings.

const BGM_KEY = 'ptsd_bgm';

// "Tech Support On Hold" — a slightly tense, never-quite-resolving loop.
// 8 beats at ~120 BPM (0.5s per beat).
// Melody: C D E D | C D E F (never resolves to G — you're still on hold)
// Bass:   C3 on beats 1 & 5

const BPM = 120;
const BEAT = 60 / BPM; // 0.5s

interface BgmNote {
  freq: number;
  time: number; // offset in seconds from loop start
  duration: number;
  gain: number;
  oscType: OscillatorType;
}

const MELODY: BgmNote[] = [
  // Bar 1: C D E D
  { freq: 523, time: 0, duration: 0.4, gain: 0.03, oscType: 'sine' },
  { freq: 587, time: BEAT, duration: 0.4, gain: 0.03, oscType: 'sine' },
  { freq: 659, time: BEAT * 2, duration: 0.4, gain: 0.03, oscType: 'sine' },
  { freq: 587, time: BEAT * 3, duration: 0.4, gain: 0.03, oscType: 'sine' },
  // Bar 2: C D E F (tension — no resolution)
  { freq: 523, time: BEAT * 4, duration: 0.4, gain: 0.03, oscType: 'sine' },
  { freq: 587, time: BEAT * 5, duration: 0.4, gain: 0.03, oscType: 'sine' },
  { freq: 659, time: BEAT * 6, duration: 0.4, gain: 0.03, oscType: 'sine' },
  { freq: 698, time: BEAT * 7, duration: 0.5, gain: 0.03, oscType: 'sine' },
];

const BASS: BgmNote[] = [
  { freq: 131, time: 0, duration: 1.8, gain: 0.02, oscType: 'triangle' },
  { freq: 131, time: BEAT * 4, duration: 1.8, gain: 0.02, oscType: 'triangle' },
];

const LOOP_DURATION = BEAT * 8; // 4 seconds

let bgmOn = true;
let intervalId: ReturnType<typeof setInterval> | null = null;
let ctx: AudioContext | null = null;
let nextLoopTime = 0;

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

function scheduleLoop(audioCtx: AudioContext, startTime: number): void {
  const notes = [...MELODY, ...BASS];
  for (const note of notes) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = note.oscType;
    osc.frequency.setValueAtTime(note.freq, startTime + note.time);
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const t = startTime + note.time;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(note.gain, t + 0.02);
    gain.gain.setValueAtTime(note.gain, t + note.duration - 0.05);
    gain.gain.linearRampToValueAtTime(0, t + note.duration);

    osc.start(t);
    osc.stop(t + note.duration + 0.01);
  }
}

export function startBgm(): void {
  if (!bgmOn || intervalId !== null) return;

  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;

  if (!ctx) ctx = new Ctx();
  if (ctx.state === 'suspended') ctx.resume();

  nextLoopTime = ctx.currentTime + 0.1;
  scheduleLoop(ctx, nextLoopTime);

  intervalId = setInterval(() => {
    if (!ctx) return;
    // Schedule next loop slightly before the current one ends
    if (nextLoopTime - ctx.currentTime < LOOP_DURATION * 0.5) {
      nextLoopTime += LOOP_DURATION;
      scheduleLoop(ctx, nextLoopTime);
    }
  }, 200);
}

export function stopBgm(): void {
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
