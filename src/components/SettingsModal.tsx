import { useState, useEffect } from 'react';
import { Theme, loadTheme, saveTheme, applyTheme, toggleTheme } from '../engine/theme';
import {
  loadAudioPref,
  saveAudioPref,
  loadVolume,
  saveVolume,
  toggleAudio,
  playSound,
} from '../engine/sound';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<Theme>(loadTheme());
  const [audioOn, setAudioOn] = useState<boolean>(loadAudioPref);
  const [volume, setVolume] = useState<number>(loadVolume);

  // Sync if settings change externally
  useEffect(() => {
    const handler = () => {
      setTheme(loadTheme());
      setAudioOn(loadAudioPref);
      setVolume(loadVolume);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleThemeToggle = () => {
    const next = toggleTheme();
    setTheme(next);
    playSound('click');
  };

  const handleAudioToggle = () => {
    const next = toggleAudio();
    setAudioOn(next);
    if (next) playSound('click');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value) / 100;
    setVolume(v);
    saveVolume(v);
    if (audioOn) playSound('click');
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
              onClick={handleThemeToggle}
              className={`w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-accent-green' : 'bg-secondary border-2 border-accent-blue/40'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-theme" />

          {/* Audio toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                {audioOn ? '🔊 Sound On' : '🔇 Sound Off'}
              </p>
              <p className="text-xs text-muted">
                {audioOn
                  ? 'Beep boop. Your ears will thank you.'
                  : 'Silence is golden. Or at least quieter.'}
              </p>
            </div>
            <button
              onClick={handleAudioToggle}
              className={`w-12 h-7 rounded-full transition-colors ${audioOn ? 'bg-accent-green' : 'bg-secondary border-2 border-accent-blue/40'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${audioOn ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Volume slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted">Volume</p>
              <p className="text-xs font-mono text-muted">{Math.round(volume * 100)}%</p>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(volume * 100)}
              onChange={(e) => handleVolumeChange(e)}
              disabled={!audioOn}
              className="w-full h-2 bg-tertiary rounded-full appearance-none cursor-pointer accent-accent-green disabled:opacity-50 disabled:cursor-not-allowed"
            />
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
