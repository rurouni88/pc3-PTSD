import { describe, it, expect, beforeEach } from 'vitest';
import { RngEngine } from '../seeded-rng';

describe('RngEngine', () => {
  beforeEach(() => {
    RngEngine.unseed();
  });

  describe('unseeded (Math.random fallback)', () => {
    it('returns values in [0, 1)', () => {
      for (let i = 0; i < 100; i++) {
        const val = RngEngine.random();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });

    it('generates a valid 8-char seed', () => {
      const seed = RngEngine.generateSeed();
      expect(seed).toHaveLength(8);
      expect(seed).toMatch(/^[A-Z0-9]{8}$/);
    });
  });

  describe('seeded (deterministic)', () => {
    it('produces the same sequence for the same seed', () => {
      RngEngine.seedWith('ABCD1234');
      const first = Array.from({ length: 10 }, () => RngEngine.random());

      RngEngine.seedWith('ABCD1234');
      const second = Array.from({ length: 10 }, () => RngEngine.random());

      expect(first).toEqual(second);
    });

    it('produces different sequences for different seeds', () => {
      RngEngine.seedWith('AAAAAAAA');
      const first = Array.from({ length: 10 }, () => RngEngine.random());

      RngEngine.seedWith('BBBBBBBB');
      const second = Array.from({ length: 10 }, () => RngEngine.random());

      expect(first).not.toEqual(second);
    });

    it('returns values in [0, 1) when seeded', () => {
      RngEngine.seedWith('TESTSEED');
      for (let i = 0; i < 100; i++) {
        const val = RngEngine.random();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });
  });

  describe('shuffle', () => {
    it('preserves all elements', () => {
      RngEngine.seedWith('SHUFFLE1');
      const input = [1, 2, 3, 4, 5, 6, 7, 8];
      const output = RngEngine.shuffle(input);

      expect(output).toHaveLength(input.length);
      expect([...output].sort((a, b) => a - b)).toEqual(input);
    });

    it('is deterministic with the same seed', () => {
      RngEngine.seedWith('SHUFFLE1');
      const first = RngEngine.shuffle([1, 2, 3, 4, 5]);

      RngEngine.seedWith('SHUFFLE1');
      const second = RngEngine.shuffle([1, 2, 3, 4, 5]);

      expect(first).toEqual(second);
    });

    it('does not mutate the input array', () => {
      RngEngine.seedWith('NOMUTATE1');
      const input = [1, 2, 3, 4, 5];
      RngEngine.shuffle(input);
      expect(input).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('dRoll', () => {
    it('returns values in [1, sides]', () => {
      RngEngine.seedWith('DROLL666');
      for (let i = 0; i < 100; i++) {
        const val = RngEngine.dRoll(20);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(20);
      }
    });
  });

  describe('snapshot and restore', () => {
    it('preserves RNG position across save/load', () => {
      RngEngine.seedWith('SAVELOAD');
      RngEngine.random();
      RngEngine.random();
      RngEngine.random();

      const snapshot = RngEngine.getState();
      const next = RngEngine.random();

      RngEngine.setState(snapshot);
      const restored = RngEngine.random();

      expect(restored).toEqual(next);
    });

    it('unseeds when snapshot is null', () => {
      RngEngine.seedWith('TESTSEED');
      RngEngine.setState(null);
      expect(RngEngine.seed).toBe('');
      expect(RngEngine._state).toBeNull();
    });
  });
});
