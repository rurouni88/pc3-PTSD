import { useState, useEffect } from 'react';
import { Theme, loadTheme, saveTheme, applyTheme, toggleTheme } from '../engine/theme';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<Theme>(loadTheme());

  // Sync if theme changes externally (e.g. from another modal)
  useEffect(() => {
    const handler = () => setTheme(loadTheme());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xs bg-secondary rounded-2xl border border-theme p-6 animate-slam-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors active:scale-90"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </p>
              <p className="text-xs text-muted">
                {theme === 'dark'
                  ? 'Because productivity is overrated.'
                  : 'For when you actually need to see the screen.'}
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-accent-green' : 'bg-secondary border border-theme'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-theme" />

          {/* Credits */}
          <div className="text-center">
            <p className="text-xs text-muted">Copyright 2026 PC3 Enterprises</p>
            <p className="text-[10px] text-muted mt-1">v0.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
