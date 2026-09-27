import { Difficulty } from '../types/game';

interface ResultsProps {
  success: boolean;
  difficulty: Difficulty;
  timeRemaining: number;
  batteryLevel: number;
  onReplay: () => void;
  onMenu: () => void;
}

const difficultyNames: Record<Difficulty, string> = {
  dad: 'Dad',
  mum: 'Mum',
  grandma: 'Grandma',
};

export function Results({ success, difficulty, timeRemaining, batteryLevel, onReplay, onMenu }: ResultsProps) {
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-primary p-6 select-none">
      <span className="text-6xl mb-6">{success ? '🎉' : '💀'}</span>
      <h1 className={`text-3xl font-bold mb-2 ${success ? 'text-accent-green' : 'text-accent-red'}`}>
        {success ? 'Phone Fixed!' : 'Game Over'}
      </h1>
      <p className="text-sm text-secondary mb-8">
        {success
          ? `${difficultyNames[difficulty]} is impressed. Barely.`
          : `The phone is still broken. ${difficultyNames[difficulty]} sighs.`}
      </p>

      <div className="flex gap-8 mb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{Math.round(timeRemaining)}s</p>
          <p className="text-xs text-muted">Time Left</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{Math.round(batteryLevel)}%</p>
          <p className="text-xs text-muted">Battery</p>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={onMenu}
          className="flex-1 py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
        >
          Menu
        </button>
        <button
          onClick={onReplay}
          className="flex-1 py-3 bg-accent-red text-white font-bold rounded-xl active:scale-95 transition-transform"
        >
          Retry
        </button>
      </div>

      <p className="absolute bottom-6 text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}
