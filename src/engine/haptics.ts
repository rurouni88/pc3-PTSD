// HapticsEngine — Vibration feedback for PTSD.
// Centralized haptic patterns with a settings toggle.
// Mirrors the SoundEngine architecture.
// navigator.vibrate() is Android + some WebViews only. iOS Safari does not support it.
// Non-fatal fallback: no-op on unsupported platforms.

const HAPTICS_KEY = 'ptsd_haptics';

export type HapticType =
  // UI feedback
  | 'click'
  | 'toggle'

  // Mini-game feedback
  | 'success'
  | 'failure'
  | 'complete'
  | 'warning'
  | 'progress'

  // Game events
  | 'interrupt'
  | 'battery-low'
  | 'timer-warn'
  | 'achievement'
  | 'defeat'
  | 'charger-on'
  | 'charger-off'
  | 'spam'

  // Biometric-specific
  | 'faceid-distraction'
  | 'faceid-aligned'
  | 'smudge';

interface HapticDef {
  pattern: number | number[];
}

const HAPTIC_DEFS: Record<HapticType, HapticDef> = {
  click:              { pattern: 30 },
  toggle:             { pattern: 50 },
  success:            { pattern: [40, 30, 40] },
  failure:            { pattern: [100, 50, 100, 50, 100] },
  complete:           { pattern: [40, 20, 40, 20, 60] },
  warning:            { pattern: [150, 100, 150] },
  progress:           { pattern: 20 },
  interrupt:          { pattern: [50, 30, 50, 30, 50] },
  'battery-low':      { pattern: [200, 100, 150, 100, 100] },
  'timer-warn':       { pattern: [100, 50, 100] },
  achievement:        { pattern: [40, 20, 40, 20, 40, 20, 40, 20, 40] },
  defeat:             { pattern: [300, 100, 200, 100, 100] },
  'charger-on':       { pattern: [100, 50, 200] },
  'charger-off':      { pattern: [200, 100, 100] },
  spam:               { pattern: [50, 30, 50, 30, 50, 30, 50] },
  'faceid-distraction': { pattern: [100, 50, 100] },
  'faceid-aligned':   { pattern: [30, 20, 30] },
  smudge:             { pattern: [80, 40, 80, 40, 80] },
};

let enabled = true;

export function loadHapticsPref(): boolean {
  try {
    const raw = localStorage.getItem(HAPTICS_KEY);
    if (raw !== null) return raw === 'true';
  } catch {
    // ignore
  }
  return true;
}

export function saveHapticsPref(on: boolean): void {
  try {
    localStorage.setItem(HAPTICS_KEY, String(on));
  } catch {
    // ignore
  }
  enabled = on;
}

export function toggleHaptics(): boolean {
  enabled = !enabled;
  saveHapticsPref(enabled);
  return enabled;
}

export function playHaptic(type: HapticType): void {
  if (!enabled) return;
  const def = HAPTIC_DEFS[type];
  if (!def) return;
  if (navigator.vibrate) navigator.vibrate(def.pattern);
}
