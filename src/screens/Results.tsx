import { useEffect } from 'react';
import { Difficulty, RunStats } from '../types/game';
import { MetaStore } from '../engine/meta';
import { RngEngine } from '../engine/seeded-rng';
import type { Achievement } from '../engine/achievements';
import { CopyButton } from '../components/CopyButton';
import { AftermathMessage } from '../components/AftermathMessage';
import { playHaptic } from '../engine/haptics';
import { playVictoryJingle, playDefeatJingle } from '../engine/bgm';
import { showToast } from '../engine/toast';
import { playSound } from '../engine/sound';

interface ResultsProps {
  result: {
    success: boolean;
    timeRemaining: number;
    batteryLevel: number;
    seed: string;
    achievements: Achievement[];
    runStats: RunStats;
  };
  difficulty: Difficulty;
  onReplay: () => void;
  onMenu: () => void;
}

const difficultyNames: Record<Difficulty, string> = {
  dad: 'Dad',
  mum: 'Mum',
  grandma: 'Grandma',
};

const WIN_LINES = [
  'Phone fixed. Relative unimpressed.',
  'Survived the afternoon. Barely.',
  'The phone works. The relationship may not.',
  'Fixed. They broke it again by Tuesday.',
];

const LOSE_LINES = [
  'The phone is still broken. You are not a technician.',
  'Battery died. Dignity died with it.',
  'You lost. The RAM Booster sends its regards.',
  'Grandma has taken the phone and is showing it to Linda.',
];

function buildRunSummary(
  result: { success: boolean; timeRemaining: number; batteryLevel: number; seed: string },
  difficulty: Difficulty
): string {
  const lines = result.success ? WIN_LINES : LOSE_LINES;
  const line = lines[Math.floor(RngEngine.random() * lines.length)];
  const time = Math.round(result.timeRemaining);
  const battery = Math.round(result.batteryLevel);

  return [
    `📱💀 PTSD — ${difficultyNames[difficulty]} (${result.success ? 'WIN' : 'LOSS'})`,
    `⏱️ ${time}s left · 🔋 ${battery}% battery`,
    `🎲 Seed: ${result.seed}`,
    `\"${line}\"`,
  ].join('\n');
}

