import { useState } from 'react';
import { Difficulty } from '../types/game';
import { levels } from '../config/levels';

interface LevelSelectProps {
  onSelect: (difficulty: Difficulty, seed?: string) => void;
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
  const [seedInput, setSeedInput] = useState('');
  const [showSeedInput, setShowSeedInput] = useState(false);

  const levelEntries = Object.entries(levels) as [Difficulty, (typeof levels)[Difficulty]][];

  const handleSelect = (key: Difficulty) => {
    const seed = seedInput.trim().toUpperCase();
    onSelect(key, seed.length === 8 ? seed : undefined);
  };

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
              onClick={() => handleSelect(key)}
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

        <div className="w-full max-w-xs">
          <button
            onClick={() => setShowSeedInput(!showSeedInput)}
            className="text-xs text-muted underline"
          >
            {showSeedInput ? 'Hide seed input' : 'Enter a seed (optional)'}
          </button>
          {showSeedInput && (
            <input
              type="text"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="8-char seed (e.g. XQ4K2MNP)"
              className="mt-2 w-full px-3 py-2 bg-secondary border border-theme rounded-lg text-sm text-primary placeholder:text-muted font-mono"
              maxLength={8}
            />
          )}
        </div>
      </div>

      <p className="pb-6 text-center text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}
