import { useState, useCallback, useEffect, useRef } from 'react';
import { playHaptic } from '../engine/haptics';
import { StatusBar } from '../components/StatusBar';

import { ParentInterrupt } from '../components/ParentInterrupt';
import { Charger } from '../components/Charger';
import { SpamSystem } from '../components/SpamSystem';
import { useGameEngine } from '../hooks/useGameEngine';
import { LevelConfig, MiniGameType, ForeignLanguage, MiniGameQuality, RunStats } from '../types/game';
import type { Achievement } from '../engine/achievements';
import { MINI_GAME_REGISTRY, type MiniGameRenderProps } from '../components/mini-games/registry';
import { HelpModal } from '../components/HelpModal';
import { SettingsModal } from '../components/SettingsModal';

interface OSInterfaceProps {
  levelConfig: LevelConfig;
  onComplete: (result: {
    success: boolean;
    timeRemaining: number;
    batteryLevel: number;
    seed: string;
    achievements: Achievement[];
    runStats: RunStats;
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
  'passkey-setup': { label: 'Set up passkey', icon: '🔑' },
  'system-update': { label: 'Update installing', icon: '📲' },
  'zoom-out': { label: 'Zoomed in too much', icon: '🔍' },
};

function MiniGameView(props: MiniGameRenderProps) {
  const render = MINI_GAME_REGISTRY[props.type];
  if (!render) {
    return <div className="p-4 text-center text-accent-red text-sm">Unknown mini-game: {props.type}</div>;
  }
  return render({ ...props });
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
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [effect, setEffect] = useState<'shake' | 'flash' | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [resolving, setResolving] = useState(false);
  const effectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Countdown: 3 → 2 → 1 → GO! (timer paused during countdown)
  useEffect(() => {
    if (countdown <= 0) {
      resume();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [countdown, resume]);



  const triggerEffect = useCallback((e: 'shake' | 'flash') => {
    if (effectTimeout.current) clearTimeout(effectTimeout.current);
    setEffect(e);
    effectTimeout.current = setTimeout(() => setEffect(null), 400);
  }, []);

  useEffect(() => () => { if (effectTimeout.current) clearTimeout(effectTimeout.current); }, []);

  // Shake on battery death
  const prevBattery = useRef(state.batteryLevel);
  useEffect(() => {
    if (prevBattery.current > 0 && state.batteryLevel <= 0) {
      triggerEffect('shake');
    }
    prevBattery.current = state.batteryLevel;
  }, [state.batteryLevel, triggerEffect]);

  const handleIssueTap = useCallback((issueId: string, issueType: MiniGameType) => {
    if (countdown > 0) return; // Ignore taps during countdown
    playHaptic('click');
    setActiveIssueId(issueId);
    setActiveMiniGame(issueType);
  }, [countdown]);

  const handleMiniGameComplete = useCallback((quality?: MiniGameQuality, selectedLanguage?: string) => {
    if (activeIssueId) {
      setResolving(true);
      setTimeout(() => {
        resolveIssue(activeIssueId, selectedLanguage, quality);
        setResolving(false);
        setActiveMiniGame(null);
        setActiveIssueId(null);
      }, 500);
    } else {
      setActiveMiniGame(null);
      setActiveIssueId(null);
    }
    playHaptic('complete');
    triggerEffect('flash');
  }, [activeIssueId, resolveIssue, triggerEffect]);

  const handleMiniGameCancel = useCallback(() => {
    setActiveMiniGame(null);
    setActiveIssueId(null);
    triggerEffect('shake');
  }, [triggerEffect]);

  const activeIssueList = state.activeIssues.filter((i) => !i.isResolved);

  if (activeMiniGame) {
    return (
      <div className="h-full bg-primary select-none overflow-hidden relative">
        <MiniGameView
          type={activeMiniGame}
          difficulty={levelConfig.difficulty}
          levelConfig={levelConfig}
          foreignLanguage={state.foreignLanguage}
          onComplete={handleMiniGameComplete}
          onCancel={handleMiniGameCancel}
        />
        {resolving && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-primary/60">
            <div className="animate-resolve-stamp text-center">
              <span className="text-5xl">✅</span>
              <p className="text-xl font-bold text-accent-green mt-2">Resolved!</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showPauseMenu) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary select-none">
        <span className="text-5xl mb-6">⏸️</span>
        <h2 className="text-2xl font-bold text-primary mb-2">Paused</h2>
        <p className="text-sm text-secondary mb-8 text-center max-w-xs px-4">
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
            onClick={() => setShowHelp(true)}
            className="w-full py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
          >
            How To Play
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
          >
            Settings
          </button>
          <button
            onClick={onExit}
            className="w-full py-3 bg-tertiary text-primary font-bold rounded-xl active:scale-95 transition-transform"
          >
            Exit to Menu
          </button>
        </div>
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-primary select-none overflow-hidden animate-fade-in ${effect === 'shake' ? 'animate-shake' : ''} ${effect === 'flash' ? 'animate-flash-green' : ''}`}>
      {countdown > 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/90">
          <span key={countdown} className="text-7xl font-bold text-primary animate-countdown-pop">
            {countdown}
          </span>
        </div>
      )}
      {guiltTripActive && (
        <div className="absolute inset-0 border-8 border-gray-600/40 pointer-events-none z-30" />
      )}

      <StatusBar
        batteryLevel={state.batteryLevel}
        timeRemaining={state.timeRemaining}
      />

      <SpamSystem active={!activePrompt && !state.isPaused && countdown === 0} onBatteryDrain={applySpamDrain} />

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
          className="flex items-center gap-2 w-[160px] px-3 py-2 bg-tertiary rounded-xl border border-theme active:scale-95 transition-transform"
        >
          <span className="text-lg">⏸</span>
          <span className="text-xs text-primary font-medium">Pause</span>
        </button>
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
