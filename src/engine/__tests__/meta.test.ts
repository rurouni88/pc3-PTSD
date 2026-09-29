import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MetaStore } from '../meta';

// Mock localStorage
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
});

describe('MetaStore', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  it('returns empty state when no data exists', () => {
    const meta = MetaStore.load();
    expect(meta.totalRuns).toBe(0);
    expect(meta.wins).toBe(0);
    expect(meta.losses).toBe(0);
    expect(meta.topRuns).toEqual([]);
  });

  it('records a winning run', () => {
    MetaStore.recordRunComplete({
      difficulty: 'dad',
      won: true,
      timeRemaining: 45,
      batteryLevel: 72,
      seed: 'TESTSEED',
      date: '2026-01-01T00:00:00Z',
    });

    const meta = MetaStore.load();
    expect(meta.totalRuns).toBe(1);
    expect(meta.wins).toBe(1);
    expect(meta.losses).toBe(0);
    expect(meta.bestTimes.dad).toBe(45);
    expect(meta.bestBatteries.dad).toBe(72);
  });

  it('records a losing run without updating bests', () => {
    MetaStore.recordRunComplete({
      difficulty: 'mum',
      won: false,
      timeRemaining: 0,
      batteryLevel: 0,
      seed: 'FAILSEED',
      date: '2026-01-01T00:00:00Z',
    });

    const meta = MetaStore.load();
    expect(meta.totalRuns).toBe(1);
    expect(meta.wins).toBe(0);
    expect(meta.losses).toBe(1);
    expect(meta.bestTimes.mum).toBe(0);
  });

  it('keeps the best (highest) time remaining on repeated wins', () => {
    MetaStore.recordRunComplete({
      difficulty: 'dad',
      won: true,
      timeRemaining: 30,
      batteryLevel: 50,
      seed: 'SEEDA',
      date: '2026-01-01T00:00:00Z',
    });
    MetaStore.recordRunComplete({
      difficulty: 'dad',
      won: true,
      timeRemaining: 60,
      batteryLevel: 40,
      seed: 'SEEDB',
      date: '2026-01-02T00:00:00Z',
    });

    const meta = MetaStore.load();
    expect(meta.bestTimes.dad).toBe(60);
  });

  it('keeps the best (highest) battery on repeated wins', () => {
    MetaStore.recordRunComplete({
      difficulty: 'grandma',
      won: true,
      timeRemaining: 10,
      batteryLevel: 30,
      seed: 'SEEDC',
      date: '2026-01-01T00:00:00Z',
    });
    MetaStore.recordRunComplete({
      difficulty: 'grandma',
      won: true,
      timeRemaining: 20,
      batteryLevel: 85,
      seed: 'SEEDD',
      date: '2026-01-02T00:00:00Z',
    });

    const meta = MetaStore.load();
    expect(meta.bestBatteries.grandma).toBe(85);
  });

  it('caps topRuns at MAX_RUNS', () => {
    for (let i = 0; i < 35; i++) {
      MetaStore.recordRunComplete({
        difficulty: 'dad',
        won: i % 2 === 0,
        timeRemaining: i,
        batteryLevel: 100 - i,
        seed: `SEED${i}`,
        date: `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
      });
    }

    const meta = MetaStore.load();
    expect(meta.topRuns).toHaveLength(MetaStore.MAX_RUNS);
  });

  it('filters topRuns by difficulty', () => {
    MetaStore.recordRunComplete({
      difficulty: 'dad',
      won: true,
      timeRemaining: 50,
      batteryLevel: 90,
      seed: 'DADSEED',
      date: '2026-01-01T00:00:00Z',
    });
    MetaStore.recordRunComplete({
      difficulty: 'mum',
      won: true,
      timeRemaining: 40,
      batteryLevel: 80,
      seed: 'MUMSEED',
      date: '2026-01-01T00:00:00Z',
    });

    const dadRuns = MetaStore.getTopRuns('dad');
    expect(dadRuns).toHaveLength(1);
    expect(dadRuns[0].difficulty).toBe('dad');
  });

  it('handles corrupted data gracefully', () => {
    mockStorage[MetaStore.KEY] = 'not valid json{{{';
    const meta = MetaStore.load();
    expect(meta.totalRuns).toBe(0);
    expect(meta.topRuns).toEqual([]);
  });
});
