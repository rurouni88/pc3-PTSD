import { useState, useRef, useEffect, useCallback } from 'react';
import { CharacterAvatar } from '../CharacterAvatar';
import { Hint } from '../Hint';
import { RngEngine } from '../../engine/seeded-rng';
import { playSound } from '../../engine/sound';
import { playHaptic } from '../../engine/haptics';
import { t, isRTL } from '../../config/translations';
import type { PasskeyConfig, Difficulty, MiniGameQuality, ForeignLanguage } from '../../types/game';
import type { Character } from '../CharacterAvatar';

interface PasskeySetupProps {
  difficulty: string;
  passkeyConfig: PasskeyConfig;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;
type Phase = 'hint' | 'playing' | 'complete';

// --- Step 2: Email garbling ---

interface EmailOption {
  label: string;
  isCorrect: boolean;
}

function generateEmailOptions(base: string, garbleCount: number): EmailOption[] {
  const correct = `${base}@gmail.com`;
  const garbles: string[] = [];

  const garblePatterns: (() => string)[] = [
    () => `${base}gmail.com`, // missing @
    () => `${base}@gmail.comm`, // double m
    () => `${base}@gmail.con`, // wrong TLD
    () => `${base[0].toUpperCase()}${base.slice(1)}@gmail.com`, // capitalised
    () => `${base}@ gmail.com`, // space after @
    () => `${base.slice(0, -1)}@gmail.com`, // missing last char
  ];

  // Shuffle garble patterns with seeded RNG
  const indices = garblePatterns.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(RngEngine.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  for (let i = 0; i < garbleCount + 1 && i < indices.length; i++) {
    garbles.push(garblePatterns[indices[i]]());
  }

  // Ensure we have exactly 3 options (1 correct + 2 wrong)
  while (garbles.length < 2) {
    garbles.push(`${base}@gmail.com`);
  }

  const options: EmailOption[] = [
    { label: correct, isCorrect: true },
    { label: garbles[0], isCorrect: false },
    { label: garbles[1], isCorrect: false },
  ];

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(RngEngine.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}

// --- Step 3: Inbox emails ---

interface InboxEmail {
  id: string;
  sender: string;
  subject: string;
  hasCode: boolean;
  code?: string;
}

function generateInbox(code: string): InboxEmail[] {
  return [
    { id: 'verify', sender: 'Apple ID', subject: `Your verification code is ${code}`, hasCode: true, code },
    { id: 'spam', sender: 'RAM Booster Pro', subject: 'FREE RAM! Click here to optimize!!', hasCode: false },
    { id: 'linda', sender: 'Linda', subject: "Did you see the photo???", hasCode: false },
  ];
}

// --- Main component ---

export function PasskeySetup({ difficulty, passkeyConfig, foreignLanguage, onComplete, onCancel }: PasskeySetupProps) {
  const [phase, setPhase] = useState<Phase>('hint');
  const [step, setStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Quality tracking
  const resendsRef = useRef(0);
  const scribbleHitRef = useRef(false);
  const cancelTapsRef = useRef(0);

  // Step 1: Face ID
  const [facePos, setFacePos] = useState({ x: 50, y: 50 });
  const [framePos, setFramePos] = useState({ x: 50, y: 80 });
  const [s1Progress, setS1Progress] = useState(0);
  const faceRef = useRef({ x: 50, y: 50 });
  const frameRef = useRef({ x: 50, y: 80 });
  const s1AlignedRef = useRef(0);
  const s1DoneRef = useRef(false);
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Step 2: Email
  const [emailOptions] = useState<EmailOption[]>(() =>
    generateEmailOptions(passkeyConfig.emailBase, passkeyConfig.garbleCount)
  );
  const [s2Flavour, setS2Flavour] = useState(false);

  // Step 3: Verification
  const [s3Code] = useState(() => {
    let code = '';
    for (let i = 0; i < 6; i++) code += Math.floor(RngEngine.random() * 10);
    return code;
  });
  const [s3Inbox] = useState<InboxEmail[]>(() => generateInbox(s3Code));
  const [s3View, setS3View] = useState<'prompt' | 'inbox' | 'filled'>('prompt');
  const [s3Resends, setS3Resends] = useState(0);
  const s3ResendsRef = useRef(0);
  const [s3ResendLock, setS3ResendLock] = useState(false);
  const [s3ResendDelay, setS3ResendDelay] = useState(false);

  // Step 4: Backup code
  const [s4Scribble, setS4Scribble] = useState(0); // 0-100
  const [s4Stopped, setS4Stopped] = useState(false);
  const [s4Hit, setS4Hit] = useState(false);
  const [s4Erasing, setS4Erasing] = useState(0);
  const s4ScribbleRef = useRef(0);
  const s4DoneRef = useRef(false);

  // Step 5: Punchline
  const [s5Struggling, setS5Struggling] = useState(false);
  const [s5Done, setS5Done] = useState(false);

  const completedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const d = difficulty as Difficulty;

  // --- Step 1: Face ID drift ---
  useEffect(() => {
    if (phase !== 'playing' || step !== 1) return;

    faceRef.current = { x: 30 + RngEngine.random() * 40, y: 30 + RngEngine.random() * 30 };
    setFacePos({ ...faceRef.current });

    const tick = () => {
      if (s1DoneRef.current) return;
      const { driftSpeed } = passkeyConfig.step1;
      const dx = (RngEngine.random() - 0.5) * driftSpeed * 2;
      const dy = (RngEngine.random() - 0.5) * driftSpeed * 2;
      faceRef.current.x = Math.max(15, Math.min(85, faceRef.current.x + dx));
      faceRef.current.y = Math.max(15, Math.min(85, faceRef.current.y + dy));
      setFacePos({ ...faceRef.current });

      // Check alignment (face must be in scan frame)
      const adx = faceRef.current.x - frameRef.current.x;
      const ady = faceRef.current.y - frameRef.current.y;
      const dist = Math.sqrt(adx * adx + ady * ady);
      if (dist < 18) {
        s1AlignedRef.current += 50;
        const pct = Math.min(100, (s1AlignedRef.current / passkeyConfig.step1.holdTimeMs) * 100);
        setS1Progress(pct);
        if (pct >= 100) {
          s1DoneRef.current = true;
          completeStep(1);
        }
      } else {
        s1AlignedRef.current = Math.max(0, s1AlignedRef.current - 25);
        setS1Progress(Math.max(0, (s1AlignedRef.current / passkeyConfig.step1.holdTimeMs) * 100));
      }

      // Random cancel tap
      if (passkeyConfig.step1.cancelTapChance > 0 && RngEngine.random() < passkeyConfig.step1.cancelTapChance * 0.02) {
        cancelTapsRef.current += 1;
        s1AlignedRef.current = 0;
        setS1Progress(0);
        playHaptic('faceid-distraction');
      }
    };

    intervalRef.current = setInterval(tick, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, step, passkeyConfig]);

  // --- Step 4: Scribble timer ---
  useEffect(() => {
    if (phase !== 'playing' || step !== 4 || s4Stopped || s4Hit) return;

    const increment = 100 / (passkeyConfig.step4.scribbleSpeedMs / 50);
    const interval = setInterval(() => {
      if (s4DoneRef.current) return;
      s4ScribbleRef.current = Math.min(100, s4ScribbleRef.current + increment);
      setS4Scribble(s4ScribbleRef.current);

      if (s4ScribbleRef.current >= 100) {
        setS4Hit(true);
        scribbleHitRef.current = true;
        playSound('failure');
        playHaptic('failure');
      }
    }, 50);

    return () => clearInterval(interval);
  }, [phase, step, s4Stopped, s4Hit, passkeyConfig]);

  // --- Step 5: Auto-struggle ---
  useEffect(() => {
    if (phase !== 'playing' || step !== 5 || s5Done) return;

    setS5Struggling(true);
    playSound('click');

    const timeout = setTimeout(() => {
      setS5Done(true);
      completeStep(5);
    }, passkeyConfig.step5.struggleDurationMs);

    return () => clearTimeout(timeout);
  }, [phase, step, s5Done, passkeyConfig]);

  const completeStep = useCallback((s: Step) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(s);
    setCompletedSteps(newCompleted);
    playSound('success');
    playHaptic('success');

    if (s === 5) {
      completedRef.current = true;
      setPhase('complete');
      setTimeout(() => {
        onComplete({
          passkeyResends: resendsRef.current,
          passkeyScribbleHit: scribbleHitRef.current,
          passkeyCancelTaps: cancelTapsRef.current,
        });
      }, 2000);
    } else {
      // Brief pause then advance
      setTimeout(() => {
        setStep((s + 1) as Step);
        // Reset step-specific state
        if (s === 1) { s1DoneRef.current = false; s1AlignedRef.current = 0; setS1Progress(0); }
        if (s === 3) { setS3View('prompt'); }
      }, 600);
    }
  }, [completedSteps, onComplete]);

  // --- Step 1: Pointer handlers for dragging the scan frame ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (step !== 1) return;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [step]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current || step !== 1) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    frameRef.current = { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
    setFramePos({ ...frameRef.current });
  }, [step]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  // --- Step 2 handlers ---
  const handleEmailSelect = useCallback((opt: EmailOption) => {
    if (opt.isCorrect) {
      setS2Flavour(true);
      setTimeout(() => completeStep(2), 1000);
    } else {
      playSound('failure');
      playHaptic('failure');
    }
  }, [completeStep]);

  // --- Step 3 handlers ---
  const handleCheckEmail = useCallback(() => {
    setS3View('inbox');
    playSound('click');
  }, []);

  const handleResend = useCallback(() => {
    if (s3ResendsRef.current >= 2) return;
    s3ResendsRef.current += 1;
    setS3Resends(s3ResendsRef.current);
    setS3ResendDelay(true);
    playSound('click');
    playHaptic('click');

    setTimeout(() => {
      setS3ResendDelay(false);
      if (s3ResendsRef.current >= 2) setS3ResendLock(true);
    }, passkeyConfig.step3.resendDelayMs);
  }, [passkeyConfig]);

  const handleInboxSelect = useCallback((email: InboxEmail) => {
    if (email.hasCode) {
      setS3View('filled');
      playSound('success');
      setTimeout(() => completeStep(3), 800);
    } else {
      playSound('failure');
      playHaptic('failure');
    }
  }, [completeStep]);

  // --- Step 4 handlers ---
  const handleStopScribble = useCallback(() => {
    if (s4Stopped || s4Hit) return;
    setS4Stopped(true);
    playSound('click');
    playHaptic('click');
    setTimeout(() => completeStep(4), 500);
  }, [s4Stopped, s4Hit, completeStep]);

  const handleErase = useCallback(() => {
    if (!s4Hit) return;
    const newCount = s4Erasing + 1;
    setS4Erasing(newCount);
    playSound('click');
    playHaptic('progress');
    if (newCount >= 3) {
      s4DoneRef.current = true;
      completeStep(4);
    }
  }, [s4Hit, s4Erasing, completeStep]);

  // --- Render ---

  if (phase === 'hint') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <div className="text-5xl">🔑</div>
        <h3 className="text-sm font-bold text-primary">{t(foreignLanguage, 'passkey.title')}</h3>
        <p className="text-xs text-secondary text-center max-w-[200px]">
          Help {d === 'dad' ? 'Dad' : d === 'mum' ? 'Mum' : 'Grandma'} set up a passkey for their email.
          Five steps. They will complicate all of them.
        </p>
        <button
          onClick={() => setPhase('playing')}
          className="mt-2 px-6 py-2 bg-accent-green text-primary text-xs font-bold rounded-xl active:scale-95 transition-transform"
        >
          Start Setup
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
        <div className="text-5xl">🔐</div>
        <p className="text-sm text-primary text-center font-medium">
          {passkeyConfig.step5.punchline}
        </p>
        <div className="flex gap-3 text-xs text-muted">
          {resendsRef.current > 0 && <span>{resendsRef.current} resend{resendsRef.current > 1 ? 's' : ''}</span>}
          {scribbleHitRef.current && <span>scribble hit</span>}
          {cancelTapsRef.current > 0 && <span>{cancelTapsRef.current} cancel tap{cancelTapsRef.current > 1 ? 's' : ''}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full p-4 select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-colors ${
              completedSteps.has(s) ? 'bg-green-500' : s === step ? 'bg-blue-400' : 'bg-secondary'
            }`}
          />
        ))}
        <span className="text-[0.65rem] text-muted ml-2">
          {['Face ID', 'Email', 'Verify', 'Backup', 'Done'][step - 1]}
        </span>
      </div>

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-muted text-xs"
      >
        ✕
      </button>

      {/* Step content */}
      <div className="flex-1 flex flex-col">
        {step === 1 && <Step1FaceId facePos={facePos} framePos={framePos} progress={s1Progress} character={d as Character} />}
        {step === 2 && <Step2Email options={emailOptions} flavour={s2Flavour} onSelect={handleEmailSelect} />}
        {step === 3 && (
          <Step3Verify
            view={s3View}
            inbox={s3Inbox}
            code={s3Code}
            resends={s3Resends}
            resendLock={s3ResendLock}
            resendDelay={s3ResendDelay}
            onCheckEmail={handleCheckEmail}
            onResend={handleResend}
            onInboxSelect={handleInboxSelect}
          />
        )}
        {step === 4 && (
          <Step4Backup
            scribble={s4Scribble}
            stopped={s4Stopped}
            hit={s4Hit}
            erasing={s4Erasing}
            onStop={handleStopScribble}
            onErase={handleErase}
          />
        )}
        {step === 5 && <Step5Punchline struggling={s5Struggling} done={s5Done} />}
      </div>
    </div>
  );
}

// --- Step sub-components ---

function Step1FaceId({ facePos, framePos, progress, character }: { facePos: { x: number; y: number }; framePos: { x: number; y: number }; progress: number; character: Character }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <Hint>Drag the scan frame over their face. Hold steady.</Hint>
      <div className="relative w-full flex-1 max-h-[180px]">
        {/* Drifting face */}
        <div
          className="absolute transition-none"
          style={{ left: `${facePos.x}%`, top: `${facePos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <CharacterAvatar character={character} size={64} />
        </div>
        {/* Draggable scan frame */}
        <div
          className="absolute w-24 h-24 border-2 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            left: `${framePos.x}%`,
            top: `${framePos.y}%`,
            transform: 'translate(-50%, -50%)',
            borderColor: progress > 0 ? '#22c55e' : '#60a5fa',
            backgroundColor: progress > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(96, 165, 250, 0.05)',
          }}
        >
          <span className="text-[0.6rem] text-muted">scan</span>
        </div>
      </div>
      <div className="w-full max-w-[200px] h-2 bg-secondary rounded-full overflow-hidden mt-2">
        <div className="h-full bg-green-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function Step2Email({ options, flavour, onSelect }: { options: EmailOption[]; flavour: boolean; onSelect: (o: EmailOption) => void }) {
  return (
    <div className="flex flex-col items-center flex-1 gap-3">
      <Hint>Fix the email address. Autocorrect has opinions.</Hint>
      {flavour ? (
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <span className="text-2xl">🤔</span>
          <p className="text-xs text-muted italic">"But I've always typed it like that."</p>
        </div>
      ) : (
        <>
          <p className="text-[0.65rem] text-muted">Which one is right?</p>
          <div className="flex flex-col gap-2 w-full max-w-[220px]">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onSelect(opt)}
                className="px-3 py-2.5 rounded-xl bg-secondary text-xs text-primary text-left active:scale-95 transition-transform font-mono"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Step3Verify({ view, inbox, code, resends, resendLock, resendDelay, onCheckEmail, onResend, onInboxSelect }: {
  view: 'prompt' | 'inbox' | 'filled';
  inbox: InboxEmail[];
  code: string;
  resends: number;
  resendLock: boolean;
  resendDelay: boolean;
  onCheckEmail: () => void;
  onResend: () => void;
  onInboxSelect: (e: InboxEmail) => void;
}) {
  if (view === 'filled') {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <div className="text-3xl">✉️</div>
        <p className="text-sm text-primary font-medium">Code: {code}</p>
        <p className="text-xs text-green-400">Verification complete!</p>
      </div>
    );
  }

  if (view === 'inbox') {
    return (
      <div className="flex flex-col flex-1 gap-2">
        <Hint>Find the verification email.</Hint>
        <div className="flex flex-col gap-2 mt-2">
          {inbox.map((email) => (
            <button
              key={email.id}
              onClick={() => onInboxSelect(email)}
              className="px-3 py-2.5 rounded-xl bg-secondary text-left active:scale-95 transition-transform"
            >
              <p className="text-xs text-primary font-medium">{email.sender}</p>
              <p className="text-[0.65rem] text-muted truncate">{email.subject}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <div className="text-3xl">📧</div>
      <p className="text-sm text-primary text-center">Verification code sent to your email.</p>
      <p className="text-[0.65rem] text-muted">"Which email?" "The one we're setting up."</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onCheckEmail}
          disabled={resendDelay}
          className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-medium active:scale-95 transition-transform"
        >
          Check Email
        </button>
        <button
          onClick={onResend}
          disabled={resendLock || resendDelay}
          className={`px-4 py-2 rounded-xl text-xs font-medium active:scale-95 transition-transform ${
            resendLock ? 'bg-secondary text-muted opacity-50' : 'bg-secondary text-primary'
          }`}
        >
          {resendDelay ? 'Sending...' : `Resend (${2 - resends})`}
        </button>
      </div>
    </div>
  );
}

function Step4Backup({ scribble, stopped, hit, erasing, onStop, onErase }: {
  scribble: number;
  stopped: boolean;
  hit: boolean;
  erasing: number;
  onStop: () => void;
  onErase: () => void;
}) {
  if (stopped) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <div className="text-3xl">✋</div>
        <p className="text-sm text-primary font-medium">Stopped in time!</p>
        <p className="text-[0.65rem] text-muted italic">"But where else do I write it?"</p>
      </div>
    );
  }

  if (hit) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <div className="text-3xl">📝</div>
        <p className="text-sm text-primary font-medium">They wrote on the screen!</p>
        <p className="text-xs text-muted">Tap 3 times to erase</p>
        <button
          onClick={onErase}
          className="px-6 py-3 rounded-xl bg-yellow-500/20 text-yellow-400 text-sm font-bold active:scale-95 transition-transform"
        >
          Erase ({3 - erasing} left)
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      <Hint>Stop them before the stylus hits the code!</Hint>
      {/* Backup code display */}
      <div className="relative w-full max-w-[220px] h-16 bg-secondary rounded-xl flex items-center justify-center overflow-hidden">
        <span className="text-xs font-mono text-primary tracking-wider">XK4-9M2-PQ7-1LZ-8RN-3TW-5VH</span>
        {/* Scribble overlay */}
        <div
          className="absolute top-0 left-0 h-full bg-red-500/20 border-r-2 border-red-400 transition-none"
          style={{ width: `${scribble}%` }}
        >
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-lg">✏️</span>
        </div>
      </div>
      <button
        onClick={onStop}
        className="px-8 py-3 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold active:scale-95 transition-transform"
      >
        ✋ STOP!
      </button>
    </div>
  );
}

function Step5Punchline({ struggling, done }: { struggling: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3">
      {struggling && !done ? (
        <>
          <div className="text-4xl animate-bounce">🖐️</div>
          <p className="text-sm text-primary font-bold">"I'M NOT DELETING MY PASSWORD!"</p>
          <p className="text-xs text-muted">Parent hand covers the button...</p>
        </>
      ) : done ? (
        <>
          <div className="text-4xl">🔐</div>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Passkey: ✓</span>
            <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">Password: ✓</span>
          </div>
          <p className="text-[0.65rem] text-muted">Two ways to lock yourself out.</p>
        </>
      ) : null}
    </div>
  );
}
