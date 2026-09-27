import { useState, useCallback } from 'react';
import { BootScreen } from './screens/BootScreen';
import { LevelSelect } from './screens/LevelSelect';
import { OSInterface } from './screens/OSInterface';
import { Results } from './screens/Results';
import { levels } from './config/levels';
import { Difficulty, GameState } from './types/game';
import { RngEngine } from './engine/seeded-rng';
import { SaveSystem } from './engine/save';
import type { Achievement } from './engine/achievements';

interface GameResult {
  success: boolean;
  timeRemaining: number;
  batteryLevel: number;
  seed: string;
  achievements: Achievement[];
}

export function App() {
  const [gameState, setGameState] = useState<GameState>('boot');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  const handleBoot = useCallback((seed: string) => {
    // Seed is already set by BootScreen before calling this
    setGameState('level-select');
  }, []);

  const handleContinue = useCallback(() => {
    const save = SaveSystem.load();
    if (save) {
      RngEngine.setState(save.rng);
      setDifficulty(save.state.difficulty);
      setGameState('playing');
    } else {
      setGameState('level-select');
    }
  }, []);

  const handleSelectLevel = useCallback((selected: Difficulty) => {
    setDifficulty(selected);
    setGameState('playing');
  }, []);

  const handleComplete = useCallback((result: GameResult) => {
    setLastResult(result);
    setGameState('results');
  }, []);

  const handleReplay = useCallback(() => {
    if (difficulty && lastResult) {
      RngEngine.seedWith(lastResult.seed);
      setGameState('playing');
    }
  }, [difficulty, lastResult]);

  const handleMenu = useCallback(() => {
    setDifficulty(null);
    setGameState('level-select');
  }, []);

  const handleExitToBoot = useCallback(() => {
    setDifficulty(null);
    setGameState('boot');
  }, []);

  const hasSave = gameState === 'boot' && SaveSystem.hasSave();

  return (
    <div className="h-dvh w-screen overflow-hidden">
      {gameState === 'boot' && (
        <BootScreen onReady={handleBoot} onContinue={hasSave ? handleContinue : undefined} />
      )}
      {gameState === 'level-select' && <LevelSelect onSelect={handleSelectLevel} />}
      {gameState === 'playing' && difficulty && (
        <OSInterface
          levelConfig={levels[difficulty]}
          onComplete={handleComplete}
          onExit={handleExitToBoot}
        />
      )}
      {gameState === 'results' && difficulty && lastResult && (
        <Results
          result={lastResult}
          difficulty={difficulty}
          onReplay={handleReplay}
          onMenu={handleMenu}
        />
      )}
    </div>
  );
}
