import { useState, useCallback } from 'react';
import { Icon } from '../Icon';
import { playSound } from '../../engine/sound';
import { t, isRTL } from '../../config/translations';
import type { QuickSettingsConfig, ForeignLanguage } from '../../types/game';

interface PhysicalOverrideProps {
  quickSettingsConfig: QuickSettingsConfig;
  difficulty: string;
  foreignLanguage: ForeignLanguage | null;
  onComplete: () => void;
  onCancel: () => void;
}

const completionQuotes: Record<string, string> = {
  dad: 'Dad: "I turned that on to read the golf scores in the dark. It was a solution."',
  mum: 'Mum: "I was using it to read the WhatsApp messages in bed. You can\'t be too careful."',
  grandma: 'Grandma: "It was the moon. I was trying to talk to the moon."',
};

interface Toggle {
  id: string;
  label: string;
  icon: string;
  isOn: boolean;
  isTarget: boolean;
}

export function PhysicalOverride({ quickSettingsConfig, difficulty, foreignLanguage, onComplete, onCancel }: PhysicalOverrideProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [solved, setSolved] = useState(false);

  // Build toggle state from config, marking the flashlight as target
  const [toggles, setToggles] = useState<Record<string, Toggle>>(() => {
    const all: Record<string, Toggle> = {};
    quickSettingsConfig.pages.forEach((page) => {
      page.forEach((t) => {
        all[t.id] = { ...t, isTarget: t.id === 'flashlight' };
      });
    });
    return all;
  });

  const pages = quickSettingsConfig.pages;
  const flashlight = toggles['flashlight'];

  const toggleItem = useCallback((id: string) => {
    setToggles((prev) => {
      const item = prev[id];
      const updated = { ...item, isOn: !item.isOn };
      if (item.isTarget && item.isOn) {
        setSolved(true);
        playSound('success');
      } else {
        playSound('click');
      }
      return { ...prev, [id]: updated };
    });
  }, []);

  if (solved) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6" dir={isRTL(foreignLanguage) ? 'rtl' : 'ltr'}>
        <Icon name="check" size={48} className="text-accent-green mb-4" />
        <p className="text-xl font-bold text-primary">{t(foreignLanguage, 'quicksettings.flashlight')} {t(foreignLanguage, 'quicksettings.off')}</p>
        <p className="text-sm text-secondary mt-2">
          {completionQuotes[difficulty] ?? completionQuotes.dad}
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
    <div className="h-full flex flex-col bg-primary relative overflow-hidden">
      {/* Flashlight glow effect */}
      {flashlight?.isOn && (
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
            <span className="text-sm font-bold text-primary">{t(foreignLanguage, 'quicksettings.title')}</span>
            <span className="text-xs text-muted">
              {t(foreignLanguage, 'quicksettings.page', { n: currentPage + 1 })}
            </span>
          </div>

          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-3">
              {pages[currentPage].map((item) => {
                const state = toggles[item.id];
                if (!state) return null;
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
                      {state.isOn ? t(foreignLanguage, 'quicksettings.on') : t(foreignLanguage, 'quicksettings.off')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Page navigation */}
            {pages.length > 1 && (
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
            )}

            {pages.length > 1 && (
              <p className="text-center text-[10px] text-muted mt-3">
                ← Swipe or tap dots to find the flashlight →
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
