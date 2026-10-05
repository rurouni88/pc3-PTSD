import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { InfoTooltip } from './InfoTooltip';
import { InfoTrigger } from './InfoTrigger';
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
import { loadBgmPref, saveBgmPref, toggleBgm } from '../engine/bgm';
import { loadFontScale, saveFontScale, FONT_MIN, FONT_MAX } from '../engine/font-scale';
import { saveUnlocked, loadUnlocked } from '../engine/achievements';
import { MetaStore } from '../engine/meta';

interface SettingsModalProps {
  onClose: () => void;
}

const SETTING_TIPS: Record<string, string> = {
  theme: 'Switches between dark and light mode. Saved on this device.',
  audio: 'Controls all sound effects: clicks, notifications, jingles. The volume slider adjusts the level.',
  haptics: 'Vibrations on supported devices (Android). Not available on iOS or desktop.',
  bgm: 'Background music loop. Independent from sound effects — you can have music on but SFX off.',
  volume: 'Controls loudness of all audio (SFX + BGM). 0% is silent, 100% is "Dad is on speakerphone".',
  font: 'Scales all text in the game. Useful if you\'re helping your grandmother and need to read the screen.',
};

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [theme, setTheme] = useState<Theme>(loadTheme());
  const [audioOn, setAudioOn] = useState<boolean>(loadAudioPref);
  const [volume, setVolume] = useState<number>(loadVolume);
  const [hapticsOn, setHapticsOn] = useState<boolean>(loadHapticsPref);
  const [bgmOn, setBgmOn] = useState<boolean>(loadBgmPref);
  const [fontScale, setFontScale] = useState<number>(loadFontScale);
  const [tip, setTip] = useState<{ title: string; description: string } | null>(null);

  // Sync if settings change externally
  useEffect(() => {
    const handler = () => {
      setTheme(loadTheme());
      setAudioOn(loadAudioPref);
      setVolume(loadVolume);
      setHapticsOn(loadHapticsPref);
      setBgmOn(loadBgmPref());
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

  const handleBgmToggle = () => {
    const next = toggleBgm();
    setBgmOn(next);
    playSound('click');
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
    <Modal onClose={onClose} title="Settings" maxHeight="100dvh">
        <div className="flex flex-col gap-4 p-4">
          {/* Theme toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-primary">
                  {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </p>
                <InfoTrigger label="About theme" onClick={() => setTip({ title: 'Theme', description: SETTING_TIPS.theme })} />
              </div>
              <p className="text-xs text-muted">
                {theme === 'dark'
                  ? 'Because productivity is overrated.'
                  : 'For when you actually need to see the screen.'}
              </p>
            </div>
            <button
              onClick={handleThemeToggle}
              className={`shrink-0 w-[48px] h-[28px] rounded-full transition-colors border-2 relative ${theme === 'dark' ? 'bg-accent-green border-accent-green/50' : 'bg-secondary border-accent-blue/40'}`}
            >
              <div
                className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-transform ${theme === 'dark' ? 'translate-x-[24px]' : 'translate-x-[2px]'}`}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-theme" />

          {/* Audio toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-primary">
                  {audioOn ? '🔊 Sound On' : '🔇 Sound Off'}
                </p>
                <InfoTrigger label="About sound" onClick={() => setTip({ title: 'Sound', description: SETTING_TIPS.audio })} />
              </div>
              <p className="text-xs text-muted">
                {audioOn
                  ? 'Beep boop. Your ears will thank you.'
                  : 'Silence is golden. Or at least quieter.'}
              </p>
            </div>
            <button
              onClick={handleAudioToggle}
              className={`shrink-0 w-[48px] h-[28px] rounded-full transition-colors border-2 relative ${audioOn ? 'bg-accent-green border-accent-green/50' : 'bg-secondary border-accent-blue/40'}`}
            >
              <div
                className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-transform ${audioOn ? 'translate-x-[24px]' : 'translate-x-[2px]'}`}
              />
            </button>
          </div>

          {/* Haptics toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-primary">
                  {hapticsOn ? '📳 Haptics On' : '📴 Haptics Off'}
                </p>
                <InfoTrigger label="About haptics" onClick={() => setTip({ title: 'Haptics', description: SETTING_TIPS.haptics })} />
              </div>
              <p className="text-xs text-muted">
                {hapticsOn
                  ? 'Feel the chaos.'
                  : 'Silent but deadly.'}
              </p>
            </div>
            <button
              onClick={handleHapticsToggle}
              className={`shrink-0 w-[48px] h-[28px] rounded-full transition-colors border-2 relative ${hapticsOn ? 'bg-accent-green border-accent-green/50' : 'bg-secondary border-accent-blue/40'}`}
            >
              <div
                className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-transform ${hapticsOn ? 'translate-x-[24px]' : 'translate-x-[2px]'}`}
              />
            </button>
          </div>

          {/* BGM toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium text-primary">
                  {bgmOn ? '🎵 Music On' : '🔇 Music Off'}
                </p>
                <InfoTrigger label="About music" onClick={() => setTip({ title: 'Music', description: SETTING_TIPS.bgm })} />
              </div>
              <p className="text-xs text-muted">
                {bgmOn
                  ? 'You are on hold. Forever.'
                  : 'No hold music. Suspiciously peaceful.'}
              </p>
            </div>
            <button
              onClick={handleBgmToggle}
              className={`shrink-0 w-[48px] h-[28px] rounded-full transition-colors border-2 relative ${bgmOn ? 'bg-accent-green border-accent-green/50' : 'bg-secondary border-accent-blue/40'}`}
            >
              <div
                className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-transform ${bgmOn ? 'translate-x-[24px]' : 'translate-x-[2px]'}`}
              />
            </button>
          </div>

          {/* Volume slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p className="text-xs font-medium text-muted">Volume</p>
                <InfoTrigger label="About volume" onClick={() => setTip({ title: 'Volume', description: SETTING_TIPS.volume })} />
              </div>
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
              <div className="flex items-center gap-1">
                <p className="text-xs font-medium text-muted">🔤 Font Size</p>
                <InfoTrigger label="About font size" onClick={() => setTip({ title: 'Font Size', description: SETTING_TIPS.font })} />
              </div>
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

          {/* Install Hint */}
          <div className="text-center">
            <p className="text-xs text-muted">📲 Install as app</p>
            <p className="text-[0.65rem] text-muted mt-1">iOS: Share → Add to Home Screen</p>
            <p className="text-[0.65rem] text-muted">Android: Menu (⋮) → Add to Home Screen</p>
          </div>

          <div className="border-t border-theme" />

          {/* Credits */}
          <div className="text-center">
            <p className="text-center text-xs text-muted">Copyright 2026 PC3 Enterprises</p>
            <p className="text-[0.65rem] text-muted mt-1">v{__APP_VERSION__}</p>
          </div>
        </div>
      <InfoTooltip content={tip} onClose={() => setTip(null)} />
    </Modal>
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
