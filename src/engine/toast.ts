// Toast — Lightweight, non-blocking system notifications.
// Top-right, auto-dismisses after 3s. For "Something happened" feedback.
// Different from Notification (diegetic, in-game parent messages).

import { playSound } from './sound';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const TOAST_DURATION = 3000;

let nextId = 0;
let toasts: ToastItem[] = [];
let subscribers: ((toasts: ToastItem[]) => void)[] = [];

function notify(): void {
  for (const sub of subscribers) {
    sub([...toasts]);
  }
}

function removeToast(id: number): void {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

/**
 * Show a toast notification. Auto-dismisses after 3s.
 * Call from anywhere — no React context needed.
 */
export function showToast(message: string, type: ToastType = 'success'): void {
  const id = ++nextId;
  toasts = [...toasts, { id, message, type }];
  notify();
  playSound('toast');
  setTimeout(() => removeToast(id), TOAST_DURATION);
}

/**
 * Subscribe to toast changes. Returns an unsubscribe function.
 */
export function subscribeToasts(callback: (toasts: ToastItem[]) => void): () => void {
  subscribers.push(callback);
  // Send current state immediately
  callback([...toasts]);
  return () => {
    subscribers = subscribers.filter((s) => s !== callback);
  };
}

export type { ToastItem };
