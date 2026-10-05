import { useState, useCallback, useEffect } from 'react';
import { BootScreen } from './screens/BootScreen';
import { OSInterface } from './screens/OSInterface';
import { Results } from './screens/Results';
import { MiniGameGym } from './screens/MiniGameGym';
import { iPhoneFrame } from './components/iPhoneFrame';
import { levels } from './config/levels';
import { Difficulty, GameState, MiniGameType } from './types/game';
import { RngEngine } from './engine/seeded-rng';
import { SaveSystem } from './engine/save';
import { applyTheme, loadTheme } from './engine/theme';
import { applyFontScale, loadFontScale } from './engine/font-scale';
import type { Achievement } from './engine/achievements';
import { useIsDesktop } from './hooks/useIsDesktop';
import { ToastContainer } from './components/ToastContainer';

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
  const [gymGame, setGymGame] = useState<MiniGameType | null>(null);

  // Apply saved theme + font scale on mount
  useEffect(() => {
    applyTheme(loadTheme());
    applyFontScale(loadFontScale());
  }, []);

  const handleStartGame = useCallback((difficulty: Difficulty, seed: string) => {
    setDifficulty(difficulty);
    setGameState('playing');
  }, []);

  const handleContinue = useCallback(() => {
    const save = SaveSystem.load();
    if (save) {
      RngEngine.setState(save.rng);
      setDifficulty(save.state.difficulty);
      setGameState('playing');
    } else {
      setGameState('boot');
    }
  }, []);



  const handleComplete = useCallback((result: GameResult) => {
    SaveSystem.deleteSave();
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
    setGameState('boot');
  }, []);

  const handlePlayGym = useCallback((gameType: MiniGameType) => {
    setGymGame(gameType);
    setGameState('gym');
  }, []);

  const handleExitToBoot = useCallback(() => {
    setDifficulty(null);
    setGymGame(null);
    setGameState('boot');
  }, []);

  const hasSave = gameState === 'boot' && SaveSystem.hasSave();
  const isDesktop = useIsDesktop();

  const renderGame = () => {
    if (gameState === 'boot') {
      return <BootScreen onStartGame={handleStartGame} onContinue={hasSave ? handleContinue : undefined} onPlayGym={handlePlayGym} />;
    }
    if (gameState === 'playing' && difficulty) {
      return (
        <OSInterface
          levelConfig={levels[difficulty]}
          onComplete={handleComplete}
          onExit={handleExitToBoot}
        />
      );
    }
    if (gameState === 'results' && difficulty && lastResult) {
      return (
        <Results
          result={lastResult}
          difficulty={difficulty}
          onReplay={handleReplay}
          onMenu={handleMenu}
        />
      );
    }
    if (gameState === 'gym' && gymGame) {
      return <MiniGameGym gameType={gymGame} onExit={handleExitToBoot} />;
    }
    return null;
  };

  const Frame = iPhoneFrame;

  return (
    <>
      {/* Desktop: frame around all screens */}
      {isDesktop ? (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-8">
          <Frame>{renderGame()}</Frame>
        </div>
      ) : (
        <div className="h-dvh w-screen overflow-hidden">{renderGame()}</div>
      )}
      <ToastContainer />
    </>
  );
}
