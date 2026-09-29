import { describe, it, expect, beforeEach } from 'vitest';
import {
  playHaptic,
  loadHapticsPref,
  saveHapticsPref,
  toggleHaptics,
  HapticType,
} from '../haptics';

// Mock localStorage
const mockStorage: Record<string, string> = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => mockStorage[k] ?? null,
    setItem: (k: string, v: string) => { mockStorage[k] = v; },
    removeItem: (k: string) => { delete mockStorage[k]; },
    clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
  },
  writable: true,
});

// Mock navigator.vibrate
let lastVibrateCall: number | number[] | null = null;
Object.defineProperty(globalThis, 'navigator', {
  value: {
    ...globalThis.navigator,
    vibrate: (pattern: number | number[]) => { lastVibrateCall = pattern; },
  },
  writable: true,
});

describe('Haptics', () => {
  beforeEach(() => {
    lastVibrateCall = null;
    // Reset enabled state to true
    saveHapticsPref(true);
  });

  describe('playHaptic', () => {
    it('plays click pattern', () => {
      playHaptic('click');
      expect(lastVibrateCall).toBe(30);
    });

    it('plays success pattern', () => {
      playHaptic('success');
      expect(lastVibrateCall).toEqual([40, 30, 40]);
    });

    it('plays complete pattern', () => {
      playHaptic('complete');
      expect(lastVibrateCall).toEqual([40, 20, 40, 20, 60]);
    });

    it('plays defeat pattern', () => {
      playHaptic('defeat');
      expect(lastVibrateCall).toEqual([300, 100, 200, 100, 100]);
    });

    it('plays faceid-aligned pattern', () => {
      playHaptic('faceid-aligned');
      expect(lastVibrateCall).toEqual([30, 20, 30]);
    });

    it('plays smudge pattern', () => {
      playHaptic('smudge');
      expect(lastVibrateCall).toEqual([80, 40, 80, 40, 80]);
    });

    it('is a no-op when disabled', () => {
      toggleHaptics(); // off
      playHaptic('click');
      expect(lastVibrateCall).toBeNull();
    });
  });

  describe('loadHapticsPref', () => {
    it('returns true when no localStorage key exists', () => {
      delete mockStorage['ptsd_haptics'];
      expect(loadHapticsPref()).toBe(true);
    });

    it('returns true when stored value is "true"', () => {
      mockStorage['ptsd_haptics'] = 'true';
      expect(loadHapticsPref()).toBe(true);
    });

    it('returns false when stored value is "false"', () => {
      mockStorage['ptsd_haptics'] = 'false';
      expect(loadHapticsPref()).toBe(false);
    });
  });

  describe('saveHapticsPref', () => {
    it('persists true to localStorage', () => {
      saveHapticsPref(true);
      expect(mockStorage['ptsd_haptics']).toBe('true');
    });

    it('persists false to localStorage', () => {
      saveHapticsPref(false);
      expect(mockStorage['ptsd_haptics']).toBe('false');
    });
  });

  describe('toggleHaptics', () => {
    it('toggles from enabled to disabled', () => {
      const result = toggleHaptics();
      expect(result).toBe(false);
      expect(mockStorage['ptsd_haptics']).toBe('false');
    });

    it('toggles from disabled to enabled', () => {
      mockStorage['ptsd_haptics'] = 'false';
      saveHapticsPref(false); // ensure disabled
      const result = toggleHaptics();
      expect(result).toBe(true);
      expect(mockStorage['ptsd_haptics']).toBe('true');
    });
  });

  describe('pattern completeness', () => {
    const allTypes: HapticType[] = [
      'click', 'toggle',
      'success', 'failure', 'complete', 'warning', 'progress',
      'interrupt', 'battery-low', 'timer-warn', 'achievement', 'defeat',
      'charger-on', 'charger-off', 'spam',
      'faceid-distraction', 'faceid-aligned', 'smudge',
    ];

    it('every HapticType has a valid pattern', () => {
      for (const type of allTypes) {
        lastVibrateCall = null;
        playHaptic(type);
        expect(lastVibrateCall).not.toBeNull();
      }
    });
  });
});
