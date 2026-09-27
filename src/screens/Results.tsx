import { Difficulty } from '../types/game';
import { MetaStore } from '../engine/meta';
import type { Achievement } from '../engine/achievements';

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

export function Results({ result, difficulty, onReplay, onMenu }: ResultsProps) {
  const meta = MetaStore.load();
  const bestTime = meta.bestTimes[difficulty];
  const bestBattery = meta.bestBatteries[difficulty];

  return (
    <div className="h-dvh flex flex-col items-center bg-primary p-6 select-none overflow-y-auto">
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
          <p className="text-sm font-mono text-primary">{result.seed}</p>
        </div>
      )}

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

      <div className="flex gap-4 w-full max-w-xs mt-auto mb-8">
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

      <p className="text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}
