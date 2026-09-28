// Passive battery drain events — spam, ghost touches, auto-updates, background drain.
// All randomness via RngEngine.random().

import { RngEngine } from './seeded-rng';
import type { Difficulty } from '../types/game';

export interface DrainEvent {
  type: 'spam' | 'ghost' | 'update' | 'background';
  amount: number;
  message: string;
}

interface DrainConfig {
  spamIntervalMs: number;
  spamChance: number;       // per interval check
  spamDrain: number;        // per spam event
  ghostIntervalMs: number;
  ghostChance: number;      // per interval check
  ghostDrain: number;
  updateIntervalMs: number;
  updateChance: number;     // per interval check
  updateDrain: number;
  updateMessages: string[];
  backgroundRate: number;   // per tick (0.01/tick etc)
}

const configs: Record<Difficulty, DrainConfig> = {
  dad: {
    spamIntervalMs: 6000,
    spamChance: 0.5,
    spamDrain: 0.5,
    ghostIntervalMs: 99999,  // disabled
    ghostChance: 0,
    ghostDrain: 0,
    updateIntervalMs: 20000,
    updateChance: 0.3,
    updateDrain: 2,
    updateMessages: [
      'RAM Booster updating…',
      'Weather widget sync…',
      'Golf scores refreshing…',
    ],
    backgroundRate: 0.002,
  },
  mum: {
    spamIntervalMs: 5000,
    spamChance: 0.6,
    spamDrain: 0.7,
    ghostIntervalMs: 99999,  // disabled
    ghostChance: 0,
    ghostDrain: 0,
    updateIntervalMs: 15000,
    updateChance: 0.4,
    updateDrain: 3,
    updateMessages: [
      'iCloud backup running…',
      'Family sharing update…',
      'Photos syncing…',
    ],
    backgroundRate: 0.003,
  },
  grandma: {
    spamIntervalMs: 4000,
    spamChance: 0.7,
    spamDrain: 1,
    ghostIntervalMs: 10000,
    ghostChance: 0.3,
    ghostDrain: 2,
    updateIntervalMs: 12000,
    updateChance: 0.5,
    updateDrain: 3,
    updateMessages: [
      'Family Photo Protector updating…',
      'Grandkids album syncing…',
      'Tea recipe app refreshing…',
    ],
    backgroundRate: 0.005,
  },
};

export function getDrainConfig(difficulty: Difficulty): DrainConfig {
  return configs[difficulty];
}

export function checkDrainEvents(difficulty: Difficulty): DrainEvent | null {
  const cfg = configs[difficulty];
  const roll = RngEngine.random();

  // Spam (highest priority)
  if (roll < cfg.spamChance) {
    return {
      type: 'spam',
      amount: cfg.spamDrain,
      message: 'Spam notification received',
    };
  }

  // Ghost touches (Grandma only)
  if (difficulty === 'grandma' && roll < cfg.spamChance + cfg.ghostChance) {
    return {
      type: 'ghost',
      amount: cfg.ghostDrain,
      message: '👵 Ghost touch!',
    };
  }

  // Auto-update
  if (roll < cfg.spamChance + cfg.ghostChance + cfg.updateChance) {
    const msg = cfg.updateMessages[Math.floor(RngEngine.random() * cfg.updateMessages.length)];
    return {
      type: 'update',
      amount: cfg.updateDrain,
      message: msg,
    };
  }

  return null;
}

export function getBackgroundDrain(difficulty: Difficulty, elapsedSeconds: number): number {
  const cfg = configs[difficulty];
  // Background drain increases over time (phone gets "slower")
  const timeMultiplier = 1 + elapsedSeconds / 120; // 1x at start, 2x at 120s
  return cfg.backgroundRate * timeMultiplier;
}
