import { useState, useCallback, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import { playSound } from '../../engine/sound';
import { RngEngine } from '../../engine/seeded-rng';
import { t, isRTL } from '../../config/translations';
import { Hint } from '../Hint';
import type { MalwareConfig, ForeignLanguage, MiniGameQuality } from '../../types/game';

interface AntivirusWhackAMoleProps {
  malwareConfig: MalwareConfig;
  difficulty: string;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality) => void;
  onCancel: () => void;
}

const completionQuotes: Record<string, string> = {
  dad: 'Dad: "But it said it would make my phone faster..."',
  mum: 'Mum: "Oh good. Now can you get it back? Linda sent it to me."',
  grandma: 'Grandma: "Was that the cat protector? It was keeping the cat photos safe."',
};

interface AppIcon {
  id: string;
  label: string;
  icon: string;
  isTarget: boolean;
  isJiggling: boolean;
  isRemoved: boolean;
}

const LONG_PRESS_MS = 800;

// Decoy apps to fill the grid
const DECOY_APPS: { id: string; label: string; icon: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
  { id: 'photos', label: 'Photos', icon: 'photos' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'safari', label: 'Safari', icon: 'safari' },
  { id: 'clock', label: 'Clock', icon: 'clock' },
  { id: 'notes', label: 'Notes', icon: 'notes' },
  { id: 'maps', label: 'Maps', icon: 'globe-web' },
  { id: 'mail', label: 'Mail', icon: 'mail' },
  { id: 'calendar', label: 'Calendar', icon: 'clock' },
  { id: 'weather', label: 'Weather', icon: 'settings' },
  { id: 'health', label: 'Health', icon: 'shield' },
  { id: 'fitness', label: 'Fitness', icon: 'check' },
];

// Number of malware apps per difficulty
const MALWARE_COUNTS: Record<string, number> = {
  dad: 1,
  mum: 2,
  grandma: 3,
};

// Total apps on screen per difficulty
const TOTAL_APPS: Record<string, number> = {
  dad: 10,
  mum: 12,
  grandma: 14,
};

// Extra malware names for multi-malware difficulties
const EXTRA_MALWARE: { name: string; icon: string }[] = [
  { name: 'Phone Cleaner Pro', icon: 'shield' },
  { name: 'WiFi Booster X', icon: 'wifi' },
  { name: 'Battery Saver Plus', icon: 'settings' },
  { name: 'Ad Blocker Mega', icon: 'shield' },
  { name: 'RAM Cleaner 2026', icon: 'settings' },
];

