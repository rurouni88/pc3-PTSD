// ToastContainer — Renders active toasts. Mount once in App.tsx.
// Listens to the toast engine via subscribeToasts.

import { useEffect, useState } from 'react';
import { subscribeToasts, type ToastItem, type ToastType } from '../engine/toast';

const borderColors: Record<ToastType, string> = {
  success: 'border-accent-green',
  error: 'border-accent-red',
  warning: 'border-accent-yellow',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToasts(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-1 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-secondary border rounded-lg px-3 py-2 shadow-lg text-xs text-primary max-w-[280px] animate-slide-in-right ${borderColors[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
