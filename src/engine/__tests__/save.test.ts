import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveSystem, SaveData } from '../save';
import { RngEngine } from '../seeded-rng';
import type { GameEngineState } from '../../types/game';

const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
});

const mockState: GameEngineState = {
  gameState: 'playing',
  difficulty: 'dad',
  timeRemaining: 90,
  batteryLevel: 65,
  isPaused: false,
  activeIssues: [
    { id: 'test-1', type: 'infinite-tab-sweep', isResolved: false, drainPenalty: 0.5 },
  ],
  completedIssues: [],
  currentMiniGame: null,
};

describe('SaveSystem', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    RngEngine.unseed();
  });

  it('saves and loads state with RNG snapshot', () => {
    RngEngine.seedWith('TESTSEED');
    RngEngine.random(); // advance position

    SaveSystem.save(mockState);

    const loaded = SaveSystem.load();
    expect(loaded).not.toBeNull();
    expect(loaded!.state.timeRemaining).toBe(90);
    expect(loaded!.state.batteryLevel).toBe(65);
    expect(loaded!.rng).not.toBeNull();
    expect(loaded!.rng!.seed).toBe('TESTSEED');
  });

  it('reports hasSave correctly', () => {
    expect(SaveSystem.hasSave()).toBe(false);
    SaveSystem.save(mockState);
    expect(SaveSystem.hasSave()).toBe(true);
    SaveSystem.deleteSave();
    expect(SaveSystem.hasSave()).toBe(false);
  });

  it('returns null when no save exists', () => {
    expect(SaveSystem.load()).toBeNull();
  });

  it('restores RNG state on load', () => {
    RngEngine.seedWith('RNGTEST1');
    RngEngine.random();
    RngEngine.random();

    SaveSystem.save(mockState);

    const loaded = SaveSystem.load();
    expect(loaded).not.toBeNull();

    RngEngine.setState(loaded!.rng);
    expect(RngEngine.seed).toBe('RNGTEST1');
  });
});

describe('SaveData validation', () => {
  it('rejects non-object data', () => {
    expect(SaveData.parse(null)).toBeNull();
    expect(SaveData.parse('string')).toBeNull();
    expect(SaveData.parse([1, 2, 3])).toBeNull();
  });

  it('rejects missing timestamp', () => {
    const errors = SaveData.validate({ state: mockState, rng: null });
    expect(errors).toContain('timestamp is not a number');
  });

  it('rejects missing state', () => {
    const errors = SaveData.validate({ timestamp: 123, rng: null });
    expect(errors).toContain('state is missing');
  });

  it('accepts valid save data', () => {
    const errors = SaveData.validate({
      state: mockState,
      rng: { seed: 'TESTSEED', state: 12345 },
      timestamp: Date.now(),
    });
    expect(errors).toEqual([]);
  });
});
