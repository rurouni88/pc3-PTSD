import { useState, useCallback } from 'react';
import { BootScreen } from './screens/BootScreen';
import { LevelSelect } from './screens/LevelSelect';
import { OSInterface } from './screens/OSInterface';
import { Results } from './screens/Results';
import { levels } from './config/levels';
import { Difficulty, GameState } from './types/game';

export function App() {
  const [gameState, setGameState] = useState<GameState>('boot');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [lastResult, setLastResult] = useState<{ success: boolean; timeRemaining: number; batteryLevel: number }>({
    success: false,
    timeRemaining: 0,
    batteryLevel: 0,
  });

  const handleBoot = useCallback(() => {
    setGameState('level-select');
  }, []);

  const handleSelectLevel = useCallback((selected: Difficulty) => {
    setDifficulty(selected);
    setGameState('playing');
  }, []);

  const handleComplete = useCallback((success: boolean) => {
    setLastResult({
      success,
      timeRemaining: 0,
      batteryLevel: success ? 50 : 0,
    });
    setGameState('results');
  }, []);

  const handleReplay = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleMenu = useCallback(() => {
    setDifficulty(null);
    setGameState('level-select');
  }, []);

  return (
    <div className="h-dvh w-screen overflow-hidden">
      {gameState === 'boot' && <BootScreen onReady={handleBoot} />}
      {gameState === 'level-select' && <LevelSelect onSelect={handleSelectLevel} />}
      {gameState === 'playing' && difficulty && (
        <OSInterface levelConfig={levels[difficulty]} onComplete={handleComplete} />
      )}
      {gameState === 'results' && difficulty && (
        <Results
          success={lastResult.success}
          difficulty={difficulty}
          timeRemaining={lastResult.timeRemaining}
          batteryLevel={lastResult.batteryLevel}
          onReplay={handleReplay}
          onMenu={handleMenu}
        />
      )}
    </div>
  );
}
