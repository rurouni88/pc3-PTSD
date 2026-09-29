import { useState, useRef, useEffect, useCallback } from 'react';
import { CharacterAvatar } from '../CharacterAvatar';
import { Hint } from '../Hint';
import { RngEngine } from '../../engine/seeded-rng';
import { playSound } from '../../engine/sound';
import { playHaptic } from '../../engine/haptics';
import { t } from '../../config/translations';
import type { FaceIdConfig, Difficulty, ForeignLanguage, MiniGameQuality } from '../../types/game';
import type { Character } from '../CharacterAvatar';

interface FaceIdSetupProps {
  difficulty: string;
  faceIdConfig: FaceIdConfig;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

type Phase = 'hint' | 'setup' | 'distraction' | 'complete';

const distractionMessages: Record<Difficulty, string[]> = {
  dad: [
    'No, we\'re scanning YOUR face, not the wall.',
    'Dad has repositioned. Again.',
    'That was 80% forehead.',
  ],
  mum: [
    'Mum is now looking at the ceiling fan.',
    'The face you scanned is 40% chin.',
    'She\'s doing her "thinking face" again.',
  ],
  grandma: [
    'Grandma is showing you her ceiling fan.',
    'That scan is 60% chin, 40% wall.',
    'She\'s looking at a bird outside. Again.',
  ],
};

const completionMessages: Record<Difficulty, string> = {
  dad: 'FaceID registered. Dad says it looks "aggressive".',
  mum: 'FaceID set! Mum says it\'s "not flattering" but accepts it.',
  grandma: 'FaceID done. Grandma says the phone now "recognises her grandchild".',
};

export function FaceIdSetup({ difficulty, faceIdConfig, foreignLanguage, onComplete, onCancel }: FaceIdSetupProps) {
  const [phase, setPhase] = useState<Phase>('hint');
  const [progress, setProgress] = useState(0); // 0-100
  const [distractions, setDistractions] = useState(0);
  const [distractionMsg, setDistractionMsg] = useState('');
  const [facePos, setFacePos] = useState({ x: 50, y: 50 }); // percentage
  const [framePos, setFramePos] = useState({ x: 50, y: 80 }); // percentage

  const containerRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef({ x: 50, y: 50 });
  const frameRef = useRef({ x: 50, y: 80 });
  const progressRef = useRef(0);
  const alignedTimeRef = useRef(0);
  const lastDistractionRef = useRef(Date.now());
  const distractionsRef = useRef(0);
  const draggingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);
  const wasAlignedRef = useRef(false);

  // Initialize face position
  useEffect(() => {
    faceRef.current = { x: 30 + RngEngine.random() * 40, y: 30 + RngEngine.random() * 30 };
    setFacePos({ ...faceRef.current });
  }, []);

