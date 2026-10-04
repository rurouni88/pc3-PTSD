import { loadUnlocked, ACHIEVEMENTS } from '../engine/achievements';
import { CopyButton } from './CopyButton';
import { Modal } from './Modal';

interface AchievementsModalProps {
  onClose: () => void;
}

type AchievementState = 'unlocked' | 'locked';

function getAchievementState(id: string, unlocked: Set<string>): AchievementState {
  return unlocked.has(id) ? 'unlocked' : 'locked';
}

function renderAchievementCard(
  ach: (typeof ACHIEVEMENTS)[number],
  state: AchievementState
): React.ReactNode {
  const isUnlocked = state === 'unlocked';

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border ${
        isUnlocked
          ? 'bg-secondary/50 border-accent-green/30'
          : 'bg-secondary/30 border-theme/50 opacity-60'
      }`}
    >
      <div className="text-2xl shrink-0">{ach.emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-primary truncate">{ach.title}</p>
        <p className="text-xs text-secondary mt-0.5">
          {isUnlocked ? ach.desc : 'Complete runs to unlock this.'}
        </p>
      </div>
    </div>
  );
}

function buildAchievementsSummary(unlocked: Set<string>): string {
  const earned = ACHIEVEMENTS.filter((a) => unlocked.has(a.id));
  const lines = earned.map((a) => `${a.emoji} ${a.title}`);
  return [
    `🏅 PTSD Achievements: ${unlocked.size}/${ACHIEVEMENTS.length}`, 
    ...lines,
  ].join('\n');
}

export function AchievementsModal({ onClose }: AchievementsModalProps) {
  const unlocked = new Set(loadUnlocked());

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-theme">
        <h2 className="text-lg font-bold text-primary">Achievements</h2>
        <button
          onClick={onClose}
          className="text-muted hover:text-primary transition-colors active:scale-90"
        >
          ✕
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {ACHIEVEMENTS.map((ach) =>
          renderAchievementCard(ach, getAchievementState(ach.id, unlocked))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-theme text-center">
        <p className="text-xs text-muted mb-2">
          {unlocked.size}/{ACHIEVEMENTS.length} unlocked
        </p>
        {unlocked.size > 0 && (
          <CopyButton
            text={buildAchievementsSummary(unlocked)}
            label="Copy Achievements"
            className="px-3 py-1.5 text-xs"
          />
        )}
      </div>
    </Modal>
  );
}
