import { useState, useCallback, useEffect } from 'react';
import { Icon } from '../Icon';
import { playSound } from '../../engine/sound';
import type { MalwareConfig } from '../../types/game';

interface AntivirusWhackAMoleProps {
  malwareConfig: MalwareConfig;
  onComplete: () => void;
  onCancel: () => void;
}

interface AppIcon {
  id: string;
  label: string;
  icon: string;
  isTarget: boolean;
  isJiggling: boolean;
}

const LONG_PRESS_MS = 800;

export function AntivirusWhackAMole({ malwareConfig, onComplete, onCancel }: AntivirusWhackAMoleProps) {
  const [apps, setApps] = useState<AppIcon[]>(() => [
    { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', isTarget: false, isJiggling: false },
    { id: 'malware', label: malwareConfig.name, icon: 'shield', isTarget: true, isJiggling: false },
    { id: 'photos', label: 'Photos', icon: 'photos', isTarget: false, isJiggling: false },
    { id: 'settings', label: 'Settings', icon: 'settings', isTarget: false, isJiggling: false },
    { id: 'safari', label: 'Safari', icon: 'safari', isTarget: false, isJiggling: false },
    { id: 'clock', label: 'Clock', icon: 'clock', isTarget: false, isJiggling: false },
    { id: 'decoy', label: malwareConfig.decoyAppLabel, icon: malwareConfig.decoyAppIcon, isTarget: false, isJiggling: false },
    { id: 'notes', label: 'Notes', icon: 'notes', isTarget: false, isJiggling: false },
  ]);
  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showFakeAlert, setShowFakeAlert] = useState(false);
  const [pressTimer, setPressTimer] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

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
    if (!app || app.isTarget === false) {
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
      setSolved(true);
      playSound('success');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [apps, pressTimer]);

  if (solved) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6">
        <Icon name="trash" size={48} className="text-accent-red mb-4" />
        <p className="text-xl font-bold text-primary">{malwareConfig.name} removed!</p>
        <p className="text-sm text-secondary mt-2">
          Dad: "But it said it would make my phone faster..."
        </p>
        <button
          onClick={() => { playSound('success'); onComplete(); }}
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
        <span className="text-sm font-bold text-primary">Home Screen</span>
        <span className="text-xs text-muted">
          {scanning ? 'Scanning...' : 'Long-press to uninstall'}
        </span>
      </div>

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
        <div className="grid grid-cols-4 gap-4">
          {apps.map((app) => (
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
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
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

        {!scanning && (
          <p className="text-center text-xs text-muted mt-6">
            Long-press the suspicious app to jiggle, then tap the − badge
          </p>
        )}
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
