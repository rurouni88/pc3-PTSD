import { Difficulty } from '../types/game';
import { levels } from '../config/levels';

interface LevelSelectProps {
  onSelect: (difficulty: Difficulty) => void;
}

const difficultyEmojis: Record<Difficulty, string> = {
  dad: '👨',
  mum: '👩',
  grandma: '👵',
};

const difficultyColors: Record<Difficulty, string> = {
  dad: 'border-green-500',
  mum: 'border-yellow-500',
  grandma: 'border-red-500',
};

export function LevelSelect({ onSelect }: LevelSelectProps) {
  const levelEntries = Object.entries(levels) as [Difficulty, (typeof levels)[Difficulty]][];

  return (
    <div className="h-dvh flex flex-col bg-primary select-none">
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <h1 className="text-2xl font-bold text-primary text-center mb-2">
          Choose Your Relative
        </h1>
        <p className="text-sm text-secondary text-center mb-6">
          You have one afternoon. Make it count.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          {levelEntries.map(([key, level]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex items-center gap-4 p-4 bg-secondary rounded-2xl border-2 ${difficultyColors[key]} active:scale-95 transition-transform`}
            >
              <span className="text-4xl">{difficultyEmojis[key]}</span>
              <div className="flex-1 text-left">
                <p className="text-lg font-bold text-primary">{level.name}</p>
                <p className="text-xs text-secondary">{level.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="pb-6 text-center text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}
