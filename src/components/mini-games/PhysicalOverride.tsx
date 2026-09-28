import { useState, useCallback, useRef } from 'react';
import { Icon } from '../Icon';
import { playSound } from '../../engine/sound';
import { t, isRTL } from '../../config/translations';
import { Hint } from '../Hint';
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

const SWIPE_THRESHOLD = 80;

export function PhysicalOverride({ quickSettingsConfig, difficulty, foreignLanguage, onComplete, onCancel }: PhysicalOverrideProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [solved, setSolved] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartY = useRef(0);

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

  // Swipe-down gesture to open panel
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (panelOpen) return;
    pointerStartY.current = e.clientY;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [panelOpen]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || panelOpen) return;
    const dy = e.clientY - pointerStartY.current;
    setDragY(Math.max(0, dy)); // only allow downward
  }, [isDragging, panelOpen]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > SWIPE_THRESHOLD) {
      setPanelOpen(true);
      playSound('click');
    }
    setDragY(0);
  }, [isDragging, dragY]);

  // Swipe between pages
  const handlePageSwipeStart = useRef(0);
  const handlePageTouchStart = useCallback((e: React.TouchEvent) => {
    handlePageSwipeStart.current = e.touches[0].clientX;
  }, []);

  const handlePageTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - handlePageSwipeStart.current;
    if (Math.abs(dx) > 50) {
      setCurrentPage((prev) => {
        if (dx < 0) return Math.min(prev + 1, pages.length - 1);
        return Math.max(prev - 1, 0);
      });
    }
  }, [pages.length]);

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

      {/* Swipe down to open */}
      {!panelOpen && (
        <div
          className="flex-1 flex flex-col items-center justify-center z-10 select-none touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Pull-down indicator */}
          <div
            className="absolute top-0 left-0 right-0 flex flex-col items-center pt-3 transition-transform"
            style={{ transform: `translateY(${dragY * 0.5}px)` }}
          >
            <div className="w-10 h-1.5 bg-tertiary rounded-full mb-2" />
            <Hint>Swipe down to open Quick Settings</Hint>
          </div>

          <div className="w-full px-6 text-center">
            <p className="text-sm text-secondary mb-4">
              The flashlight is draining the battery!
            </p>
            <span className="text-4xl animate-bounce block mb-2">⬇️</span>
            <Hint>or tap anywhere to open</Hint>
          </div>
        </div>
      )}

      {/* Quick Settings Panel — iOS Control Center style */}
      {panelOpen && (
        <div
          className="flex-1 flex flex-col z-10 animate-slide-down bg-primary"
          onTouchStart={handlePageTouchStart}
          onTouchEnd={handlePageTouchEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button onClick={onCancel} className="text-sm text-secondary active:text-primary">
              ← Close
            </button>
            <span className="text-base font-bold text-primary">{t(foreignLanguage, 'quicksettings.title')}</span>
            <span className="text-xs text-muted w-16 text-right">
              {t(foreignLanguage, 'quicksettings.page', { n: currentPage + 1 })}
            </span>
          </div>

          {/* Toggle grid */}
          <div className="flex-1 px-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              {pages[currentPage].map((item) => {
                const state = toggles[item.id];
                if (!state) return null;
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-3xl transition-all active:scale-95 ${
                      state.isOn
                        ? 'bg-accent-blue/25 border-2 border-accent-blue'
                        : 'bg-secondary border-2 border-theme'
                    }`}
                  >
                    <Icon name={state.icon} size={36} className={state.isOn ? 'text-accent-blue' : 'text-primary'} />
                    <span className="text-sm font-medium text-primary">{state.label}</span>
                    <span
                      className={`text-[10px] font-bold tracking-wide ${
                        state.isOn ? 'text-accent-blue' : 'text-muted'
                      }`}
                    >
                      {state.isOn ? t(foreignLanguage, 'quicksettings.on') : t(foreignLanguage, 'quicksettings.off')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page dots — bigger, more iOS-like */}
          {pages.length > 1 && (
            <div className="flex justify-center gap-2 pb-3">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`rounded-full transition-all ${
                    i === currentPage ? 'w-3 h-3 bg-primary' : 'w-2 h-2 bg-tertiary'
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
          )}

          {pages.length > 1 && (
            <Hint className="pb-3">← Swipe or tap dots to find the flashlight →</Hint>
          )}
        </div>
      )}
    </div>
  );
}
