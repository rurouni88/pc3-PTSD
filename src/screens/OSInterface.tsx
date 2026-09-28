import { useState, useCallback } from 'react';
import { StatusBar } from '../components/StatusBar';
import { BottomBar } from '../components/BottomBar';
import { ParentInterrupt } from '../components/ParentInterrupt';
import { Charger } from '../components/Charger';
import { SpamSystem } from '../components/SpamSystem';
import { useGameEngine } from '../hooks/useGameEngine';
import { LevelConfig, MiniGameType, ForeignLanguage, MiniGameQuality } from '../types/game';
import type { Achievement } from '../engine/achievements';
import { InfiniteTabSweep } from '../components/mini-games/InfiniteTabSweep';
import { PhysicalOverride } from '../components/mini-games/PhysicalOverride';
import { DuplicateDoom } from '../components/mini-games/DuplicateDoom';
import { AntivirusWhackAMole } from '../components/mini-games/AntivirusWhackAMole';
import { BlindTranslation } from '../components/mini-games/BlindTranslation';
import { FaceIdSetup } from '../components/mini-games/FaceIdSetup';
import { FingerprintScan } from '../components/mini-games/FingerprintScan';

interface OSInterfaceProps {
  levelConfig: LevelConfig;
  onComplete: (result: {
    success: boolean;
    timeRemaining: number;
    batteryLevel: number;
    seed: string;
    achievements: Achievement[];
  }) => void;
  onExit: () => void;
}

const issueLabels: Record<MiniGameType, { label: string; icon: string }> = {
  'infinite-tab-sweep': { label: 'Browser is slow', icon: '🌐' },
  'blind-translation': { label: 'Wrong language', icon: '🔤' },
  'duplicate-doom': { label: 'Storage full', icon: '📷' },
  'antivirus-whack-a-mole': { label: 'Suspicious app', icon: '🛡️' },
  'physical-override': { label: 'Battery draining', icon: '🔦' },
  'faceid-setup': { label: 'FaceID not working', icon: '🔐' },
  'fingerprint-scan': { label: 'Touch ID smudged', icon: '👆' },
};

function MiniGameView({
  type,
  difficulty,
  levelConfig,
  foreignLanguage,
  onComplete,
  onCancel,
}: {
  type: MiniGameType;
  difficulty: string;
  levelConfig: LevelConfig;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality, selectedLanguage?: string) => void;
  onCancel: () => void;
}) {
  switch (type) {
    case 'infinite-tab-sweep':
      return <InfiniteTabSweep difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={(q) => onComplete(q)} onCancel={onCancel} />;
    case 'physical-override':
      return <PhysicalOverride quickSettingsConfig={levelConfig.quickSettingsConfig} difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={(q) => onComplete(q)} onCancel={onCancel} />;
    case 'duplicate-doom':
      return <DuplicateDoom photoTheme={levelConfig.photoTheme} difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={(q) => onComplete(q)} onCancel={onCancel} />;
    case 'antivirus-whack-a-mole':
      return <AntivirusWhackAMole malwareConfig={levelConfig.malwareConfig} difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={(q) => onComplete(q)} onCancel={onCancel} />;
    case 'blind-translation':
      return <BlindTranslation difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={(q, lang) => onComplete(q, lang)} onCancel={onCancel} />;
    case 'faceid-setup':
      return <FaceIdSetup difficulty={difficulty} faceIdConfig={levelConfig.faceIdConfig} foreignLanguage={foreignLanguage} onComplete={(q) => onComplete(q)} onCancel={onCancel} />;
    case 'fingerprint-scan':
      return <FingerprintScan difficulty={difficulty} foreignLanguage={foreignLanguage} onComplete={(q) => onComplete(q)} onCancel={onCancel} />;
  }
}

export function OSInterface({ levelConfig, onComplete, onExit }: OSInterfaceProps) {
  const {
    state,
    activePrompt,
    guiltTripActive,
    pause,
    resume,
    resolveIssue,
    handlePromptAnswer,
    dismissPrompt,
    useCharger,
    applySpamDrain,
  } = useGameEngine({ levelConfig, onComplete });
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameType | null>(null);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  const handleIssueTap = useCallback((issueId: string, issueType: MiniGameType) => {
    if (navigator.vibrate) navigator.vibrate(50);
    setActiveIssueId(issueId);
    setActiveMiniGame(issueType);
  }, []);

  const handleMiniGameComplete = useCallback((quality?: MiniGameQuality, selectedLanguage?: string) => {
    if (activeIssueId) {
      resolveIssue(activeIssueId, selectedLanguage, quality);
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
      <div className="h-full bg-primary select-none overflow-hidden">
        <MiniGameView
          type={activeMiniGame}
          difficulty={levelConfig.difficulty}
          levelConfig={levelConfig}
          foreignLanguage={state.foreignLanguage}
          onComplete={handleMiniGameComplete}
          onCancel={handleMiniGameCancel}
        />
      </div>
    );
  }

  if (showPauseMenu) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary select-none">
        <span className="text-5xl mb-6">⏸️</span>
        <h2 className="text-2xl font-bold text-primary mb-2">Paused</h2>
        <p className="text-sm text-secondary mb-8">
          {state.difficulty === 'grandma'
            ? 'Grandma is watching you pause. She is not amused.'
            : state.difficulty === 'mum'
              ? 'Mum is sipping tea. Judging you silently.'
              : 'Dad is checking his golf scores. You have his attention.'}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs px-6">
          <button
            onClick={() => {
              resume();
              setShowPauseMenu(false);
            }}
            className="w-full py-3 bg-accent-green text-primary font-bold rounded-xl active:scale-95 transition-transform"
          >
            Resume
          </button>
          <button
            onClick={onExit}
            className="w-full py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
          >
            Exit to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-primary select-none overflow-hidden">
      {guiltTripActive && (
        <div className="absolute inset-0 border-8 border-gray-600/40 pointer-events-none z-30" />
      )}

      <StatusBar
        batteryLevel={state.batteryLevel}
        timeRemaining={state.timeRemaining}
      />

      <SpamSystem active={!activePrompt && !state.isPaused} onBatteryDrain={applySpamDrain} />

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {activeIssueList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-5xl mb-4">✅</span>
              <p className="text-lg font-bold text-primary">All issues resolved!</p>
              <p className="text-sm text-secondary">Survive until the timer ends — don't let the battery die!</p>
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
        <button
          onClick={() => {
            pause();
            setShowPauseMenu(true);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-tertiary rounded-xl border border-theme active:scale-95 transition-transform"
        >
          <span className="text-sm">⏸</span>
          <span className="text-xs text-primary font-medium">Pause</span>
        </button>
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
