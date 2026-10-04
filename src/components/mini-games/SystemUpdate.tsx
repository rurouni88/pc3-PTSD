import { useState, useRef, useEffect, useCallback } from 'react';
import { Hint } from '../Hint';
import { RngEngine } from '../../engine/seeded-rng';
import { playSound } from '../../engine/sound';
import { playHaptic } from '../../engine/haptics';
import { t, isRTL } from '../../config/translations';
import type { SystemUpdateConfig, Difficulty, MiniGameQuality, ForeignLanguage } from '../../types/game';

interface SystemUpdateProps {
  difficulty: string;
  systemUpdateConfig: SystemUpdateConfig;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

type Phase = 'hint' | 'playing' | 'stall' | 'prompt' | 'complete';

interface DecoyButton {
  id: number;
  label: string;
  x: number; // percentage
  y: number; // percentage
  expiresAt: number; // timestamp
}

interface PromptData {
  question: string;
  safeLabel: string;
  riskyLabel: string;
}

const DECOY_LABELS = [
  'Skip Update',
  'Cancel',
  'Install Later',
  'Reboot Now',
  'Factory Reset',
  'Restore Defaults',
  'Turn Off Phone',
  'Delete All',
];

const PROMPTS: Record<Difficulty, PromptData[]> = {
  dad: [
    { question: "Mate, is it almost done?", safeLabel: 'Wait', riskyLabel: 'Let me check' },
    { question: "Can I check my golf scores real quick?", safeLabel: 'Not now', riskyLabel: 'Sure, one sec' },
  ],
  mum: [
    { question: "Why is it taking so long? I had a quick word with Linda.", safeLabel: 'It needs time', riskyLabel: 'Let me look' },
    { question: "Can I take a photo while we wait?", safeLabel: 'No, don\u2019t touch it', riskyLabel: 'Go ahead' },
    { question: "Is it supposed to be that warm?", safeLabel: 'Yes, updates do that', riskyLabel: 'Let me check' },
  ],
  grandma: [
    { question: "Is the phone cooking something? It's hot.", safeLabel: 'It\u2019s working hard', riskyLabel: 'Let me feel it' },
    { question: "Can I put my reading glasses on it to help?", safeLabel: 'No Grandma', riskyLabel: 'That might help' },
    { question: "Should I sing to it? That usually helps.", safeLabel: 'No, just wait', riskyLabel: 'Sure, sing away' },
    { question: "I think I hear it crying. Should I call someone?", safeLabel: 'It\u2019s just the fan', riskyLabel: 'Let me listen' },
  ],
};

const STALL_MESSAGES = [
  'Preparing...',
  "Don't turn off your phone",
  'Updating... (still updating)',
  'Optimising...',
  'Almost done... (not almost)',
];

const COMPLETION_MESSAGES: Record<Difficulty, string> = {
  dad: 'Update complete. Your phone is now 0.3% slower. Dad says it\u2019s "running smoother".',
  mum: 'Update complete. Mum immediately asks if the update added a new font.',
  grandma: 'Update complete. Grandma asks if the update "fixed the cat photo".',
};

export function SystemUpdate({ difficulty, systemUpdateConfig, foreignLanguage, onComplete, onCancel }: SystemUpdateProps) {
  const [phase, setPhase] = useState<Phase>('hint');
  const [progress, setProgress] = useState(0);
  const [decoys, setDecoys] = useState<DecoyButton[]>([]);
  const [stallMsg, setStallMsg] = useState('');
  const [activePrompt, setActivePrompt] = useState<PromptData | null>(null);

  const progressRef = useRef(0);
  const completedRef = useRef(false);
  const decoysSpawnedRef = useRef(0);
  const promptsShownRef = useRef(0);
  const stallsShownRef = useRef(0);
  const decoysTappedRef = useRef(0);
  const wrongPromptsRef = useRef(0);
  const stallsSurvivedRef = useRef(0);
  const decoyIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const d = difficulty as Difficulty;

  const config = systemUpdateConfig;

  // Main progress loop
  useEffect(() => {
    if (phase !== 'playing') return;

    const tickMs = 50;
    const increment = (100 / (config.cleanDurationMs / tickMs));

    intervalRef.current = setInterval(() => {
      if (completedRef.current) return;

      progressRef.current = Math.min(100, progressRef.current + increment);
      setProgress(progressRef.current);

      if (progressRef.current >= 100) {
        completedRef.current = true;
        setPhase('complete');
        playSound('success');
        playHaptic('complete');
        setTimeout(() => {
          onComplete({
            updateDecoysTapped: decoysTappedRef.current,
            updateWrongPrompts: wrongPromptsRef.current,
            updateStallsSurvived: stallsSurvivedRef.current,
          });
        }, 2000);
      }
    }, tickMs);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, config.cleanDurationMs, onComplete]);

  // Decoy spawner
  useEffect(() => {
    if (phase !== 'playing') return;

    const spawn = () => {
      if (completedRef.current) return;
      if (decoysSpawnedRef.current >= config.decoyCount) return;

      decoysSpawnedRef.current += 1;
      decoyIdRef.current += 1;

      const label = DECOY_LABELS[Math.floor(RngEngine.random() * DECOY_LABELS.length)];
      const decoy: DecoyButton = {
        id: decoyIdRef.current,
        label,
        x: 15 + RngEngine.random() * 70,
        y: 20 + RngEngine.random() * 60,
        expiresAt: Date.now() + 3000,
      };

      setDecoys((prev) => [...prev, decoy]);

      // Remove expired decoys
      setTimeout(() => {
        setDecoys((prev) => prev.filter((d) => d.id !== decoy.id));
      }, 3000);
    };

    const interval = setInterval(spawn, config.decoyIntervalMs);
    return () => clearInterval(interval);
  }, [phase, config.decoyCount, config.decoyIntervalMs]);

  // Prompt spawner (at progress thresholds)
  useEffect(() => {
    if (phase !== 'playing' || completedRef.current) return;

    const thresholds = Array.from({ length: config.promptCount }, (_, i) =>
      ((i + 1) / (config.promptCount + 1)) * 80 + 10
    );

    const check = setInterval(() => {
      if (completedRef.current) return;
      if (promptsShownRef.current >= config.promptCount) return;

      const nextThreshold = thresholds[promptsShownRef.current];
      if (progressRef.current >= nextThreshold) {
        promptsShownRef.current += 1;
        const prompt = PROMPTS[d][promptsShownRef.current - 1 % PROMPTS[d].length];
        setActivePrompt(prompt);
        setPhase('prompt');
        playSound('notification');
        playHaptic('interrupt');
      }
    }, 500);

    return () => clearInterval(check);
  }, [phase, config.promptCount, d]);

  // Stall spawner (at progress thresholds)
  useEffect(() => {
    if (phase !== 'playing' || completedRef.current) return;

    const thresholds = Array.from({ length: config.stallCount }, (_, i) =>
      ((i + 1) / (config.stallCount + 1)) * 70 + 15
    );

    const check = setInterval(() => {
      if (completedRef.current) return;
      if (stallsShownRef.current >= config.stallCount) return;

      const nextThreshold = thresholds[stallsShownRef.current];
      if (progressRef.current >= nextThreshold) {
        stallsShownRef.current += 1;
        const msg = STALL_MESSAGES[Math.floor(RngEngine.random() * STALL_MESSAGES.length)];
        setStallMsg(msg);
        setPhase('stall');
        playHaptic('progress');

        setTimeout(() => {
          stallsSurvivedRef.current += 1;
          setStallMsg('');
          setPhase('playing');
        }, 2000 + RngEngine.random() * 1000);
      }
    }, 500);

    return () => clearInterval(check);
  }, [phase, config.stallCount]);

  const handleDecoyTap = useCallback((_decoy: DecoyButton) => {
    if (completedRef.current) return;
    decoysTappedRef.current += 1;
    progressRef.current = Math.max(0, progressRef.current - config.decoyPenalty);
    setProgress(progressRef.current);
    setDecoys((prev) => prev.filter((d) => d.id !== _decoy.id));
    playSound('failure');
    playHaptic('failure');
  }, [config.decoyPenalty]);

  const handlePromptSafe = useCallback(() => {
    setActivePrompt(null);
    setPhase('playing');
    playSound('click');
  }, []);

  const handlePromptRisky = useCallback(() => {
    wrongPromptsRef.current += 1;
    progressRef.current = Math.max(0, progressRef.current - config.promptPenalty);
    setProgress(progressRef.current);
    setActivePrompt(null);
    setPhase('playing');
    playSound('failure');
    playHaptic('failure');
  }, [config.promptPenalty]);

  // --- Render ---

  if (phase === 'hint') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">📲</div>
        <h3 className="text-sm font-bold text-primary">{t(foreignLanguage, 'update.title')}</h3>
        <p className="text-xs text-secondary text-center max-w-[200px]">
          {t(foreignLanguage, 'update.doNothing')}. Wait. Survive.
        </p>
        <button
          onClick={() => setPhase('playing')}
          className="mt-2 px-6 py-2 bg-accent-green text-primary text-xs font-bold rounded-xl active:scale-95 transition-transform"
        >
          Start Update
        </button>
        <button onClick={onCancel} className="text-[0.65rem] text-muted active:text-primary">
          Cancel
        </button>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">✅</div>
        <p className="text-sm text-primary text-center font-medium">{COMPLETION_MESSAGES[d]}</p>
        <div className="flex gap-3 text-xs text-muted">
          {decoysTappedRef.current > 0 && <span>{decoysTappedRef.current} decoy tapped</span>}
          {wrongPromptsRef.current > 0 && <span>{wrongPromptsRef.current} wrong answer</span>}
          <span>{stallsSurvivedRef.current} stall{stallsSurvivedRef.current !== 1 ? 's' : ''} survived</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full p-4 select-none">
      {/* Cancel */}
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-muted text-xs"
      >
        ✕
      </button>

      {/* Hint */}
      <Hint>Don't tap anything. Just wait. (This is the hardest part.)</Hint>

      {/* Progress bar */}
      <div className="w-full max-w-[250px] mt-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.65rem] text-muted">
            {phase === 'stall' ? stallMsg : progress < 30 ? 'Installing...' : progress < 70 ? 'Updating...' : 'Almost done...'}
          </span>
          <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Decoy buttons */}
      {decoys.map((decoy) => (
        <button
          key={decoy.id}
          onClick={() => handleDecoyTap(decoy)}
          className="absolute px-3 py-2 rounded-xl bg-red-500/20 text-red-400 text-[0.65rem] font-bold border border-red-500/30 active:scale-95 transition-transform"
          style={{ left: `${decoy.x}%`, top: `${decoy.y}%` }}
        >
          {decoy.label}
        </button>
      ))}

      {/* Prompt overlay */}
      {phase === 'prompt' && activePrompt && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
          <div className="bg-secondary rounded-2xl p-4 mx-6 max-w-[260px]">
            <p className="text-sm text-primary text-center mb-3">{activePrompt.question}</p>
            <div className="flex gap-2">
              <button
                onClick={handlePromptSafe}
                className="flex-1 px-3 py-2.5 rounded-xl bg-green-500/20 text-green-400 text-xs font-bold active:scale-95 transition-transform"
              >
                {activePrompt.safeLabel}
              </button>
              <button
                onClick={handlePromptRisky}
                className="flex-1 px-3 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold active:scale-95 transition-transform"
              >
                {activePrompt.riskyLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stall overlay */}
      {phase === 'stall' && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-secondary/90 rounded-xl px-4 py-2">
            <p className="text-xs text-primary animate-pulse">{stallMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
