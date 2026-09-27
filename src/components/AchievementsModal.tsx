import { loadUnlocked } from '../engine/achievements';
import { ACHIEVEMENTS } from '../engine/achievements';

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

export function AchievementsModal({ onClose }: AchievementsModalProps) {
  const unlocked = new Set(loadUnlocked());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xs max-h-[80dvh] flex flex-col bg-secondary rounded-2xl border border-theme animate-slam-in"
        onClick={(e) => e.stopPropagation()}
      >
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
          <p className="text-xs text-muted">
            {unlocked.size}/{ACHIEVEMENTS.length} unlocked
          </p>
        </div>
      </div>
    </div>
  );
}
