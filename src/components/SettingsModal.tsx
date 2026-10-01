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
import { toggleHaptics, loadHapticsPref, playHaptic } from '../engine/haptics';
import { loadFontScale, saveFontScale, FONT_MIN, FONT_MAX } from '../engine/font-scale';
import { saveUnlocked, loadUnlocked } from '../engine/achievements';
import { MetaStore } from '../engine/meta';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<Theme>(loadTheme());
  const [audioOn, setAudioOn] = useState<boolean>(loadAudioPref);
  const [volume, setVolume] = useState<number>(loadVolume);
  const [hapticsOn, setHapticsOn] = useState<boolean>(loadHapticsPref);
  const [fontScale, setFontScale] = useState<number>(loadFontScale);

  // Sync if settings change externally
  useEffect(() => {
    const handler = () => {
      setTheme(loadTheme());
      setAudioOn(loadAudioPref);
      setVolume(loadVolume);
      setHapticsOn(loadHapticsPref);
      setFontScale(loadFontScale());
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

  const handleHapticsToggle = () => {
    const next = toggleHaptics();
    setHapticsOn(next);
    if (next) playHaptic('click');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value) / 100;
    setVolume(v);
    saveVolume(v);
    if (audioOn) playSound('click');
  };

  const handleFontScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseInt(e.target.value, 10);
    setFontScale(pct);
    saveFontScale(pct);
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
              className={`w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-accent-green border-2 border-accent-green/50' : 'bg-secondary border-2 border-accent-blue/40'}`}
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
              className={`w-12 h-7 rounded-full transition-colors ${audioOn ? 'bg-accent-green border-2 border-accent-green/50' : 'bg-secondary border-2 border-accent-blue/40'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${audioOn ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Haptics toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                {hapticsOn ? '📳 Haptics On' : '📴 Haptics Off'}
              </p>
              <p className="text-xs text-muted">
                {hapticsOn
                  ? 'Feel the chaos.'
                  : 'Silent but deadly.'}
              </p>
            </div>
            <button
              onClick={handleHapticsToggle}
              className={`w-12 h-7 rounded-full transition-colors ${hapticsOn ? 'bg-accent-green border-2 border-accent-green/50' : 'bg-secondary border-2 border-accent-blue/40'}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${hapticsOn ? 'translate-x-6' : 'translate-x-1'}`}
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

          {/* Font Size slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted">🔤 Font Size</p>
              <p className="text-xs font-mono text-muted">{fontScale}%</p>
            </div>
            <input
              type="range"
              min={FONT_MIN}
              max={FONT_MAX}
              step={5}
              value={fontScale}
              onChange={handleFontScaleChange}
              aria-label="Font size percentage"
              className="w-full h-2 bg-tertiary rounded-full appearance-none cursor-pointer accent-accent-green"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-theme" />

          {/* Reset Achievements */}
          <ResetAchievements />

          {/* Divider */}
          <div className="border-t border-theme" />

          {/* Reset Leaderboard */}
          <ResetLeaderboard />

          {/* Divider */}
          <div className="border-t border-theme" />

          {/* Credits */}
          <div className="text-center">
            <p className="text-center text-xs text-muted">Copyright 2026 PC3 Enterprises</p>
            <p className="text-[0.65rem] text-muted mt-1">v0.4.1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResetAchievements() {
  const [confirming, setConfirming] = useState(false);
  const [count, setCount] = useState(() => loadUnlocked().length);

  const handleReset = () => {
    saveUnlocked([]);
    setCount(0);
    setConfirming(false);
    playSound('click');
  };

  if (confirming) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-accent-red font-medium">Reset all achievements? This cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 py-2 bg-accent-red text-primary text-xs font-bold rounded-lg active:scale-95 transition-transform"
          >
            Yes, reset
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 py-2 bg-tertiary text-primary text-xs font-medium rounded-lg active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Reset Achievements</p>
        <p className="text-xs text-muted">
          {count > 0 ? `${count} unlocked. Start fresh?` : 'Nothing to reset.'}
        </p>
      </div>
      <button
        onClick={() => setConfirming(true)}
        disabled={count === 0}
        className="px-3 py-1.5 text-xs font-medium text-accent-red border border-accent-red/40 rounded-lg active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Reset
      </button>
    </div>
  );
}

function ResetLeaderboard() {
  const [confirming, setConfirming] = useState(false);
  const [count, setCount] = useState(() => MetaStore.getTopRunsCount());

  const handleReset = () => {
    MetaStore.clearTopRuns();
    setCount(0);
    setConfirming(false);
    playSound('click');
  };

  if (confirming) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-accent-red font-medium">Reset leaderboard? All run records will be lost.</p>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 py-2 bg-accent-red text-primary text-xs font-bold rounded-lg active:scale-95 transition-transform"
          >
            Yes, reset
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 py-2 bg-tertiary text-primary text-xs font-medium rounded-lg active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Reset Leaderboard</p>
        <p className="text-xs text-muted">
          {count > 0 ? `${count} run${count > 1 ? 's' : ''} recorded. Clear all?` : 'Nothing to reset.'}
        </p>
      </div>
      <button
        onClick={() => setConfirming(true)}
        disabled={count === 0}
        className="px-3 py-1.5 text-xs font-medium text-accent-red border border-accent-red/40 rounded-lg active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Reset
      </button>
    </div>
  );
}