export function Results({ result, difficulty, onReplay, onMenu }: ResultsProps) {
  useEffect(() => {
    if (result.success) {
      playVictoryJingle();
    } else {
      playDefeatJingle();
      playHaptic('defeat');
    }
    // Toast for newly unlocked achievements
    if (result.achievements.length > 0) {
      playSound('achievement');
      playHaptic('achievement');
      for (const ach of result.achievements) {
        showToast(`🏅 ${ach.emoji} ${ach.title}`, 'success');
      }
    }
  }, [result.success, result.achievements]);

  const meta = MetaStore.load();
  const bestTime = meta.bestTimes[difficulty];
  const bestBattery = meta.bestBatteries[difficulty];

  return (
    <div className="h-full flex flex-col items-center bg-primary p-6 select-none overflow-y-auto animate-fade-in overflow-hidden">
      {result.success && <Confetti />}
      <div className="flex flex-col items-center mt-8">
        <span className="text-6xl mb-4">{result.success ? '🎉' : '💀'}</span>
        <h1 className={`text-3xl font-bold mb-2 ${result.success ? 'text-accent-green' : 'text-accent-red'}`}>
          {result.success ? 'Phone Fixed!' : 'Game Over'}
        </h1>
        <p className="text-sm text-secondary text-center max-w-xs">
          {result.success
            ? `${difficultyNames[difficulty]} is impressed. Barely.`
            : `The phone is still broken. ${difficultyNames[difficulty]} sighs.`}
        </p>
      </div>

      <div className="flex gap-8 my-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{Math.round(result.timeRemaining)}s</p>
          <p className="text-xs text-muted">Time Left</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{Math.round(result.batteryLevel)}%</p>
          <p className="text-xs text-muted">Battery</p>
        </div>
      </div>

      <RunReceipt stats={result.runStats} difficulty={difficulty} />

      <div className="mb-4 text-center">
        <CopyButton text={buildRunSummary(result, difficulty)} label="Copy Summary" />
      </div>

      {bestTime > 0 && (
        <div className="flex gap-6 mb-4">
          <div className="text-center">
            <p className="text-xs text-accent-yellow">Best time</p>
            <p className="text-sm text-primary">{bestTime}s</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-accent-yellow">Best battery</p>
            <p className="text-sm text-primary">{bestBattery}%</p>
          </div>
        </div>
      )}

      {result.achievements.length > 0 && (
        <div className="w-full max-w-xs mb-6">
          <p className="text-xs text-muted mb-2">New achievements:</p>
          {result.achievements.map((a) => (
            <div key={a.id} className="flex items-center gap-2 mb-2">
              <span className="text-xl">{a.emoji}</span>
              <div>
                <p className="text-sm font-bold text-primary">{a.title}</p>
                <p className="text-xs text-secondary">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AftermathMessage
        difficulty={difficulty}
        outcome={result.success ? 'win' : result.batteryLevel <= 0 ? 'battery' : 'timeout'}
      />

      <div className="flex flex-col gap-3 w-full max-w-xs mt-6 mb-4">
        <button
          onClick={onReplay}
          className="w-full py-4 bg-accent-red text-primary font-bold rounded-xl text-lg active:scale-95 transition-transform"
        >
          ⚡ One More Run
        </button>
        <button
          onClick={onMenu}
          className="w-full py-2.5 bg-tertiary text-primary font-semibold rounded-xl active:scale-95 transition-transform"
        >
          Menu
        </button>
      </div>

      <p className="text-xs text-muted pb-4">
        {meta.totalRuns} run{meta.totalRuns !== 1 ? 's' : ''} total · {meta.wins}W / {meta.losses}L
      </p>

      <p className="text-center text-xs text-muted">
        Copyright 2026 PC3 Enterprises
      </p>
    </div>
  );
}

const CONFETTI_COLORS = ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7', '#f97316'];
const CONFETTI_COUNT = 30;

function Confetti() {
  // Deterministic positions (no Math.random — use index-based spread)
  const pieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    left: `${(i * 137.5) % 100}%`, // Golden angle spread
    delay: `${(i * 0.08) % 1.5}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + (i % 4) * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: p.left,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function RunReceipt({ stats, difficulty }: { stats: RunStats; difficulty: Difficulty }) {
  const lines: string[] = [];

  if (stats.miniGamesCompleted.length > 0) {
    lines.push(`Issues fixed: ${stats.miniGamesCompleted.length}`);
  }
  if (stats.interruptionsSurvived > 0) {
    lines.push(`"Can you just..." survived: ${stats.interruptionsSurvived}`);
  }
  if (stats.liesTold > 0) {
    lines.push(`Lies told: ${stats.liesTold}`);
  }
  if (stats.explanationsGiven > 0) {
    lines.push(`Explanations given: ${stats.explanationsGiven}`);
  }
  if (stats.guiltTripsTaken > 0) {
    lines.push(`Guilt trips endured: ${stats.guiltTripsTaken}`);
  }
  if (stats.spamsReceived > 0) {
    lines.push(`Spam notifications: ${stats.spamsReceived}`);
  }
  if (stats.adsTriggered > 0) {
    lines.push(`Ads accidentally tapped: ${stats.adsTriggered}`);
  }
  if (stats.decoysTapped > 0) {
    lines.push(`"Safe" apps whacked: ${stats.decoysTapped}`);
  }
  if (stats.zoomNotifications > 0) {
    lines.push(`Re-zoomed by notifications: ${stats.zoomNotifications}`);
  }
  if (stats.chargerUsed) {
    lines.push(`Charger used: yes (desperate)`);
  }

  if (lines.length === 0) return null;

  return (
    <div className="w-full max-w-xs my-4 p-3 bg-secondary rounded-xl border border-theme">
      <p className="text-xs font-bold text-muted mb-2">🧾 {difficultyNames[difficulty]} Support Receipt</p>
      <div className="flex flex-col gap-1">
        {lines.map((line, i) => (
          <p key={i} className="text-[0.7rem] text-secondary">{line}</p>
        ))}
      </div>
    </div>
  );
}
