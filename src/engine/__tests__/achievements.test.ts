import { describe, it, expect, beforeEach } from 'vitest';
import { ACHIEVEMENTS, checkAchievements, loadUnlocked, saveUnlocked, achievementById } from '../achievements';
import type { GameEngineState, RunStats, MiniGameType } from '../../types/game';

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

const baseState: GameEngineState = {
  gameState: 'playing',
  difficulty: 'dad',
  timeRemaining: 30,
  batteryLevel: 50,
  isPaused: false,
  activeIssues: [],
  completedIssues: [],
  currentMiniGame: null,
  foreignLanguage: null,
};

const wonState: GameEngineState = { ...baseState, gameState: 'results', batteryLevel: 45 };
const lostState: GameEngineState = { ...baseState, gameState: 'results', batteryLevel: 0 };

const emptyStats: RunStats = {
  miniGamesCompleted: [],
  promptsAnswered: 0,
  liesTold: 0,
  explanationsGiven: 0,
  guiltTripsTaken: 0,
  interruptionsSurvived: 0,
  chargerUsed: false,
  spamsReceived: 0,
  chineseEasterEgg: false,
  difficulty: 'dad',
  adsTriggered: 0,
  decoysTapped: 0,
  wrongLanguagePicks: 0,
  wrongToggles: 0,
  importantSelected: false,
};

describe('Achievements', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  it('unlocks "fixed_it" on a win without charger', () => {
    const newly = checkAchievements(wonState, emptyStats);
    expect(newly.some((a) => a.id === 'fixed_it')).toBe(true);
  });

  it('does not unlock "fixed_it" if charger was used', () => {
    const stats = { ...emptyStats, chargerUsed: true };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'fixed_it')).toBe(false);
  });

  it('unlocks "battery_god" with 80%+ battery', () => {
    const state = { ...wonState, batteryLevel: 85 };
    const newly = checkAchievements(state, emptyStats);
    expect(newly.some((a) => a.id === 'battery_god')).toBe(true);
  });

  it('unlocks "speedrun" with 30+ seconds remaining', () => {
    const state = { ...wonState, timeRemaining: 35 };
    const newly = checkAchievements(state, emptyStats);
    expect(newly.some((a) => a.id === 'speedrun')).toBe(true);
  });

  it('does not unlock "speedrun" with less than 30 seconds', () => {
    const state = { ...wonState, timeRemaining: 20 };
    const newly = checkAchievements(state, emptyStats);
    expect(newly.some((a) => a.id === 'speedrun')).toBe(false);
  });

  it('unlocks "battery_death" only on Grandma', () => {
    const stats = { ...emptyStats, difficulty: 'grandma' as const };
    const newly = checkAchievements(lostState, stats);
    expect(newly.some((a) => a.id === 'battery_death')).toBe(true);
  });

  it('does not unlock "battery_death" on Dad', () => {
    const newly = checkAchievements(lostState, emptyStats);
    expect(newly.some((a) => a.id === 'battery_death')).toBe(false);
  });

  it('unlocks "dad_defeat" on Dad with battery death', () => {
    const newly = checkAchievements(lostState, emptyStats);
    expect(newly.some((a) => a.id === 'dad_defeat')).toBe(true);
  });

  it('unlocks "air_fryer_lie" with 3+ lies', () => {
    const stats = { ...emptyStats, liesTold: 3 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'air_fryer_lie')).toBe(true);
  });

  it('does not unlock "air_fryer_lie" with only 1 lie', () => {
    const stats = { ...emptyStats, liesTold: 1 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'air_fryer_lie')).toBe(false);
  });

  it('unlocks "tab_closer" only with zero ads triggered', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['infinite-tab-sweep'] as MiniGameType[], adsTriggered: 0 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'tab_closer')).toBe(true);
  });

  it('does not unlock "tab_closer" if ads were triggered', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['infinite-tab-sweep'] as MiniGameType[], adsTriggered: 2 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'tab_closer')).toBe(false);
  });

  it('unlocks "clean_master_removal" only with zero decoys tapped', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['antivirus-whack-a-mole'] as MiniGameType[], decoysTapped: 0 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'clean_master_removal')).toBe(true);
  });

  it('does not unlock "clean_master_removal" if decoys were tapped', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['antivirus-whack-a-mole'] as MiniGameType[], decoysTapped: 1 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'clean_master_removal')).toBe(false);
  });

  it('unlocks "flashlight_hunter" only with zero wrong toggles', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['physical-override'] as MiniGameType[], wrongToggles: 0 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'flashlight_hunter')).toBe(true);
  });

  it('does not unlock "flashlight_hunter" if wrong toggles were made', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['physical-override'] as MiniGameType[], wrongToggles: 2 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'flashlight_hunter')).toBe(false);
  });

  it('unlocks "duplicate_purge" only without selecting important photo', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['duplicate-doom'] as MiniGameType[], importantSelected: false };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'duplicate_purge')).toBe(true);
  });

  it('does not unlock "duplicate_purge" if important photo was selected', () => {
    const stats = { ...emptyStats, miniGamesCompleted: ['duplicate-doom'] as MiniGameType[], importantSelected: true };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'duplicate_purge')).toBe(false);
  });

  it('unlocks "interruption_martyr" with 5+ interruptions', () => {
    const stats = { ...emptyStats, interruptionsSurvived: 5 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'interruption_martyr')).toBe(true);
  });

  it('does not unlock "interruption_martyr" with only 3 interruptions', () => {
    const stats = { ...emptyStats, interruptionsSurvived: 3 };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'interruption_martyr')).toBe(false);
  });

  it('unlocks "chinese_whisperer" on a win with the Chinese Easter Egg', () => {
    const stats = { ...emptyStats, chineseEasterEgg: true, difficulty: 'grandma' as const };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'chinese_whisperer')).toBe(true);
  });

  it('does not unlock "chinese_whisperer" without the Easter Egg', () => {
    const stats = { ...emptyStats, chineseEasterEgg: false, difficulty: 'grandma' as const };
    const newly = checkAchievements(wonState, stats);
    expect(newly.some((a) => a.id === 'chinese_whisperer')).toBe(false);
  });

  it('persists unlocked achievements', () => {
    checkAchievements(wonState, emptyStats);
    const unlocked = loadUnlocked();
    expect(unlocked.length).toBeGreaterThan(0);
  });

  it('does not re-unlock already unlocked achievements', () => {
    checkAchievements(wonState, emptyStats);
    const newly = checkAchievements(wonState, emptyStats);
    expect(newly.length).toBe(0);
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