  // Drift interval — face moves using seeded RNG
  useEffect(() => {
    if (phase !== 'setup') return;

    const tick = () => {
      const { driftSpeed, driftPattern } = faceIdConfig;
      let dx = 0;
      let dy = 0;

      if (driftPattern === 'gentle') {
        dx = (RngEngine.random() - 0.5) * driftSpeed;
        dy = (RngEngine.random() - 0.5) * driftSpeed;
      } else if (driftPattern === 'erratic') {
        dx = (RngEngine.random() - 0.5) * driftSpeed * 2;
        dy = (RngEngine.random() - 0.5) * driftSpeed * 2;
        if (RngEngine.random() < 0.1) {
          dx = (RngEngine.random() - 0.5) * driftSpeed * 5;
          dy = (RngEngine.random() - 0.5) * driftSpeed * 5;
        }
      } else {
        // shaky — constant small jitter + occasional big jumps
        dx = (RngEngine.random() - 0.5) * driftSpeed * 1.5;
        dy = (RngEngine.random() - 0.5) * driftSpeed * 1.5;
        if (RngEngine.random() < 0.08) {
          dx = (RngEngine.random() - 0.5) * driftSpeed * 6;
          dy = (RngEngine.random() - 0.5) * driftSpeed * 6;
        }
      }

      faceRef.current.x = Math.max(15, Math.min(85, faceRef.current.x + dx));
      faceRef.current.y = Math.max(15, Math.min(85, faceRef.current.y + dy));
      setFacePos({ ...faceRef.current });
    };

    intervalRef.current = setInterval(tick, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, faceIdConfig]);

  // Alignment check + progress + distraction timer
  useEffect(() => {
    if (phase !== 'setup') return;

    const check = () => {
      if (completedRef.current) return;

      const dx = faceRef.current.x - frameRef.current.x;
      const dy = faceRef.current.y - frameRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = faceIdConfig.frameSize / 8; // scale from px config to %

      const now = Date.now();

      if (dist < threshold) {
        // Aligned — accumulate progress
        if (!wasAlignedRef.current) {
          wasAlignedRef.current = true;
          playHaptic('faceid-aligned');
        }
        alignedTimeRef.current += 50;
        const newProgress = Math.min(100, (alignedTimeRef.current / faceIdConfig.holdTimeMs) * 100);
        progressRef.current = newProgress;
        setProgress(newProgress);

        if (newProgress >= 100) {
          completedRef.current = true;
          setPhase('complete');
          playSound('success');
          setTimeout(() => onComplete({ distractionsTriggered: distractionsRef.current }), 1500);
          return;
        }
      } else {
        // Not aligned — decay progress slowly
        alignedTimeRef.current = Math.max(0, alignedTimeRef.current - 25);
        progressRef.current = Math.max(0, (alignedTimeRef.current / faceIdConfig.holdTimeMs) * 100);
        setProgress(progressRef.current);
      }

      // Distraction check
      if (
        distractionsRef.current < faceIdConfig.maxDistractions &&
        now - lastDistractionRef.current > faceIdConfig.distractionTimerMs &&
        progressRef.current < 50
      ) {
        lastDistractionRef.current = now;
        distractionsRef.current += 1;
        setDistractions(distractionsRef.current);
        const d = difficulty as Difficulty;
        setDistractionMsg(distractionMessages[d][distractionsRef.current % distractionMessages[d].length]);
        setPhase('distraction');
        playSound('failure');
        playHaptic('faceid-distraction');
        wasAlignedRef.current = false;

        // Reset after distraction
        setTimeout(() => {
          progressRef.current = 0;
          alignedTimeRef.current = 0;
          setProgress(0);
          // Re-randomize face position
          faceRef.current = { x: 20 + RngEngine.random() * 60, y: 20 + RngEngine.random() * 50 };
          setFacePos({ ...faceRef.current });
          setPhase('setup');
        }, 2000);
      }

      rafRef.current = requestAnimationFrame(check);
    };

    rafRef.current = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, faceIdConfig, difficulty, onComplete]);

  // Pointer handlers for dragging the frame
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (phase !== 'setup') return;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [phase]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current || phase !== 'setup') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    frameRef.current = { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
    setFramePos({ ...frameRef.current });
  }, [phase]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  if (phase === 'hint') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">🔐</div>
        <h3 className="text-sm font-bold text-primary">FaceID Setup</h3>
        <p className="text-xs text-secondary text-center max-w-[200px]">
          Drag the <span className="text-blue-400 font-medium">scan frame</span> over their face and hold steady to complete the scan.
        </p>
        <p className="text-[10px] text-muted text-center">
          Warning: they will not hold still.
        </p>
        <button
          onClick={() => setPhase('setup')}
          className="mt-2 px-6 py-2 bg-accent-green text-primary text-xs font-bold rounded-xl active:scale-95 transition-transform"
        >
          Start Scan
        </button>
        <button
          onClick={onCancel}
          className="text-[10px] text-muted active:text-primary"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">✅</div>
        <p className="text-sm text-primary text-center font-medium">{completionMessages[difficulty as Difficulty]}</p>
        {distractions > 0 && (
          <p className="text-xs text-muted">{distractions} distraction{distractions > 1 ? 's' : ''} survived</p>
        )}
      </div>
    );
  }

  if (phase === 'distraction') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-6xl animate-bounce">🫤</div>
        <p className="text-sm text-primary text-center font-medium">{distractionMsg}</p>
        <p className="text-xs text-muted">Progress reset. Try again!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full touch-none select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Hint */}
      <div className="absolute top-2 left-0 right-0 z-10">
        <Hint>Drag the frame over their face. Hold steady to scan.</Hint>
      </div>

      {/* Drifting face */}
      <div
        className="absolute transition-none"
        style={{
          left: `${facePos.x}%`,
          top: `${facePos.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CharacterAvatar character={difficulty as Character} size={72} />
      </div>

      {/* Draggable scan frame */}
      <div
        className="absolute border-2 border-blue-400 rounded-2xl flex items-center justify-center"
        style={{
          left: `${framePos.x}%`,
          top: `${framePos.y}%`,
          width: `${faceIdConfig.frameSize * 1.5}px`,
          height: `${faceIdConfig.frameSize * 1.5}px`,
          transform: 'translate(-50%, -50%)',
          borderColor: progress > 0 ? '#22c55e' : '#60a5fa',
          backgroundColor: progress > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(96, 165, 250, 0.05)',
        }}
      >
        {/* FaceID icon in frame */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400">
          <path d="M4 8V6a2 2 0 0 1 2-2h2" />
          <path d="M16 4h2a2 2 0 0 1 2 2v2" />
          <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
          <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9 14 Q12 16 15 14" strokeLinecap="round" />
        </svg>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-muted mt-1 text-center">
          {t(foreignLanguage, progress < 30 ? 'faceid.aligning' : progress < 70 ? 'faceid.scanning' : 'faceid.almost')}
        </p>
      </div>

      {/* Distraction counter */}
      {distractions > 0 && (
        <div className="absolute top-10 right-2 text-[10px] text-muted">
          {t(foreignLanguage, 'faceid.distractions', { n: distractions, max: faceIdConfig.maxDistractions })}
        </div>
      )}

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-muted text-xs"
      >
        ✕
      </button>
    </div>
  );
}
