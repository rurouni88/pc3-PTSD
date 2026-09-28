import { useState, useRef, useEffect, useCallback } from 'react';
import { Hint } from '../Hint';
import { RngEngine } from '../../engine/seeded-rng';
import { playSound } from '../../engine/sound';
import type { Difficulty, ForeignLanguage, MiniGameQuality } from '../../types/game';

interface FingerprintScanProps {
  difficulty: string;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

type Modifier = 'none' | 'lotion' | 'toast_crumbs' | 'sweat' | 'flour' | 'mud';

interface ModifierConfig {
  label: string;
  emoji: string;
  clickBonus: number; // % added per click (normally 5)
  drainPerTick: number; // % drained per tick while active
}

const modifiers: Record<Modifier, ModifierConfig> = {
  none: { label: 'Clean', emoji: '✨', clickBonus: 5, drainPerTick: 0 },
  lotion: { label: 'Lotion', emoji: '🧴', clickBonus: 1, drainPerTick: 0.5 },
  toast_crumbs: { label: 'Toast crumbs', emoji: '🍞', clickBonus: 1, drainPerTick: 0.3 },
  sweat: { label: 'Sweat', emoji: '💦', clickBonus: 2, drainPerTick: 0.4 },
  flour: { label: 'Flour', emoji: '🌾', clickBonus: 1, drainPerTick: 0.6 },
  mud: { label: 'Mud', emoji: '🟤', clickBonus: 0, drainPerTick: 1 },
};

const BAD_MODIFIERS: Modifier[] = ['lotion', 'toast_crumbs', 'sweat', 'flour', 'mud'];

const difficultyConfig: Record<string, { modifierIntervalMs: number; maxModifiers: number }> = {
  dad: { modifierIntervalMs: 4000, maxModifiers: 3 },
  mum: { modifierIntervalMs: 3000, maxModifiers: 4 },
  grandma: { modifierIntervalMs: 2500, maxModifiers: 5 },
};

const completionQuotes: Record<string, string> = {
  dad: 'Fingerprint registered. Dad says his thumb "smells like the grill".',
  mum: 'Touch ID set! Mum used her ring finger. "It\'s the lucky one."',
  grandma: 'Fingerprint done. Grandma used her palm. It worked. Barely.',
};

export function FingerprintScan({ difficulty, foreignLanguage, onComplete, onCancel }: FingerprintScanProps) {
  const [percentage, setPercentage] = useState(0);
  const [modifier, setModifier] = useState<Modifier>('none');
  const [modifiersTriggered, setModifiersTriggered] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [wiping, setWiping] = useState(false);

  const percentageRef = useRef(0);
  const modifierRef = useRef<Modifier>('none');
  const modifiersTriggeredRef = useRef(0);
  const completedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const config = difficultyConfig[difficulty] ?? difficultyConfig.dad;

  // Modifier spawner
  useEffect(() => {
    if (completed) return;

    intervalRef.current = setInterval(() => {
      if (completedRef.current) return;
      if (modifierRef.current === 'none') {
        // Spawn a random bad modifier
        const pick = BAD_MODIFIERS[Math.floor(RngEngine.random() * BAD_MODIFIERS.length)];
        modifierRef.current = pick;
        setModifier(pick);
        modifiersTriggeredRef.current += 1;
        setModifiersTriggered(modifiersTriggeredRef.current);
        playSound('notification');
      }
    }, config.modifierIntervalMs);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [completed, config.modifierIntervalMs]);

  // Drain tick (every 500ms)
  useEffect(() => {
    if (completed) return;

    const drainInterval = setInterval(() => {
      if (completedRef.current) return;
      const mod = modifiers[modifierRef.current];
      if (mod.drainPerTick > 0) {
        percentageRef.current = Math.max(0, percentageRef.current - mod.drainPerTick);
        setPercentage(percentageRef.current);
      }
    }, 500);

    return () => clearInterval(drainInterval);
  }, [completed]);

  const handleTap = useCallback(() => {
    if (completedRef.current || wiping) return;
    const mod = modifiers[modifierRef.current];
    const newPct = Math.min(100, percentageRef.current + mod.clickBonus);
    percentageRef.current = newPct;
    setPercentage(newPct);
    playSound('click');

    if (newPct >= 100) {
      completedRef.current = true;
      setCompleted(true);
      playSound('success');
      setTimeout(() => onComplete({ distractionsTriggered: modifiersTriggeredRef.current }), 1500);
    }
  }, [wiping, onComplete]);

  const handleWipe = useCallback(() => {
    if (completedRef.current || modifierRef.current === 'none' || wiping) return;
    setWiping(true);
    playSound('click');
    // Wipe takes a moment
    setTimeout(() => {
      modifierRef.current = 'none';
      setModifier('none');
      setWiping(false);
    }, 800);
  }, [wiping]);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">👆</div>
        <p className="text-sm text-primary text-center font-medium">{completionQuotes[difficulty] ?? completionQuotes.dad}</p>
        {modifiersTriggered > 0 && (
          <p className="text-xs text-muted">{modifiersTriggered} smudge event{modifiersTriggered > 1 ? 's' : ''} survived</p>
        )}
      </div>
    );
  }

  const activeMod = modifiers[modifier];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6 select-none">
      <Hint>Tap the sensor to scan. Wipe smudges to keep it clean!</Hint>

      {/* Modifier status */}
      <div className="flex items-center gap-2 h-8">
        {modifier !== 'none' ? (
          <span className="text-sm px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">
            {activeMod.emoji} {activeMod.label} — {activeMod.clickBonus}%/tap
          </span>
        ) : (
          <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-medium">
            ✨ Clean — 5%/tap
          </span>
        )}
      </div>

      {/* Fingerprint sensor */}
      <button
        onClick={handleTap}
        disabled={wiping}
        className={`relative w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all active:scale-95 ${
          wiping ? 'border-yellow-400 bg-yellow-400/10' : 'border-blue-400 bg-blue-400/10'
        }`}
      >
        {/* Fingerprint icon */}
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400">
          <path d="M12 11c0 3.5 0 5 0 7" strokeLinecap="round" />
          <path d="M8 11a4 4 0 0 1 8 0c0 2 0 4-.5 6" strokeLinecap="round" />
          <path d="M5 11a7 7 0 0 1 14 0c0 1.5 0 3-.5 5" strokeLinecap="round" />
          <path d="M12 11v2" strokeLinecap="round" />
          <path d="M9.5 13c0 2-.5 3.5-1 5" strokeLinecap="round" />
          <path d="M14.5 13c0 2 .5 3.5 1 5" strokeLinecap="round" />
        </svg>

        {/* Percentage overlay */}
        <span className="absolute bottom-2 text-xs font-bold text-primary">
          {Math.round(percentage)}%
        </span>

        {/* Wipe animation */}
        {wiping && (
          <span className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">👕</span>
        )}
      </button>

      {/* Progress bar */}
      <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Wipe button */}
      <button
        onClick={handleWipe}
        disabled={modifier === 'none' || wiping}
        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          modifier === 'none'
            ? 'bg-secondary text-muted opacity-50 cursor-not-allowed'
            : wiping
            ? 'bg-yellow-400/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400 active:scale-95'
        }`}
      >
        {wiping ? 'Wiping...' : '👕 Wipe Screen with Shirt'}
      </button>

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-muted text-xs"
      >
        ✕
      </button>
    </div>
  );
}
