// MiniGameGym — Practice individual mini-games in isolation.
// No timer, no battery, no interruptions. Just the mechanic.

import { useState, useCallback } from 'react';
import { RngEngine } from '../engine/seeded-rng';
import { levels } from '../config/levels';
import { MINI_GAME_REGISTRY, type MiniGameRenderProps } from '../components/mini-games/registry';
import { StatusBar } from '../components/StatusBar';
import { BottomBar } from '../components/BottomBar';
import type { MiniGameType, MiniGameQuality } from '../types/game';

interface MiniGameGymProps {
  onExit: () => void;
}

const GYM_GAMES: { type: MiniGameType; label: string; icon: string; desc: string }[] = [
  { type: 'infinite-tab-sweep', label: 'Tab Sweep', icon: '🌐', desc: 'Close tabs. They multiply.' },
  { type: 'physical-override', label: 'Quick Settings', icon: '🔦', desc: 'Find the flashlight. Page 2 of 6.' },
  { type: 'duplicate-doom', label: 'Duplicate Doom', icon: '📷', desc: 'Delete duplicates. Keep the roses.' },
  { type: 'antivirus-whack-a-mole', label: 'Antivirus', icon: '🛡️', desc: 'Long-press the fakes. Not the real ones.' },
  { type: 'blind-translation', label: 'Blind Translation', icon: '🔤', desc: 'Pick the right language. You can\'t read it.' },
  { type: 'faceid-setup', label: 'FaceID', icon: '🔐', desc: 'Hold the frame on their face. They won\'t stop moving.' },
  { type: 'fingerprint-scan', label: 'Fingerprint', icon: '👆', desc: 'Tap the sensor. Wipe the smudges.' },
  { type: 'passkey-setup', label: 'Passkey', icon: '🔑', desc: '5 steps. They will complicate all of them.' },
  { type: 'system-update', label: 'System Update', icon: '📲', desc: 'Do nothing. Survive the decoys.' },
  { type: 'zoom-out', label: 'Zoom Fix', icon: '🔍', desc: 'Zoom out. Notifications re-zoom. Repeat.' },
];

export function MiniGameGym({ onExit }: MiniGameGymProps) {
  const [activeGame, setActiveGame] = useState<MiniGameType | null>(null);
  const [completed, setCompleted] = useState<Set<MiniGameType>>(new Set());

  const handleComplete = useCallback((quality?: MiniGameQuality) => {
    if (activeGame) {
      setCompleted((prev) => new Set(prev).add(activeGame));
    }
    setActiveGame(null);
  }, [activeGame]);

  const handleCancel = useCallback(() => {
    setActiveGame(null);
  }, []);

  if (activeGame) {
    const gameLabel = GYM_GAMES.find((g) => g.type === activeGame)?.label ?? 'Training';
    return (
      <div className="h-full flex flex-col bg-primary select-none overflow-hidden">
        <StatusBar batteryLevel={100} timeRemaining={0} mode="TRAINING" />
        <div className="flex-1 min-h-0 overflow-hidden">
          <MiniGameGymRender
            type={activeGame}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-secondary border-t border-theme">
          <span className="text-xs text-muted">{gameLabel}</span>
          <button
            onClick={handleCancel}
            className="text-xs text-primary font-medium active:scale-95 transition-transform"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-primary select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-theme">
        <button
          onClick={onExit}
          className="text-sm text-muted active:text-primary"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-primary mt-2">🏋️ Boot Camp</h1>
        <p className="text-xs text-secondary mt-1">
          You are not yet trusted with a real phone. Fix these in the lab.
        </p>
      </div>

      {/* Game grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {GYM_GAMES.map((game) => (
            <button
              key={game.type}
              onClick={() => setActiveGame(game.type)}
              className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl border border-theme active:scale-95 transition-transform relative"
            >
              {completed.has(game.type) && (
                <span className="absolute top-1 right-1 text-accent-green text-xs">✓</span>
              )}
              <span className="text-2xl">{game.icon}</span>
              <span className="text-xs font-bold text-primary">{game.label}</span>
              <span className="text-[0.6rem] text-muted text-center leading-tight">{game.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-theme text-center">
        <p className="text-xs text-muted">
          {completed.size}/{GYM_GAMES.length} practiced
        </p>
      </div>
    </div>
  );
}

function MiniGameGymRender({ type, onComplete, onCancel }: {
  type: MiniGameType;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}) {
  const levelConfig = levels.dad;
  const render = MINI_GAME_REGISTRY[type];
  if (!render) return <div className="p-4 text-center text-accent-red text-sm">Unknown mini-game</div>;
  return render({
    difficulty: 'dad',
    levelConfig,
    foreignLanguage: null,
    onComplete,
    onCancel,
  });
}
