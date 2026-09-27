import { useState } from 'react';
import { StatusBar } from '../components/StatusBar';
import { BottomBar } from '../components/BottomBar';
import { Notification } from '../components/Notification';
import { Interrupt } from '../components/Interrupt';
import { useGameEngine } from '../hooks/useGameEngine';
import { LevelConfig, MiniGameType } from '../types/game';

interface OSInterfaceProps {
  levelConfig: LevelConfig;
  onComplete: (success: boolean) => void;
}

const issueLabels: Record<MiniGameType, { label: string; icon: string }> = {
  'infinite-tab-sweep': { label: 'Browser is slow', icon: '🌐' },
  'blind-translation': { label: 'Wrong language', icon: '🔤' },
  'duplicate-doom': { label: 'Storage full', icon: '📷' },
  'antivirus-whack-a-mole': { label: 'Suspicious app', icon: '🛡️' },
  'physical-override': { label: 'Battery draining', icon: '🔦' },
};

export function OSInterface({ levelConfig, onComplete }: OSInterfaceProps) {
  const { state, resolveIssue } = useGameEngine({ levelConfig, onComplete });
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [activeInterrupt, setActiveInterrupt] = useState<string | null>(null);

  const handleIssueTap = (issueId: string) => {
    if (navigator.vibrate) navigator.vibrate(50);
    // In full implementation, this would open the mini-game
    // For prototype, resolve immediately
    resolveIssue(issueId);
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const activeIssueList = state.activeIssues.filter((i) => !i.isResolved);

  return (
    <div className="h-dvh flex flex-col bg-primary select-none overflow-hidden">
      <StatusBar
        batteryLevel={state.batteryLevel}
        timeRemaining={state.timeRemaining}
      />

      {activeNotification && (
        <Notification
          message={activeNotification}
          app="System"
          onDismiss={() => setActiveNotification(null)}
        />
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {activeIssueList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-5xl mb-4">✅</span>
              <p className="text-lg font-bold text-primary">All issues resolved!</p>
              <p className="text-sm text-secondary">Waiting for timer to end...</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted mb-2">
                Active issues ({activeIssueList.length}):
              </p>
              {activeIssueList.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => handleIssueTap(issue.id)}
                  className="flex items-center gap-3 p-4 bg-secondary rounded-xl border border-theme active:scale-95 transition-transform"
                >
                  <span className="text-2xl">{issueLabels[issue.type].icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-primary">
                      {issueLabels[issue.type].label}
                    </p>
                    <p className="text-xs text-accent-red">
                      Draining battery (+{Math.round(issue.drainPenalty * 100)}%)
                    </p>
                  </div>
                  <span className="text-xs text-muted">Tap to fix</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <BottomBar
        onHome={() => {}}
        onBack={() => {}}
      />

      {activeInterrupt && (
        <Interrupt
          message={activeInterrupt}
          onClose={() => setActiveInterrupt(null)}
        />
      )}
    </div>
  );
}
