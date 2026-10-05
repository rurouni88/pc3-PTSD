// MiniGameGym — Practice a single mini-game in isolation.
// No timer, no battery, no interruptions. Just the mechanic.
// Launched from the Boot Camp modal on the BootScreen.

import { useCallback, useState } from 'react';
import { RngEngine } from '../engine/seeded-rng';
import { levels } from '../config/levels';
import { MINI_GAME_REGISTRY, type MiniGameRenderProps } from '../components/mini-games/registry';
import { StatusBar } from '../components/StatusBar';
import { InfoTooltip } from '../components/InfoTooltip';
import { InfoTrigger } from '../components/InfoTrigger';
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

const GAME_TIPS: Record<MiniGameType, string> = {
  'infinite-tab-sweep': 'Tap tabs to close them. Don\'t tap the ads (they look like tabs). Close all real tabs to win.',
  'physical-override': 'Toggle the correct switches (Wi-Fi, Bluetooth, Airplane Mode) without tapping the wrong ones. Your parent keeps tapping things.',
  'duplicate-doom': 'Delete the duplicate photos. Don\'t delete the important ones (family photos, documents). Keep the originals.',
  'antivirus-whack-a-mole': 'Tap the viruses as they pop up. Don\'t tap the "safe" apps. Whack enough viruses to win.',
  'blind-translation': 'The screen is in a foreign language. Tap the correct translation to proceed. You can\'t read it, so guess wisely.',
  'faceid-setup': 'Keep the scan frame on your parent\'s face as it drifts. Hold the alignment to fill the progress bar. Distractions will reset it.',
  'fingerprint-scan': 'Rapidly tap the sensor to register the fingerprint. Smudges will interrupt you — wipe the screen to continue.',
  'passkey-setup': 'Follow the 5-step passkey wizard. Your parent will make errors at each step. Correct them before they get worse.',
  'system-update': 'The phone wants to update. Hold it down (restraint) while avoiding the "Install" button that keeps appearing. Don\'t let it update.',
  'zoom-out': 'The text keeps zooming in. Tap to zoom out. Notifications will re-zoom it. Keep the text at a readable size.',
};

export function MiniGameGym({ gameType, onExit }: MiniGameGymProps) {
  const gameLabel = GAME_LABELS[gameType] ?? 'Training';
  const [tip, setTip] = useState<{ title: string; description: string } | null>(null);

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
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted">{gameLabel}</span>
          <InfoTrigger
            label={`How to play ${gameLabel}`}
            onClick={() => setTip({ title: gameLabel, description: GAME_TIPS[gameType] })}
          />
        </div>
        <button
          onClick={handleCancel}
          className="text-xs text-primary font-medium active:scale-95 transition-transform"
        >
          ← Back
        </button>
      </div>
      <InfoTooltip content={tip} onClose={() => setTip(null)} />
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
