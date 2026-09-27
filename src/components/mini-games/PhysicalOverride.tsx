import { useState, useCallback } from 'react';
import { Icon } from '../Icon';

interface PhysicalOverrideProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Toggle {
  id: string;
  label: string;
  icon: string;
  isOn: boolean;
  isTarget: boolean;
}

const quickSettingsPage1: Toggle[] = [
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isOn: true, isTarget: false },
  { id: 'bluetooth', label: 'Bluetooth', icon: 'bluetooth', isOn: true, isTarget: false },
  { id: 'airplane', label: 'Airplane Mode', icon: 'airplane', isOn: false, isTarget: false },
  { id: 'nfc', label: 'NFC', icon: 'nfc', isOn: false, isTarget: false },
];

const quickSettingsPage2: Toggle[] = [
  { id: 'location', label: 'Location', icon: 'location', isOn: true, isTarget: false },
  { id: 'flashlight', label: 'Flashlight', icon: 'flashlight', isOn: true, isTarget: true },
  { id: 'brightness', label: 'Brightness', icon: 'brightness', isOn: false, isTarget: false },
  { id: 'rotation', label: 'Rotation', icon: 'rotation', isOn: false, isTarget: false },
];

export function PhysicalOverride({ onComplete, onCancel }: PhysicalOverrideProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [toggles, setToggles] = useState<Record<string, Toggle>>(
    Object.fromEntries([...quickSettingsPage1, ...quickSettingsPage2].map((t) => [t.id, t]))
  );
  const [solved, setSolved] = useState(false);

  const pages: Toggle[][] = [quickSettingsPage1, quickSettingsPage2];
  const flashlight = toggles['flashlight'];

  const toggleItem = useCallback((id: string) => {
    setToggles((prev) => {
      const item = prev[id];
      const updated = { ...item, isOn: !item.isOn };
      if (item.isTarget && item.isOn) {
        setSolved(true);
      }
      return { ...prev, [id]: updated };
    });
  }, []);

  if (solved) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6">
        <Icon name="check" size={48} className="text-accent-green mb-4" />
        <p className="text-xl font-bold text-primary">Flashlight off!</p>
        <p className="text-sm text-secondary mt-2">Battery drain reduced.</p>
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-accent-green text-primary font-bold rounded-xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-primary relative overflow-hidden">
      {/* Flashlight glow effect */}
      {flashlight.isOn && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
        </div>
      )}

      {/* Swipe down hint */}
      {!panelOpen && (
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <div className="w-full px-6">
            <p className="text-center text-sm text-secondary mb-4">
              The flashlight is draining the battery!
            </p>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl animate-bounce">⬇️</span>
              <p className="text-xs text-muted">Swipe down from the top to open Quick Settings</p>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-20 flex items-end justify-center pb-2">
            <div
              className="w-12 h-1.5 bg-tertiary rounded-full"
              onClick={() => setPanelOpen(true)}
            />
            <p className="text-[10px] text-muted mt-1">or tap here</p>
          </div>
        </div>
      )}

      {/* Quick Settings Panel */}
      {panelOpen && (
        <div className="flex-1 flex flex-col z-10 animate-slide-down">
          <div className="flex items-center justify-between p-3 border-b border-theme">
            <button onClick={onCancel} className="text-sm text-secondary">
              ← Close
            </button>
            <span className="text-sm font-bold text-primary">Quick Settings</span>
            <span className="text-xs text-muted">
              Page {currentPage + 1}/{pages.length}
            </span>
          </div>

          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-3">
              {pages[currentPage].map((item) => {
                const state = toggles[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      state.isOn
                        ? 'bg-accent-blue/20 border-accent-blue'
                        : 'bg-secondary border-theme'
                    }`}
                  >
                    <Icon name={state.icon} size={32} className={state.isOn ? 'text-accent-blue' : 'text-primary'} />
                    <span className="text-xs text-primary">{state.label}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        state.isOn ? 'text-accent-blue' : 'text-muted'
                      }`}
                    >
                      {state.isOn ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Page navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === currentPage ? 'bg-primary' : 'bg-tertiary'
                  }`}
                />
              ))}
            </div>

            <p className="text-center text-[10px] text-muted mt-3">
              ← Swipe or tap dots to find the flashlight →
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
