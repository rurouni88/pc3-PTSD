// Meta progression — persists across runs (records, lifetime stats).
// Owns the 'ptsd_meta' localStorage key.

import type { Difficulty } from '../types/game';

export interface RunRecord {
  difficulty: Difficulty;
  won: boolean;
  timeRemaining: number;
  batteryLevel: number;
  seed: string;
  date: string; // ISO
}

interface MetaState {
  totalRuns: number;
  wins: number;
  losses: number;
  bestTimes: Record<Difficulty, number>; // highest time remaining on a win
  bestBatteries: Record<Difficulty, number>;
  lastRunDate: string;
  topRuns: RunRecord[];
}

const EMPTY: MetaState = {
  totalRuns: 0,
  wins: 0,
  losses: 0,
  bestTimes: { dad: 0, mum: 0, grandma: 0 },
  bestBatteries: { dad: 0, mum: 0, grandma: 0 },
  lastRunDate: '',
  topRuns: [],
};

export const MetaStore = {
  KEY: 'ptsd_meta',
  MAX_RUNS: 30,

  load(): MetaState {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return { ...EMPTY, topRuns: [] };
    try {
      const meta = JSON.parse(raw);
      if (!meta || typeof meta !== 'object') return { ...EMPTY, topRuns: [] };
      return {
        ...EMPTY,
        ...meta,
        bestTimes: { ...EMPTY.bestTimes, ...(meta.bestTimes || {}) },
        bestBatteries: { ...EMPTY.bestBatteries, ...(meta.bestBatteries || {}) },
        topRuns: Array.isArray(meta.topRuns) ? meta.topRuns : [],
      };
    } catch (e) {
      console.error('[PTSD] Meta data corrupted; ignoring', e);
      return { ...EMPTY, topRuns: [] };
    }
  },

  save(meta: MetaState): void {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(meta));
    } catch (e) {
      console.warn('[PTSD] Failed to save meta:', e);
    }
  },

  recordRunComplete(record: RunRecord): void {
    const meta = this.load();
    meta.totalRuns = (meta.totalRuns || 0) + 1;
    meta.wins = (meta.wins || 0) + (record.won ? 1 : 0);
    meta.losses = (meta.losses || 0) + (record.won ? 0 : 1);
    meta.lastRunDate = record.date;

    if (record.won) {
      // Higher time remaining = better (finished faster)
      const prevBest = meta.bestTimes[record.difficulty];
      if (prevBest === 0 || record.timeRemaining > prevBest) {
        meta.bestTimes[record.difficulty] = record.timeRemaining;
      }
      if (record.batteryLevel > meta.bestBatteries[record.difficulty]) {
        meta.bestBatteries[record.difficulty] = record.batteryLevel;
      }
    }

    meta.topRuns = [...(meta.topRuns || []), record]
      .sort((a, b) =>
        Number(b.won) - Number(a.won) ||
        b.batteryLevel - a.batteryLevel ||
        b.timeRemaining - a.timeRemaining
      )
      .slice(0, this.MAX_RUNS);

    this.save(meta);
  },

  getTopRuns(difficulty: Difficulty, n = 5): RunRecord[] {
    return this.load()
      .topRuns.filter((r) => r.difficulty === difficulty)
      .slice(0, n);
  },

  getTopRunsCount(): number {
    return this.load().topRuns.length;
  },

  clearTopRuns(): void {
    const meta = this.load();
    meta.topRuns = [];
    this.save(meta);
  },
};
