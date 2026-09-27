import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ACHIEVEMENTS, checkAchievements, loadUnlocked, saveUnlocked, achievementById } from '../achievements';
import type { GameEngineState } from '../../types/game';

const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
});

const wonState: GameEngineState = {
  gameState: 'results',
  difficulty: 'dad',
  timeRemaining: 45,
  batteryLevel: 72,
  isPaused: false,
  activeIssues: [
    { id: 'test-1', type: 'infinite-tab-sweep', isResolved: true, drainPenalty: 0.5 },
  ],
  completedIssues: [
    { id: 'test-1', type: 'infinite-tab-sweep', isResolved: true, drainPenalty: 0.5 },
  ],
  currentMiniGame: null,
};

const lostState: GameEngineState = {
  gameState: 'results',
  difficulty: 'mum',
  timeRemaining: 30,
  batteryLevel: 0,
  isPaused: false,
  activeIssues: [
    { id: 'test-1', type: 'duplicate-doom', isResolved: false, drainPenalty: 0.6 },
  ],
  completedIssues: [],
  currentMiniGame: null,
};

describe('Achievements', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  it('unlocks "fixed_it" on a win', () => {
    const newly = checkAchievements(wonState);
    expect(newly.some((a) => a.id === 'fixed_it')).toBe(true);
  });

  it('unlocks "battery_death" on a loss', () => {
    const newly = checkAchievements(lostState);
    expect(newly.some((a) => a.id === 'battery_death')).toBe(true);
  });

  it('does not re-unlock already-unlocked achievements', () => {
    checkAchievements(wonState);
    const newly = checkAchievements(wonState);
    expect(newly).toHaveLength(0);
  });

  it('persists unlocked ids to localStorage', () => {
    checkAchievements(wonState);
    const unlocked = loadUnlocked();
    expect(unlocked.length).toBeGreaterThan(0);
  });

  it('finds achievement by id', () => {
    const achievement = achievementById('fixed_it');
    expect(achievement).toBeDefined();
    expect(achievement!.title).toBe('It Worked On My Machine');
  });

  it('returns undefined for unknown id', () => {
    expect(achievementById('nonexistent')).toBeUndefined();
  });

  it('has valid achievement definitions', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.id).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.desc).toBeTruthy();
      expect(a.emoji).toBeTruthy();
      expect(typeof a.check).toBe('function');
    }
  });
});
