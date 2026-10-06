// Save/Load system — auto-saves the live game to localStorage.
// Snapshots the PRNG position so a seeded run resumes from the exact
// same point in the sequence.

import type { GameEngineState } from '../types/game';
import { RngEngine, type RngSnapshot } from './seeded-rng';

interface SaveShape {
  state: GameEngineState;
  rng: RngSnapshot | null;
  timestamp: number;
}

export class SaveData {
  constructor(
    public state: GameEngineState,
    public rng: RngSnapshot | null,
    public timestamp: number,
  ) {}

  static parse(data: unknown): SaveData | null {
    const errors = SaveData.validate(data);
    if (errors.length > 0) {
      console.error('[PTSD] Save data invalid:', errors.join('; '));
      return null;
    }
    const save = data as SaveShape;
    return new SaveData(save.state, save.rng ?? null, save.timestamp);
  }

  static validate(data: unknown): string[] {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return ['save is not an object'];
    }
    const save = data as Record<string, unknown>;
    const errors: string[] = [];

    if (typeof save.timestamp !== 'number') errors.push('timestamp is not a number');

    const state = save.state as Record<string, unknown> | undefined;
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      errors.push('state is missing');
    } else {
      if (typeof state.timeRemaining !== 'number') errors.push('state.timeRemaining is not a number');
      if (typeof state.batteryLevel !== 'number') errors.push('state.batteryLevel is not a number');
      if (!Array.isArray(state.activeIssues)) errors.push('state.activeIssues is not an array');
      if (!Array.isArray(state.completedIssues)) errors.push('state.completedIssues is not an array');
    }

    const rng = save.rng as Record<string, unknown> | undefined;
    if (rng !== undefined && rng !== null) {
      if (typeof rng.seed !== 'string') errors.push('rng.seed is not a string');
      if (rng.state !== null) {
        if (!Array.isArray(rng.state) || rng.state.length !== 6 || rng.state.some((v) => typeof v !== 'number')) {
          errors.push('rng.state is not a 6-element number array or null');
        }
      }
    }

    return errors;
  }
}

export const SaveSystem = {
  SAVE_KEY: 'ptsd_save',

  save(state: GameEngineState): void {
    try {
      const saveData: SaveShape = {
        state: { ...state },
        rng: RngEngine.getState(),
        timestamp: Date.now(),
      };
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.warn('[PTSD] Failed to save:', e);
    }
  },

  load(): { state: GameEngineState; rng: RngSnapshot | null } | null {
    const raw = localStorage.getItem(this.SAVE_KEY);
    if (!raw) return null;
    try {
      const save = SaveData.parse(JSON.parse(raw));
      if (!save) return null;
      return { state: save.state, rng: save.rng };
    } catch (e) {
      console.error('[PTSD] Failed to load save:', e);
      return null;
    }
  },

  hasSave(): boolean {
    try {
      return localStorage.getItem(this.SAVE_KEY) !== null;
    } catch {
      return false;
    }
  },

  deleteSave(): void {
    try {
      localStorage.removeItem(this.SAVE_KEY);
    } catch {
      // ignore
    }
  },
};
