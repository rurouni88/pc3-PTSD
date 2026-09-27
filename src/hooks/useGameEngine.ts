import { useRef, useCallback, useEffect, useState } from 'react';
import {
  GameEngineState,
  GameIssue,
  LevelConfig,
  MiniGameType,
} from '../types/game';

interface UseGameEngineProps {
  levelConfig: LevelConfig;
  onComplete: (success: boolean) => void;
}

export function useGameEngine({ levelConfig, onComplete }: UseGameEngineProps) {
  const [state, setState] = useState<GameEngineState>({
    gameState: 'playing',
    difficulty: levelConfig.difficulty,
    timeRemaining: levelConfig.durationSeconds,
    batteryLevel: 100,
    isPaused: false,
    activeIssues: levelConfig.initialIssues,
    completedIssues: [],
    currentMiniGame: null,
  });

  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const calculateDrainRate = useCallback((issues: GameIssue[]): number => {
    const baseDrain = 0.05; // per second
    const penalty = issues.reduce((sum, issue) => sum + (issue.isResolved ? 0 : issue.drainPenalty), 0);
    return baseDrain + penalty * 0.1;
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;

    setState((prev) => {
      if (prev.isPaused || prev.gameState !== 'playing') return prev;

      const newTimeRemaining = prev.timeRemaining - delta;
      const drainRate = calculateDrainRate(prev.activeIssues);
      const newBattery = Math.max(0, prev.batteryLevel - drainRate * delta);

      if (newTimeRemaining <= 0 || newBattery <= 0) {
        onComplete(newBattery > 0 && newTimeRemaining > 0);
        return { ...prev, timeRemaining: 0, batteryLevel: newBattery, gameState: 'results' };
      }

      return { ...prev, timeRemaining: newTimeRemaining, batteryLevel: newBattery };
    });
  }, [calculateDrainRate, onComplete]);

  useEffect(() => {
    timerRef.current = window.setInterval(tick, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tick]);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    lastTickRef.current = Date.now();
    setState((prev) => ({ ...prev, isPaused: false }));
  }, []);

  const resolveIssue = useCallback((issueId: string) => {
    setState((prev) => ({
      ...prev,
      activeIssues: prev.activeIssues.map((issue) =>
        issue.id === issueId ? { ...issue, isResolved: true } : issue
      ),
      completedIssues: [...prev.completedIssues, ...prev.activeIssues.filter((issue) => issue.id === issueId)],
    }));
  }, []);

  const startMiniGame = useCallback((miniGameType: MiniGameType) => {
    setState((prev) => ({ ...prev, currentMiniGame: miniGameType }));
  }, []);

  const endMiniGame = useCallback(() => {
    setState((prev) => ({ ...prev, currentMiniGame: null }));
  }, []);

  return {
    state,
    pause,
    resume,
    resolveIssue,
    startMiniGame,
    endMiniGame,
  };
}
