// MiniGameGym — Practice a single mini-game in isolation.
// No timer, no battery, no interruptions. Just the mechanic.
// Launched from the Boot Camp modal on the BootScreen.

import { useCallback } from 'react';
import { RngEngine } from '../engine/seeded-rng';
import { levels } from '../config/levels';
import { MINI_GAME_REGISTRY, type MiniGameRenderProps } from '../components/mini-games/registry';
import { StatusBar } from '../components/StatusBar';
import type { MiniGameType, MiniGameQuality } from '../types/game';

interface MiniGameGymProps {
  gameType: MiniGameType;
  onExit: () => void;
}

const GAME_LABELS: Record<MiniGameType, string> = {
  'infinite-tab-sweep': 'Tab Sweep',
  'physical-override': 'Quick Settings',
  'duplicate-doom': 'Duplicate Doom',
  'antivirus-whack-a-mole': 'Antivirus',
  'blind-translation': 'Blind Translation',
  'faceid-setup': 'FaceID',
  'fingerprint-scan': 'Fingerprint',
  'passkey-setup': 'Passkey',
  'system-update': 'System Update',
  'zoom-out': 'Zoom Fix',
};

export function MiniGameGym({ gameType, onExit }: MiniGameGymProps) {
  const gameLabel = GAME_LABELS[gameType] ?? 'Training';

  const handleComplete = useCallback(() => {
    // In training mode, completion just goes back
    onExit();
  }, [onExit]);

  const handleCancel = useCallback(() => {
    onExit();
  }, [onExit]);

  return (
    <div className="h-full flex flex-col bg-primary select-none overflow-hidden">
      <StatusBar batteryLevel={100} timeRemaining={0} mode="TRAINING" />
      <div className="flex-1 min-h-0 overflow-hidden">
        <MiniGameGymRender type={gameType} onComplete={handleComplete} onCancel={handleCancel} />
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
