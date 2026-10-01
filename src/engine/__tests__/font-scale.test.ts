import { describe, it, expect, beforeEach } from 'vitest';
import {
  clampFontScale,
  loadFontScale,
  saveFontScale,
  applyFontScale,
  FONT_MIN,
  FONT_MAX,
  FONT_DEFAULT,
} from '../font-scale';

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

// Mock document (vitest runs in node, no DOM)
const rootStyle: Record<string, string> = {};
Object.defineProperty(globalThis, 'document', {
  value: { documentElement: { style: rootStyle } },
  writable: true,
});

describe('FontScale', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    delete rootStyle.fontSize;
  });

  describe('clampFontScale', () => {
    it('returns default for non-finite input', () => {
      expect(clampFontScale(NaN)).toBe(FONT_DEFAULT);
      expect(clampFontScale(Infinity)).toBe(FONT_DEFAULT);
    });

    it('clamps below minimum', () => {
      expect(clampFontScale(42)).toBe(FONT_MIN);
    });

    it('clamps above maximum', () => {
      expect(clampFontScale(999)).toBe(FONT_MAX);
    });

    it('rounds to whole percent', () => {
      expect(clampFontScale(112.6)).toBe(113);
    });

    it('passes through in-range values', () => {
      expect(clampFontScale(110)).toBe(110);
    });
  });

  describe('loadFontScale', () => {
    it('returns default when nothing stored', () => {
      expect(loadFontScale()).toBe(FONT_DEFAULT);
    });

    it('returns stored value when valid', () => {
      mockStorage.ptsd_font_scale = '115';
      expect(loadFontScale()).toBe(115);
    });

    it('clamps out-of-range stored values', () => {
      mockStorage.ptsd_font_scale = '42';
      expect(loadFontScale()).toBe(FONT_MIN);

      mockStorage.ptsd_font_scale = '999';
      expect(loadFontScale()).toBe(FONT_MAX);
    });

    it('falls back to default for garbage values', () => {
      mockStorage.ptsd_font_scale = 'abc';
      expect(loadFontScale()).toBe(FONT_DEFAULT);

      mockStorage.ptsd_font_scale = '';
      expect(loadFontScale()).toBe(FONT_DEFAULT);
    });
  });

  describe('saveFontScale', () => {
    it('persists the value', () => {
      saveFontScale(115);
      expect(mockStorage.ptsd_font_scale).toBe('115');
    });

    it('clamps before persisting', () => {
      saveFontScale(200);
      expect(mockStorage.ptsd_font_scale).toBe(String(FONT_MAX));
    });

    it('applies the scale to the root element', () => {
      saveFontScale(115);
      expect(rootStyle.fontSize).toBe('115%');
    });

    it('does not throw when localStorage throws', () => {
      const original = globalThis.localStorage;
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: () => { throw new Error('denied'); },
          setItem: () => { throw new Error('denied'); },
        },
        writable: true,
      });
      expect(() => saveFontScale(110)).not.toThrow();
      expect(rootStyle.fontSize).toBe('110%');
      Object.defineProperty(globalThis, 'localStorage', { value: original, writable: true });
    });
  });

  describe('applyFontScale', () => {
    it('sets the root font size as a percentage', () => {
      applyFontScale(125);
      expect(rootStyle.fontSize).toBe('125%');
    });

    it('clamps out-of-range values', () => {
      applyFontScale(500);
      expect(rootStyle.fontSize).toBe(`${FONT_MAX}%`);
    });
  });
});