export function AntivirusWhackAMole({ malwareConfig, difficulty, foreignLanguage, onComplete, onCancel }: AntivirusWhackAMoleProps) {
  const malwareCount = MALWARE_COUNTS[difficulty] ?? 1;
  const totalApps = TOTAL_APPS[difficulty] ?? 10;
  const decoyTappedRef = useRef(0);

  const [apps, setApps] = useState<AppIcon[]>(() => {
    const result: AppIcon[] = [];

    // Add malware apps
    result.push({
      id: 'malware-1',
      label: malwareConfig.name,
      icon: 'shield',
      isTarget: true,
      isJiggling: false,
      isRemoved: false,
    });
    for (let i = 1; i < malwareCount; i++) {
      const extra = EXTRA_MALWARE[i - 1];
      result.push({
        id: `malware-${i + 1}`,
        label: extra.name,
        icon: extra.icon,
        isTarget: true,
        isJiggling: false,
        isRemoved: false,
      });
    }

    // Add decoy apps
    const decoySlots = totalApps - malwareCount;
    for (let i = 0; i < decoySlots; i++) {
      const decoy = DECOY_APPS[i % DECOY_APPS.length];
      result.push({
        id: decoy.id,
        label: decoy.label,
        icon: decoy.icon,
        isTarget: false,
        isJiggling: false,
        isRemoved: false,
      });
    }

    // Shuffle
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(RngEngine.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  });

  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showFakeAlert, setShowFakeAlert] = useState(false);
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const remainingTargets = apps.filter((a) => a.isTarget && !a.isRemoved).length;

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [scanning]);

  useEffect(() => {
    if (!scanning) return;
    const alertInterval = setInterval(() => {
      setShowFakeAlert(true);
      setTimeout(() => setShowFakeAlert(false), 2000);
    }, 3000);
    return () => clearInterval(alertInterval);
  }, [scanning]);

  const handlePressStart = useCallback((appId: string) => {
    if (scanning) return;
    const app = apps.find((a) => a.id === appId);
    if (!app || app.isRemoved) return;

    if (!app.isTarget) {
      // Tapped a decoy — track it
      decoyTappedRef.current++;
      if (navigator.vibrate) navigator.vibrate(50);
      return;
    }

    const timer = window.setTimeout(() => {
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, isJiggling: true } : a))
      );
      playSound('click');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }, LONG_PRESS_MS);

    setPressTimer(timer);
  }, [apps, scanning]);

  const handlePressEnd = useCallback((appId: string) => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    const app = apps.find((a) => a.id === appId);
    if (app?.isJiggling) {
      // Remove the app
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, isRemoved: true, isJiggling: false } : a))
      );
      playSound('success');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

      // Check if all targets removed
      const remaining = apps.filter((a) => a.isTarget && !a.isRemoved && a.id !== appId).length;
      if (remaining === 0) {
        setSolved(true);
      }
    }
  }, [apps, pressTimer]);

  if (solved) {
    const removedNames = apps.filter((a) => a.isTarget).map((a) => a.label).join(', ');
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6" dir={isRTL(foreignLanguage) ? 'rtl' : 'ltr'}>
        <Icon name="trash" size={48} className="text-accent-red mb-4" />
        <p className="text-xl font-bold text-primary">{removedNames} {t(foreignLanguage, 'antivirus.removed')}</p>
        <p className="text-sm text-secondary mt-2">
          {completionQuotes[difficulty] ?? completionQuotes.dad}
        </p>
        <button
          onClick={() => { playSound('success'); onComplete({ decoysTapped: decoyTappedRef.current }); }}
          className="mt-6 px-6 py-3 bg-accent-green text-primary font-bold rounded-xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-primary relative">
      <div className="flex items-center justify-between p-3 border-b border-theme">
        <button onClick={onCancel} className="text-sm text-secondary">
          ← Home
        </button>
        <span className="text-sm font-bold text-primary">{t(foreignLanguage, 'antivirus.home')}</span>
        <span className="text-xs text-muted">
          {scanning ? t(foreignLanguage, 'antivirus.scanning') : `${remainingTargets} left`}
        </span>
      </div>

      <Hint visible={!scanning}>Long-press the suspicious app to jiggle, then tap −</Hint>

      {scanning && (
        <div className="p-4">
          <div className="bg-secondary rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-accent-red mb-2">
              ⚠️ {malwareConfig.name} — Scanning...
            </p>
            <div className="h-2 bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-red transition-all duration-100"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {malwareConfig.scanMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 p-4">
        <div className="grid grid-cols-4 gap-3">
          {apps.filter((a) => !a.isRemoved).map((app) => (
            <button
              key={app.id}
              onPointerDown={() => handlePressStart(app.id)}
              onPointerUp={() => handlePressEnd(app.id)}
              onPointerLeave={() => {
                if (pressTimer) {
                  clearTimeout(pressTimer);
                  setPressTimer(null);
                }
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${
                app.isJiggling ? 'animate-jiggle' : ''
              } ${scanning ? 'opacity-50' : ''}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  app.isTarget ? 'bg-red-900/40' : 'bg-secondary'
                }`}
              >
                <Icon name={app.icon} size={28} className="text-primary" />
              </div>
              {app.isJiggling && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs border-2 border-gray-400">
                  −
                </div>
              )}
              <span className="text-[10px] text-primary text-center">{app.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showFakeAlert && (
        <div className="absolute top-16 left-4 right-4 bg-red-50 border-2 border-red-300 rounded-xl p-3 z-40 animate-slam-in">
          <p className="text-xs font-bold text-red-800">
            ⚠️ {malwareConfig.scanMessage}
          </p>
          <button
            onClick={() => setShowFakeAlert(false)}
            className="mt-2 w-full py-1 text-xs bg-red-500 text-white rounded"
          >
            FIX NOW (this does nothing)
          </button>
        </div>
      )}
    </div>
  );
}
