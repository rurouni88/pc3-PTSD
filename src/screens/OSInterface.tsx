import { useState, useCallback } from 'react';
import { StatusBar } from '../components/StatusBar';
import { BottomBar } from '../components/BottomBar';
import { ParentInterrupt } from '../components/ParentInterrupt';
import { Charger } from '../components/Charger';
import { SpamSystem } from '../components/SpamSystem';
import { useGameEngine } from '../hooks/useGameEngine';
import { LevelConfig, MiniGameType } from '../types/game';
import type { Achievement } from '../engine/achievements';
import { InfiniteTabSweep } from '../components/mini-games/InfiniteTabSweep';
import { PhysicalOverride } from '../components/mini-games/PhysicalOverride';
import { DuplicateDoom } from '../components/mini-games/DuplicateDoom';
import { AntivirusWhackAMole } from '../components/mini-games/AntivirusWhackAMole';
import { BlindTranslation } from '../components/mini-games/BlindTranslation';

interface OSInterfaceProps {
  levelConfig: LevelConfig;
  onComplete: (result: {
    success: boolean;
    timeRemaining: number;
    batteryLevel: number;
    seed: string;
    achievements: Achievement[];
  }) => void;
}

const issueLabels: Record<MiniGameType, { label: string; icon: string }> = {
  'infinite-tab-sweep': { label: 'Browser is slow', icon: '🌐' },
  'blind-translation': { label: 'Wrong language', icon: '🔤' },
  'duplicate-doom': { label: 'Storage full', icon: '📷' },
  'antivirus-whack-a-mole': { label: 'Suspicious app', icon: '🛡️' },
  'physical-override': { label: 'Battery draining', icon: '🔦' },
};

function MiniGameView({
  type,
  onComplete,
  onCancel,
}: {
  type: MiniGameType;
  onComplete: () => void;
  onCancel: () => void;
}) {
  switch (type) {
    case 'infinite-tab-sweep':
      return <InfiniteTabSweep onComplete={onComplete} onCancel={onCancel} />;
    case 'physical-override':
      return <PhysicalOverride onComplete={onComplete} onCancel={onCancel} />;
    case 'duplicate-doom':
      return <DuplicateDoom onComplete={onComplete} onCancel={onCancel} />;
    case 'antivirus-whack-a-mole':
      return <AntivirusWhackAMole onComplete={onComplete} onCancel={onCancel} />;
    case 'blind-translation':
      return <BlindTranslation onComplete={onComplete} onCancel={onCancel} />;
  }
}

export function OSInterface({ levelConfig, onComplete }: OSInterfaceProps) {
  const {
    state,
    activePrompt,
    guiltTripActive,
    resolveIssue,
    handlePromptAnswer,
    dismissPrompt,
    useCharger,
    applySpamDrain,
  } = useGameEngine({ levelConfig, onComplete });
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameType | null>(null);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);

  const handleIssueTap = useCallback((issueId: string, issueType: MiniGameType) => {
    if (navigator.vibrate) navigator.vibrate(50);
    setActiveIssueId(issueId);
    setActiveMiniGame(issueType);
  }, []);

  const handleMiniGameComplete = useCallback(() => {
    if (activeIssueId) {
      resolveIssue(activeIssueId);
    }
    setActiveMiniGame(null);
    setActiveIssueId(null);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }, [activeIssueId, resolveIssue]);

  const handleMiniGameCancel = useCallback(() => {
    setActiveMiniGame(null);
    setActiveIssueId(null);
  }, []);

  const activeIssueList = state.activeIssues.filter((i) => !i.isResolved);

  if (activeMiniGame) {
    return (
      <div className="h-dvh bg-primary select-none overflow-hidden">
        <MiniGameView
          type={activeMiniGame}
          onComplete={handleMiniGameComplete}
          onCancel={handleMiniGameCancel}
        />
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-primary select-none overflow-hidden">
      {guiltTripActive && (
        <div className="absolute inset-0 border-8 border-gray-600/40 pointer-events-none z-30" />
      )}

      <StatusBar
        batteryLevel={state.batteryLevel}
        timeRemaining={state.timeRemaining}
      />

      <SpamSystem active={!activePrompt} onBatteryDrain={applySpamDrain} />

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
                  onClick={() => handleIssueTap(issue.id, issue.type)}
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

      <div className="flex items-center justify-between p-3 border-t border-theme">
        <Charger onCharge={useCharger} />
        <BottomBar onHome={() => {}} onBack={() => {}} />
      </div>

      {activePrompt && state.difficulty && (
        <ParentInterrupt
          prompt={activePrompt}
          difficulty={state.difficulty}
          onAnswer={handlePromptAnswer}
          onDismiss={dismissPrompt}
        />
      )}
    </div>
  );
}
