// useGameTimer — isolates setInterval + delta calculation from game logic.
// The timer always runs; the tick callback decides what to do with each delta.

import { useRef, useCallback, useEffect } from 'react';

interface UseGameTimerProps {
  onTick: (delta: number) => void;
  intervalMs?: number;
  active?: boolean;
}

export function useGameTimer({ onTick, intervalMs = 100, active = true }: UseGameTimerProps) {
  const timerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;
  const activeRef = useRef(active);
  activeRef.current = active;

  const resetLastTick = useCallback(() => {
    lastTickRef.current = Date.now();
  }, []);

  useEffect(() => {
    lastTickRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      if (!activeRef.current) {
        // Keep lastTickRef current so we don't get a huge delta on reactivation
        lastTickRef.current = Date.now();
        return;
      }
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      onTickRef.current(delta);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  return { resetLastTick };
}
