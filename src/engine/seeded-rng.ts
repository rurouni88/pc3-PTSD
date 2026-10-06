// Seeded random number generator — sfc32 with SplitMix32 seed expansion.
//
// sfc32 (Shuffle and Combine 32-bit): 6 x 32-bit state, fast, good distribution.
// SplitMix32: expands a single 32-bit seed into 6 well-distributed state words.
//
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

// --- SplitMix32: seed expansion ---
// Takes a 32-bit state, advances it, and produces a well-distributed 32-bit output.
// Used to initialize the 6 sfc32 state words from a single seed.
function splitmix32(state: number): [number, number] {
  state = (state + 0x9e3779b9) | 0;
  let z = state;
  z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
  z ^= z >>> 13;
  z = Math.imul(z, 0xc2b2ae35);
  z ^= z >>> 16;
  return [state, z >>> 0];
}

// Expand a single 32-bit seed into 6 sfc32 state words.
function seedToSfcState(seed: number): number[] {
  const state: number[] = [];
  let s = seed;
  for (let i = 0; i < 6; i++) {
    [s, state[i]] = splitmix32(s);
  }
  return state;
}

// --- sfc32: the PRNG ---
// 6 x 32-bit state. Returns a 32-bit unsigned integer.
// Mutates the state array in place.
function sfc32Step(state: number[]): number {
  let a = state[0], b = state[1], c = state[2];
  let d = state[3], e = state[4], f = state[5];

  const t = (a + b | 0) + f;
  f = (f + 1) | 0;
  a = d;
  d = c;
  c = (b << 13 | b >>> 19);
  b = (b + t) | 0;
  e = (e ^ t ^ (t >>> 16)) | 0;

  state[0] = a; state[1] = b; state[2] = c;
  state[3] = d; state[4] = e; state[5] = f;

  return e >>> 0;
}

// --- Public API ---

export interface RngSnapshot {
  seed: string;
  state: number[] | null;
}

export const RngEngine = {
  seed: '',
  _state: null as number[] | null,

  generateSeed(): string {
    let result = '';
    for (let i = 0; i < SEED_LENGTH; i++) {
      result += SEED_CHARSET[Math.floor(Math.random() * SEED_CHARSET.length)];
    }
    return result;
  },

  seedWith(seed: string): void {
    this.seed = seed;
    this._state = seedToSfcState(parseSeed(seed));
  },

  unseed(): void {
    this.seed = '';
    this._state = null;
  },

  random(): number {
    if (this._state === null) return Math.random();
    return sfc32Step(this._state) / 4294967296;
  },

  /**
   * Generate a large batch of random numbers in a tight loop.
   * Inlines sfc32 to avoid per-call function overhead.
   * Use for procedural generation, bulk shuffles, or any case where
   * you need thousands+ of values at once.
   */
  randomBulk(count: number): Float32Array {
    const out = new Float32Array(count);
    if (this._state === null) {
      for (let i = 0; i < count; i++) out[i] = Math.random();
      return out;
    }
    const s = this._state;
    for (let i = 0; i < count; i++) {
      let a = s[0], b = s[1], c = s[2];
      let d = s[3], e = s[4], f = s[5];
      const t = (a + b | 0) + f;
      f = (f + 1) | 0;
      a = d;
      d = c;
      c = (b << 13 | b >>> 19);
      b = (b + t) | 0;
      e = (e ^ t ^ (t >>> 16)) | 0;
      s[0] = a; s[1] = b; s[2] = c;
      s[3] = d; s[4] = e; s[5] = f;
      out[i] = (e >>> 0) / 4294967296;
    }
    return out;
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
    return { seed: this.seed, state: this._state ? [...this._state] : null };
  },

  setState(snap: RngSnapshot | null | undefined): void {
    if (!snap || !snap.seed) {
      this.unseed();
      return;
    }
    this.seed = snap.seed;
    if (snap.state && snap.state.length === 6) {
      this._state = [...snap.state];
    } else {
      this._state = seedToSfcState(parseSeed(snap.seed));
    }
  },

  parseSeed(seed: string): number {
    return parseSeed(seed);
  },

  formatSeed(num: number): string {
    return formatSeed(num);
  },
};
