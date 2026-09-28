import { useRef, useCallback, useEffect, useState } from 'react';
import {
  GameEngineState,
  GameIssue,
  LevelConfig,
  ParentPrompt,
  MiniGameType,
  ForeignLanguage,
  RunStats,
  MiniGameQuality,
} from '../types/game';
import { RngEngine } from '../engine/seeded-rng';
import { SaveSystem } from '../engine/save';
import { MetaStore, RunRecord } from '../engine/meta';
import { checkAchievements, Achievement } from '../engine/achievements';
import { playSound } from '../engine/sound';

interface UseGameEngineProps {
  levelConfig: LevelConfig;
  onComplete: (result: {
    success: boolean;
    timeRemaining: number;
    batteryLevel: number;
    seed: string;
    achievements: Achievement[];
  }) => void;
}

const GRANDMA_LANGUAGES: ForeignLanguage[] = ['greek', 'arabic', 'korean', 'japanese', 'hindi'];

export function useGameEngine({ levelConfig, onComplete }: UseGameEngineProps) {
  const [state, setState] = useState<GameEngineState>(() => ({
    gameState: 'playing',
    difficulty: levelConfig.difficulty,
    timeRemaining: levelConfig.durationSeconds,
    batteryLevel: 100,
    isPaused: false,
    activeIssues: levelConfig.initialIssues,
    completedIssues: [],
    currentMiniGame: null,
    foreignLanguage: levelConfig.difficulty === 'grandma'
      ? GRANDMA_LANGUAGES[Math.floor(RngEngine.random() * GRANDMA_LANGUAGES.length)]
      : null,
  }));

  const [activePrompt, setActivePrompt] = useState<ParentPrompt | null>(null);
  const [guiltTripActive, setGuiltTripActive] = useState(false);
  const [interruptionCount, setInterruptionCount] = useState(0);
  const [chargerUsed, setChargerUsed] = useState(false);

  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const lastInterruptionRef = useRef<number>(0);
  const shownPromptIdsRef = useRef<Set<string>>(new Set());
  const completedRef = useRef(false);
  const tickerPlayedRef = useRef(false);

  // Run stats — tracked via refs to avoid re-renders
  const runStatsRef = useRef<RunStats>({
    miniGamesCompleted: [],
    promptsAnswered: 0,
    liesTold: 0,
    explanationsGiven: 0,
    guiltTripsTaken: 0,
    interruptionsSurvived: 0,
    chargerUsed: false,
    spamsReceived: 0,
    chineseEasterEgg: false,
    difficulty: levelConfig.difficulty,
    adsTriggered: 0,
    decoysTapped: 0,
    wrongLanguagePicks: 0,
    wrongToggles: 0,
    importantSelected: false,
  });

  const calculateDrainRate = useCallback((issues: GameIssue[]): number => {
    const baseDrain = 0.05;
    const penalty = issues.reduce((sum, issue) => sum + (issue.isResolved ? 0 : issue.drainPenalty), 0);
    const guiltPenalty = guiltTripActive ? 0.08 : 0;
    return baseDrain + penalty * 0.1 + guiltPenalty;
  }, [guiltTripActive]);

  const triggerPrompt = useCallback(() => {
    const prompts = levelConfig.parentPrompts;
    if (prompts.length === 0) return;

    // Find next unseen prompt
    const available = prompts.filter((p) => !shownPromptIdsRef.current.has(p.id));
    if (available.length === 0) return; // All prompts shown — no more interruptions

    const prompt = available[Math.floor(RngEngine.random() * available.length)];
    shownPromptIdsRef.current.add(prompt.id);

    setActivePrompt(prompt);
    setInterruptionCount((prev) => prev + 1);
    runStatsRef.current.interruptionsSurvived++;
    playSound('interrupt');

    if (prompt.type === 'guilt-trip') {
      setGuiltTripActive(true);
      runStatsRef.current.guiltTripsTaken++;
      setTimeout(() => setGuiltTripActive(false), 10000);
    }
  }, [levelConfig.parentPrompts]);

  const handleGameEnd = useCallback((finalState: GameEngineState) => {
    if (completedRef.current) return;
    completedRef.current = true;

    const allResolved = finalState.activeIssues.every((issue) => issue.isResolved);
    const success = finalState.batteryLevel > 0 && finalState.timeRemaining > 0 && allResolved;
    const seed = RngEngine.seed;

    // Check achievements
    const finalStateWithResult = { ...finalState, gameState: 'results' as const };
    const newAchievements = checkAchievements(finalStateWithResult, runStatsRef.current);

    // Record in meta
    const record: RunRecord = {
      difficulty: finalState.difficulty!,
      won: success,
      timeRemaining: Math.round(finalState.timeRemaining),
      batteryLevel: Math.round(finalState.batteryLevel),
      seed,
      date: new Date().toISOString(),
    };
    MetaStore.recordRunComplete(record);

    // Clear save on completion
    SaveSystem.deleteSave();

    onComplete({
      success,
      timeRemaining: finalState.timeRemaining,
      batteryLevel: finalState.batteryLevel,
      seed,
      achievements: newAchievements,
    });
  }, [onComplete]);

  const tick = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;

    // Trigger random interruptions
    if (now - lastInterruptionRef.current > levelConfig.interruptionRate * 1000) {
      lastInterruptionRef.current = now;
      triggerPrompt();
    }

    setState((prev) => {
      if (prev.isPaused || prev.gameState !== 'playing') return prev;

      const newTimeRemaining = prev.timeRemaining - delta;
      const drainRate = calculateDrainRate(prev.activeIssues);
      const newBattery = Math.max(0, prev.batteryLevel - drainRate * delta);

      // Play ticker sound when entering final 10 seconds
      if (newTimeRemaining <= 10 && prev.timeRemaining > 10 && !tickerPlayedRef.current) {
        tickerPlayedRef.current = true;
        playSound('ticker');
      }

      const updated: GameEngineState = {
        ...prev,
        timeRemaining: newTimeRemaining,
        batteryLevel: newBattery,
      };

      // Autosave every tick (lightweight)
      SaveSystem.save(updated);

      // Check victory: all issues resolved + battery + time still positive
      const allResolved = updated.activeIssues.every((issue) => issue.isResolved);
      if (allResolved && updated.batteryLevel > 0 && updated.timeRemaining > 0) {
        handleGameEnd(updated);
        return { ...updated, gameState: 'results' };
      }

      if (newTimeRemaining <= 0 || newBattery <= 0) {
        handleGameEnd(updated);
        return { ...updated, timeRemaining: 0, batteryLevel: newBattery, gameState: 'results' };
      }

      return updated;
    });
  }, [calculateDrainRate, levelConfig.interruptionRate, handleGameEnd, triggerPrompt]);

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

  const resolveIssue = useCallback((issueId: string, selectedLanguage?: string, quality?: MiniGameQuality) => {
    // Merge quality stats into run stats
    if (quality) {
      if (quality.adsTriggered) runStatsRef.current.adsTriggered += quality.adsTriggered;
      if (quality.decoysTapped) runStatsRef.current.decoysTapped += quality.decoysTapped;
      if (quality.wrongLanguagePicks) runStatsRef.current.wrongLanguagePicks += quality.wrongLanguagePicks;
      if (quality.wrongToggles) runStatsRef.current.wrongToggles += quality.wrongToggles;
      if (quality.importantSelected) runStatsRef.current.importantSelected = true;
    }

    setState((prev) => {
      const resolved = prev.activeIssues.find((i) => i.id === issueId);
      if (resolved) {
        runStatsRef.current.miniGamesCompleted.push(resolved.type);
        // Handle blind-translation: clear language or set Chinese Easter Egg
        if (resolved.type === 'blind-translation') {
          const newLang: ForeignLanguage | null = selectedLanguage === 'chinese' ? 'chinese' : null;
          if (selectedLanguage === 'chinese') {
            runStatsRef.current.chineseEasterEgg = true;
          }
          return {
            ...prev,
            foreignLanguage: newLang,
            activeIssues: prev.activeIssues.map((issue) =>
              issue.id === issueId ? { ...issue, isResolved: true } : issue
            ),
            completedIssues: [...prev.completedIssues, resolved],
          };
        }
      }
      return {
        ...prev,
        activeIssues: prev.activeIssues.map((issue) =>
          issue.id === issueId ? { ...issue, isResolved: true } : issue
        ),
        completedIssues: [...prev.completedIssues, ...prev.activeIssues.filter((issue) => issue.id === issueId)],
      };
    });
  }, []);

  const startMiniGame = useCallback((miniGameType: MiniGameType) => {
    setState((prev) => ({ ...prev, currentMiniGame: miniGameType }));
  }, []);

  const endMiniGame = useCallback(() => {
    setState((prev) => ({ ...prev, currentMiniGame: null }));
  }, []);

  const handlePromptAnswer = useCallback((optionIndex: number) => {
    if (!activePrompt) return;
    const option = activePrompt.options[optionIndex];
    if (option) {
      runStatsRef.current.promptsAnswered++;
      // Heuristic: the first option is usually the "lie/quick fix" (lower timeCost, negative battery)
      if (option.batteryEffect < 0) {
        runStatsRef.current.liesTold++;
      } else {
        runStatsRef.current.explanationsGiven++;
      }
      setState((prev) => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - option.timeCost),
        batteryLevel: Math.max(0, prev.batteryLevel + option.batteryEffect),
      }));
    }
    setActivePrompt(null);
    if (navigator.vibrate) navigator.vibrate(50);
  }, [activePrompt]);

  const dismissPrompt = useCallback(() => {
    setActivePrompt(null);
    if (navigator.vibrate) navigator.vibrate(50);
  }, []);

  const useCharger = useCallback((batteryGain: number) => {
    setChargerUsed(true);
    runStatsRef.current.chargerUsed = true;
    playSound('charger');
    setState((prev) => ({
      ...prev,
      batteryLevel: Math.min(100, prev.batteryLevel + batteryGain),
    }));
  }, []);

  const applySpamDrain = useCallback((amount: number) => {
    runStatsRef.current.spamsReceived++;
    setState((prev) => ({
      ...prev,
      batteryLevel: Math.max(0, prev.batteryLevel - amount),
    }));
  }, []);

  return {
    state,
    activePrompt,
    guiltTripActive,
    interruptionCount,
    chargerUsed,
    pause,
    resume,
    resolveIssue,
    startMiniGame,
    endMiniGame,
    handlePromptAnswer,
    dismissPrompt,
    useCharger,
    applySpamDrain,
  };
}
