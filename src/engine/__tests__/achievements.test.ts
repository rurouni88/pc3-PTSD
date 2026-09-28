import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ACHIEVEMENTS, checkAchievements, loadUnlocked, saveUnlocked, achievementById } from '../achievements';
import type { GameEngineState, RunStats } from '../../types/game';

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
  foreignLanguage: null,
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
  foreignLanguage: null,
};

const emptyStats: RunStats = {
  miniGamesCompleted: [],
  promptsAnswered: 0,
  liesTold: 0,
  explanationsGiven: 0,
  guiltTripsTaken: 0,
  interruptionsSurvived: 0,
  chargerUsed: false,
  spamsReceived: 0,
  difficulty: 'dad',
};

describe('Achievements', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  it('unlocks "fixed_it" on a win', () => {
    const newly = checkAchievements(wonState, emptyStats);
    expect(newly.some((a) => a.id === 'fixed_it')).toBe(true);
  });

  it('unlocks "battery_death" on a loss', () => {
    const newly = checkAchievements(lostState, { ...emptyStats, difficulty: 'mum' });
    expect(newly.some((a) => a.id === 'battery_death')).toBe(true);
  });

  it('does not re-unlock already-unlocked achievements', () => {
    checkAchievements(wonState, emptyStats);
    const newly = checkAchievements(wonState, emptyStats);
    expect(newly).toHaveLength(0);
  });

  it('persists unlocked ids to localStorage', () => {
    checkAchievements(wonState, emptyStats);
    const unlocked = loadUnlocked();
    expect(unlocked.length).toBeGreaterThan(0);
  });

  it('does NOT unlock behavioral achievements without the required action', () => {
    const newly = checkAchievements(wonState, emptyStats);
    // emptyStats has no mini-games completed, no lies, no guilt trips, etc.
    expect(newly.some((a) => a.id === 'tab_closer')).toBe(false);
    expect(newly.some((a) => a.id === 'air_fryer_lie')).toBe(false);
    expect(newly.some((a) => a.id === 'guilt_trip_victim')).toBe(false);
    expect(newly.some((a) => a.id === 'charger_user')).toBe(false);
    expect(newly.some((a) => a.id === 'interruption_martyr')).toBe(false);
  });

  it('unlocks "tab_closer" when infinite-tab-sweep is completed', () => {
    const stats: RunStats = { ...emptyStats, miniGamesCompleted: ['infinite-tab-sweep'] };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'tab_closer')).toBe(true);
  });

  it('unlocks "air_fryer_lie" when a lie is told', () => {
    const stats: RunStats = { ...emptyStats, liesTold: 1 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'air_fryer_lie')).toBe(true);
  });

  it('unlocks "guilt_trip_victim" when a guilt trip is taken', () => {
    const stats: RunStats = { ...emptyStats, guiltTripsTaken: 1 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'guilt_trip_victim')).toBe(true);
  });

  it('unlocks "charger_user" when charger is used', () => {
    const stats: RunStats = { ...emptyStats, chargerUsed: true };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'charger_user')).toBe(true);
  });

  it('unlocks "interruption_martyr" when 3+ interruptions survived', () => {
    const stats: RunStats = { ...emptyStats, interruptionsSurvived: 3 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'interruption_martyr')).toBe(true);
  });

  it('does NOT unlock "interruption_martyr" with only 2 interruptions', () => {
    const stats: RunStats = { ...emptyStats, interruptionsSurvived: 2 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'interruption_martyr')).toBe(false);
  });

  it('unlocks "ghost_touch" when winning Grandma with low battery', () => {
    const grandmaState: GameEngineState = { ...wonState, difficulty: 'grandma', batteryLevel: 15 };
    const stats: RunStats = { ...emptyStats, difficulty: 'grandma' };
    const newly = checkAchievements(grandmaState, stats);
    expect(newly.some((a) => a.id === 'ghost_touch')).toBe(true);
  });

  it('does NOT unlock "ghost_touch" on Dad difficulty', () => {
    const stats: RunStats = { ...emptyStats, difficulty: 'dad' };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'ghost_touch')).toBe(false);
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
