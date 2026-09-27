// Seeded random number generator — mulberry32.
// Fast, deterministic, good-enough quality for game use.
// All dice rolls, shuffles, event picks, and loot rolls go through this
// engine so a run is fully reproducible from its 8-character seed.
// Unseeded (the default), it falls back to Math.random().

const SEED_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SEED_LENGTH = 8;

function parseSeed(seed: string): number {
  let result = 0;
  for (let i = 0; i < seed.length; i++) {
    const idx = SEED_CHARSET.indexOf(seed[i]);
    if (idx === -1) return 0;
    result = result * SEED_CHARSET.length + idx;
  }
  return result >>> 0;
}

function formatSeed(num: number): string {
  let n = num >>> 0;
  const chars: string[] = [];
  for (let i = 0; i < SEED_LENGTH; i++) {
    chars.push(SEED_CHARSET[n % SEED_CHARSET.length]);
    n = Math.floor(n / SEED_CHARSET.length);
  }
  return chars.reverse().join('');
}

export interface RngSnapshot {
  seed: string;
  state: number | null;
}

export const RngEngine = {
  seed: '',
  _state: null as number | null,

  generateSeed(): string {
    let result = '';
    for (let i = 0; i < SEED_LENGTH; i++) {
      result += SEED_CHARSET[Math.floor(Math.random() * SEED_CHARSET.length)];
    }
    return result;
  },

  seedWith(seed: string): void {
    this.seed = seed;
    this._state = parseSeed(seed);
  },

  unseed(): void {
    this.seed = '';
    this._state = null;
  },

  random(): number {
    if (this._state === null) return Math.random();
    this._state = (this._state + 0x6D2B79F5) | 0;
    let t = this._state;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  },

  dRoll(sides: number): number {
    return Math.floor(this.random() * sides) + 1;
  },

  shuffle<T>(arr: T[]): T[] {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  },

  getState(): RngSnapshot {
    return { seed: this.seed, state: this._state };
  },

  setState(snap: RngSnapshot | null | undefined): void {
    if (!snap || !snap.seed) {
      this.unseed();
      return;
    }
    this.seed = snap.seed;
    this._state = snap.state !== null ? snap.state : parseSeed(snap.seed);
  },

  parseSeed(seed: string): number {
    return parseSeed(seed);
  },

  formatSeed(num: number): string {
    return formatSeed(num);
  },
};
