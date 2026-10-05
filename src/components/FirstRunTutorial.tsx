// First-run tutorial overlay. Shown once, stored in localStorage.
import { useState, useEffect } from 'react';

const SEEN_KEY = 'pc3-ptsd-tutorial-seen';

export function FirstRunTutorial({ onDismiss }: { onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      // Small delay so the boot screen renders first
      const t = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(SEEN_KEY, '1');
    setVisible(false);
    onDismiss();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Tech Support"
      className="absolute inset-0 z-50 flex items-center justify-center bg-primary/95 p-6 animate-fade-in"
      onClick={handleDismiss}
    >
      <div className="max-w-xs text-center">
        <span className="text-5xl block mb-4">📱</span>
        <h2 className="text-xl font-bold text-primary mb-3">Welcome to Tech Support</h2>
        <div className="flex flex-col gap-3 text-left">
          <p className="text-sm text-secondary">
            <span className="text-primary font-bold">Tap issues</span> to fix them before the timer runs out.
          </p>
          <p className="text-sm text-secondary">
            <span className="text-accent-red font-bold">Battery drains</span> while issues are unresolved. Don't let it hit 0.
          </p>
          <p className="text-sm text-secondary">
            <span className="text-accent-yellow font-bold">Your parent</span> will interrupt. Try to ignore them.
          </p>
          <p className="text-sm text-secondary">
            <span className="text-accent-blue font-bold">📲 Install as app</span> for the best experience (Share → Add to Home Screen).
          </p>
        </div>
        <p className="text-xs text-muted mt-6">Tap anywhere to start</p>
      </div>
    </div>
  );
}
