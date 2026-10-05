import { useEffect } from 'react';
import { Difficulty } from '../types/game';
import { MetaStore } from '../engine/meta';
import { RngEngine } from '../engine/seeded-rng';
import type { Achievement } from '../engine/achievements';
import { CopyButton } from '../components/CopyButton';
import { AftermathMessage } from '../components/AftermathMessage';
import { playHaptic } from '../engine/haptics';
import { playVictoryJingle, playDefeatJingle } from '../engine/bgm';
import { showToast } from '../engine/toast';

interface ResultsProps {
  result: {
    success: boolean;
    timeRemaining: number;
    batteryLevel: number;
    seed: string;
    achievements: Achievement[];
  };
  difficulty: Difficulty;
  onReplay: () => void;
  onMenu: () => void;
}

const difficultyNames: Record<Difficulty, string> = {
  dad: 'Dad',
  mum: 'Mum',
  grandma: 'Grandma',
};

const WIN_LINES = [
  'Phone fixed. Relative unimpressed.',
  'Survived the afternoon. Barely.',
  'The phone works. The relationship may not.',
  'Fixed. They broke it again by Tuesday.',
];

const LOSE_LINES = [
  'The phone is still broken. You are not a technician.',
  'Battery died. Dignity died with it.',
  'You lost. The RAM Booster sends its regards.',
  'Grandma has taken the phone and is showing it to Linda.',
];

function buildRunSummary(
  result: { success: boolean; timeRemaining: number; batteryLevel: number; seed: string },
  difficulty: Difficulty
): string {
  const lines = result.success ? WIN_LINES : LOSE_LINES;
  const line = lines[Math.floor(RngEngine.random() * lines.length)];
  const time = Math.round(result.timeRemaining);
  const battery = Math.round(result.batteryLevel);

  return [
    `📱💀 PTSD — ${difficultyNames[difficulty]} (${result.success ? 'WIN' : 'LOSS'})`,
    `⏱️ ${time}s left · 🔋 ${battery}% battery`,
    `🎲 Seed: ${result.seed}`,
    `\"${line}\"`,
  ].join('\n');
}

export function Results({ result, difficulty, onReplay, onMenu }: ResultsProps) {
  useEffect(() => {
    if (result.success) {
      playVictoryJingle();
    } else {
      playDefeatJingle();
      playHaptic('defeat');
    }
    // Toast for newly unlocked achievements
    for (const ach of result.achievements) {
      showToast(`🏅 ${ach.emoji} ${ach.title}`, 'success');
    }
  }, [result.success, result.achievements]);

  const meta = MetaStore.load();
  const bestTime = meta.bestTimes[difficulty];
  const bestBattery = meta.bestBatteries[difficulty];

  return (
    <div className="h-full flex flex-col items-center bg-primary p-6 select-none overflow-y-auto">
      <div className="flex flex-col items-center mt-8">
        <span className="text-6xl mb-4">{result.success ? '🎉' : '💀'}</span>
        <h1 className={`text-3xl font-bold mb-2 ${result.success ? 'text-accent-green' : 'text-accent-red'}`}>
          {result.success ? 'Phone Fixed!' : 'Game Over'}
        </h1>
        <p className="text-sm text-secondary text-center max-w-xs">
          {result.success
            ? `${difficultyNames[difficulty]} is impressed. Barely.`
            : `The phone is still broken. ${difficultyNames[difficulty]} sighs.`}
        </p>
      </div>

      <div className="flex gap-8 my-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{Math.round(result.timeRemaining)}s</p>
          <p className="text-xs text-muted">Time Left</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{Math.round(result.batteryLevel)}%</p>
          <p className="text-xs text-muted">Battery</p>
        </div>
      </div>

      {result.seed && (
        <div className="mb-4 text-center">
          <p className="text-xs text-muted">Run seed</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm font-mono text-primary">{result.seed}</p>
            <CopyButton text={result.seed} />
          </div>
        </div>
      )}

      <div className="mb-4 text-center">
        <CopyButton text={buildRunSummary(result, difficulty)} label="Copy Summary" />
      </div>

      {bestTime > 0 && (
        <div className="flex gap-6 mb-4">
          <div className="text-center">
            <p className="text-xs text-accent-yellow">Best time</p>
            <p className="text-sm text-primary">{bestTime}s</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-accent-yellow">Best battery</p>
            <p className="text-sm text-primary">{bestBattery}%</p>
          </div>
        </div>
      )}

      {result.achievements.length > 0 && (
        <div className="w-full max-w-xs mb-6">
          <p className="text-xs text-muted mb-2">New achievements:</p>
          {result.achievements.map((a) => (
            <div key={a.id} className="flex items-center gap-2 mb-2">
              <span className="text-xl">{a.emoji}</span>
              <div>
                <p className="text-sm font-bold text-primary">{a.title}</p>
                <p className="text-xs text-secondary">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AftermathMessage
        difficulty={difficulty}
        outcome={result.success ? 'win' : result.batteryLevel <= 0 ? 'battery' : 'timeout'}
      />

      <div className="flex gap-4 w-full max-w-xs mt-6 mb-4">
        <button
          onClick={onMenu}
          className="flex-1 py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
        >
          Menu
        </button>
        <button
          onClick={onReplay}
          className="flex-1 py-3 bg-accent-red text-primary font-bold rounded-xl active:scale-95 transition-transform"
        >
          Retry
        </button>
      </div>

      <p className="text-xs text-muted pb-4">
        {meta.totalRuns} run{meta.totalRuns !== 1 ? 's' : ''} total · {meta.wins}W / {meta.losses}L
      </p>

      <p className="text-center text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}
