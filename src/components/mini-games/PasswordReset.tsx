// PasswordReset — "The Password" mini-game.
// Build a password from an on-screen keyboard while requirements shift.
// Escalating absurdity: normal → weird → contradictory.
// Win: submit with all requirements met. Lose: timeout or 3 rejections.

import { useState, useEffect, useCallback, useRef } from 'react';
import { CancelButton } from '../CancelButton';
import { Hint } from '../Hint';
import { RngEngine } from '../../engine/seeded-rng';
import { playSound } from '../../engine/sound';
import { playHaptic } from '../../engine/haptics';
import type { Difficulty, ForeignLanguage, MiniGameQuality } from '../../types/game';

interface PasswordResetProps {
  difficulty: string;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

interface Requirement {
  id: number;
  text: string;
  type: 'must' | 'mustNot';
  check: (password: string) => boolean;
}

const GAME_TIME = 45;
const REQUIREMENT_INTERVAL = 4000; // ms between requirement changes
const MAX_REJECTIONS = 3;

// Requirement pools per round
const ROUND_1: Omit<Requirement, 'id'>[] = [
  { text: '8+ characters', type: 'must', check: (p) => p.length >= 8 },
  { text: 'Capital letter', type: 'must', check: (p) => /[A-Z]/.test(p) },
  { text: 'Number', type: 'must', check: (p) => /[0-9]/.test(p) },
];

const ROUND_2: Omit<Requirement, 'id'>[] = [
  { text: '8+ characters', type: 'must', check: (p) => p.length >= 8 },
  { text: 'Capital letter', type: 'must', check: (p) => /[A-Z]/.test(p) },
  { text: 'Number', type: 'must', check: (p) => /[0-9]/.test(p) },
  { text: 'Special character (!@#$)', type: 'must', check: (p) => /[!@#$%&*]/.test(p) },
  { text: 'Cannot contain "mum"', type: 'mustNot', check: (p) => !/mum/i.test(p) },
  { text: 'Cannot be a dictionary word', type: 'must', check: (p) => p.length >= 8 }, // always true (simplification)
];

const ROUND_3: Omit<Requirement, 'id'>[] = [
  { text: '8+ characters', type: 'must', check: (p) => p.length >= 8 },
  { text: 'Capital letter', type: 'must', check: (p) => /[A-Z]/.test(p) },
  { text: 'Must contain a number', type: 'must', check: (p) => /[0-9]/.test(p) },
  { text: 'Cannot contain a number', type: 'mustNot', check: (p) => !/[0-9]/.test(p) },
  { text: 'Must be same as previous', type: 'must', check: () => false }, // impossible
  { text: 'Cannot be same as previous', type: 'mustNot', check: () => true }, // always true
  { text: 'Special character (!@#$)', type: 'must', check: (p) => /[!@#$%&*]/.test(p) },
];

// Sub-sets used per round (not all at once)
const ROUND_1_SETS: Omit<Requirement, 'id'>[][] = [
  [ROUND_1[0], ROUND_1[1], ROUND_1[2]],
  [ROUND_1[0], ROUND_1[1], ROUND_1[2]],
];

const ROUND_2_SETS: Omit<Requirement, 'id'>[][] = [
  [ROUND_2[0], ROUND_2[1], ROUND_2[2], ROUND_2[3]],
  [ROUND_2[0], ROUND_2[1], ROUND_2[2], ROUND_2[3], ROUND_2[4]],
  [ROUND_2[0], ROUND_2[1], ROUND_2[2], ROUND_2[3], ROUND_2[5]],
];

const ROUND_3_SETS: Omit<Requirement, 'id'>[][] = [
  [ROUND_3[0], ROUND_3[1], ROUND_3[2], ROUND_3[3]],
  [ROUND_3[0], ROUND_3[1], ROUND_3[4], ROUND_3[5], ROUND_3[6]],
  [ROUND_3[0], ROUND_3[1], ROUND_3[2], ROUND_3[3], ROUND_3[6]],
];

const KEYBOARD_ROWS = [
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
  ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
  ['u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4'],
  ['5', '6', '7', '8', '9', '!', '@', '#', '$', '⌫'],
];

const SHIFT_KEY = '⇧';

export function PasswordReset({ difficulty, foreignLanguage, onComplete, onCancel }: PasswordResetProps) {
  const [password, setPassword] = useState('');
  const [shifted, setShifted] = useState(false);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [round, setRound] = useState(1);
  const [rejections, setRejections] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [policyFlash, setPolicyFlash] = useState(false);
  const [rejectFlash, setRejectFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reqTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reqIndexRef = useRef(0);

  const getRoundSets = useCallback((r: number) => {
    if (r === 1) return ROUND_1_SETS;
    if (r === 2) return ROUND_2_SETS;
    return ROUND_3_SETS;
  }, []);

  const applyRequirements = useCallback((r: number) => {
    const sets = getRoundSets(r);
    const idx = reqIndexRef.current % sets.length;
    const base = sets[idx];
    const reqs = base.map((req, i) => ({ ...req, id: i }));
    setRequirements(reqs);
    reqIndexRef.current++;
  }, [getRoundSets]);

  // Initialize
  useEffect(() => {
    applyRequirements(1);
  }, [applyRequirements]);

  // Game timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          playSound('failure');
          playHaptic('failure');
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [onComplete]);

  // Requirement rotation
  useEffect(() => {
    reqTimerRef.current = setInterval(() => {
      setPolicyFlash(true);
      setTimeout(() => setPolicyFlash(false), 600);
      playSound('notification');

      // Advance round every 15 seconds (3 requirement changes per round)
      const elapsed = GAME_TIME - timeLeft;
      const newRound = elapsed < 15 ? 1 : elapsed < 30 ? 2 : 3;
      if (newRound !== round) {
        setRound(newRound);
        reqIndexRef.current = 0;
      }
      applyRequirements(newRound);
    }, REQUIREMENT_INTERVAL);
    return () => { if (reqTimerRef.current) clearInterval(reqTimerRef.current); };
  }, [timeLeft, round, applyRequirements]);

  const handleKey = useCallback((key: string) => {
    if (key === '⌫') {
      setPassword((prev) => prev.slice(0, -1));
      return;
    }
    if (key === SHIFT_KEY) {
      setShifted((prev) => !prev);
      return;
    }
    const char = shifted ? key.toUpperCase() : key;
    setPassword((prev) => (prev.length < 20 ? prev + char : prev));
    if (shifted) setShifted(false);
  }, [shifted]);

  const allMet = requirements.length > 0 && requirements.every((r) => r.check(password));

  const handleSubmit = useCallback(() => {
    if (allMet) {
      playSound('success');
      playHaptic('complete');
      const timeBonus = timeLeft > 30 ? 'great' : timeLeft > 15 ? 'good' : 'ok';
      onComplete(timeBonus as MiniGameQuality);
    } else {
      playSound('failure');
      playHaptic('failure');
      setRejectFlash(true);
      setTimeout(() => setRejectFlash(false), 500);
      const newRejections = rejections + 1;
      setRejections(newRejections);
      if (newRejections >= MAX_REJECTIONS) {
        onComplete();
      }
    }
  }, [allMet, rejections, timeLeft, onComplete]);

  return (
    <div className="flex flex-col h-full bg-secondary select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <Hint>Build a password that meets ALL requirements. They change. Good luck.</Hint>
        <span className="text-xs font-mono text-primary">{timeLeft}s</span>
        <CancelButton onClick={onCancel} />
      </div>

      {/* Policy flash */}
      {policyFlash && (
        <div className="mx-3 mb-1 px-2 py-1 bg-accent-yellow/20 border border-accent-yellow/40 rounded text-[0.65rem] text-accent-yellow text-center animate-fade-in">
          🔄 IT Policy Updated
        </div>
      )}

      {/* Reject flash */}
      {rejectFlash && (
        <div className="mx-3 mb-1 px-2 py-1 bg-accent-red/20 border border-accent-red/40 rounded text-[0.65rem] text-accent-red text-center animate-fade-in">
          ❌ This password is invalid
        </div>
      )}

      {/* Password display */}
      <div className="mx-3 mb-2 p-2 bg-primary border border-theme rounded-lg min-h-[40px] flex items-center">
        <span className="font-mono text-sm text-primary tracking-wider">
          {password || <span className="text-muted">Type your password...</span>}
        </span>
      </div>

      {/* Requirements */}
      <div className="mx-3 mb-2 flex-1 overflow-y-auto">
        <p className="text-[0.65rem] text-muted mb-1 font-semibold">REQUIREMENTS (Round {round}/3)</p>
        <div className="flex flex-col gap-1">
          {requirements.map((req) => {
            const met = req.check(password);
            return (
              <div
                key={req.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[0.7rem] transition-colors ${
                  met ? 'bg-accent-green/15 text-accent-green' : 'bg-accent-red/10 text-accent-red'
                }`}
              >
                <span>{met ? '✅' : '❌'}</span>
                <span>{req.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rejections */}
      <div className="mx-3 mb-1 flex items-center gap-1">
        <span className="text-[0.6rem] text-muted">Attempts:</span>
        {Array.from({ length: MAX_REJECTIONS }, (_, i) => (
          <span key={i} className={`text-[0.6rem] ${i < rejections ? 'text-accent-red' : 'text-muted'}`}>●</span>
        ))}
      </div>

      {/* Submit */}
      <div className="mx-3 mb-2">
        <button
          onClick={handleSubmit}
          className={`w-full py-2 rounded-lg font-bold text-sm transition-all active:scale-95 ${
            allMet
              ? 'bg-accent-green text-primary'
              : 'bg-tertiary text-muted'
          }`}
        >
          Reset Password
        </button>
      </div>

      {/* Keyboard */}
      <div className="px-2 pb-2 flex flex-col gap-1">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`w-8 h-8 rounded text-xs font-mono flex items-center justify-center transition-all active:scale-90 ${
                  key === '⌫'
                    ? 'bg-accent-red/20 text-accent-red'
                    : key === '⇧'
                    ? 'bg-accent-blue/20 text-accent-blue'
                    : 'bg-tertiary text-primary'
                }`}
              >
                {shifted && key !== '⌫' && key !== '⇧' && key !== SHIFT_KEY ? key.toUpperCase() : key}
              </button>
            ))}
            {ri === 3 && (
              <button
                onClick={() => setShifted((prev) => !prev)}
                className={`w-8 h-8 rounded text-xs flex items-center justify-center transition-all active:scale-90 ${
                  shifted ? 'bg-accent-blue text-primary' : 'bg-tertiary text-muted'
                }`}
              >
                {SHIFT_KEY}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
