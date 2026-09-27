import { useState, useCallback } from 'react';
import { Icon } from '../Icon';

interface BlindTranslationProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface MenuOption {
  id: string;
  greekLabel: string;
  icon: string;
  isTarget: boolean;
}

const settingsMenu: MenuOption[] = [
  { id: 'general', greekLabel: 'Γενικά', icon: 'settings', isTarget: false },
  { id: 'display', greekLabel: 'Οθόνη', icon: 'display', isTarget: false },
  { id: 'sound', greekLabel: 'Ήχος', icon: 'sound', isTarget: false },
  { id: 'language', greekLabel: 'Γλώσσα και εισαγωγή', icon: 'globe', isTarget: true },
  { id: 'battery', greekLabel: 'Μπαταρία', icon: 'battery', isTarget: false },
  { id: 'wifi', greekLabel: 'Wi-Fi', icon: 'wifi', isTarget: false },
  { id: 'bluetooth', greekLabel: 'Bluetooth', icon: 'bluetooth', isTarget: false },
  { id: 'storage', greekLabel: 'Αποθήκευση', icon: 'storage', isTarget: false },
];

const languageOptions: MenuOption[] = [
  { id: 'greek', greekLabel: 'Ελληνικά', icon: 'globe', isTarget: false },
  { id: 'english', greekLabel: 'English', icon: 'globe', isTarget: true },
  { id: 'chinese', greekLabel: '中文', icon: 'globe', isTarget: false },
  { id: 'spanish', greekLabel: 'Español', icon: 'globe', isTarget: false },
  { id: 'french', greekLabel: 'Français', icon: 'globe', isTarget: false },
  { id: 'arabic', greekLabel: 'العربية', icon: 'globe', isTarget: false },
];

export function BlindTranslation({ onComplete, onCancel }: BlindTranslationProps) {
  const [currentScreen, setCurrentScreen] = useState<'settings' | 'language' | 'done'>('settings');
  const [wrongPick, setWrongPick] = useState(false);

  const handleSettingsTap = useCallback((id: string) => {
    const option = settingsMenu.find((o) => o.id === id);
    if (option?.isTarget) {
      setCurrentScreen('language');
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      setWrongPick(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => setWrongPick(false), 1500);
    }
  }, []);

  const handleLanguageTap = useCallback((id: string) => {
    const option = languageOptions.find((o) => o.id === id);
    if (option?.isTarget) {
      setCurrentScreen('done');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } else {
      setWrongPick(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(() => setWrongPick(false), 1500);
    }
  }, []);

  if (currentScreen === 'done') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6">
        <Icon name="globe" size={48} className="text-accent-blue mb-4" />
        <p className="text-xl font-bold text-primary">Language: English</p>
        <p className="text-sm text-secondary mt-2">
          Grandma: "Oh thank you, I thought I broke the phone."
        </p>
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-accent-green text-white font-bold rounded-xl"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-primary">
      <div className="flex items-center justify-between p-3 border-b border-theme">
        <button
          onClick={() => currentScreen === 'language' ? setCurrentScreen('settings') : onCancel()}
          className="text-sm text-secondary"
        >
          ← {currentScreen === 'language' ? 'Back' : 'Home'}
        </button>
        <span className="text-sm font-bold text-primary">
          {currentScreen === 'settings' ? 'Ρυθμίσεις' : 'Γλώσσα'}
        </span>
        <span className="text-xs text-muted">
          {currentScreen === 'settings' ? 'Settings' : 'Language'}
        </span>
      </div>

      {wrongPick && (
        <div className="mx-3 mt-2 p-2 bg-red-900/30 border border-red-500 rounded-lg">
          <p className="text-xs text-accent-red text-center">
            Wrong option! Look for the shape, not the text.
          </p>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-3">
        {currentScreen === 'settings' && (
          <div className="flex flex-col gap-1">
            {settingsMenu.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSettingsTap(option.id)}
                className="flex items-center gap-3 p-4 bg-secondary rounded-xl border border-theme active:bg-tertiary transition-colors"
              >
                <Icon name={option.icon} size={24} className="text-primary" />
                <span className="text-base text-primary">{option.greekLabel}</span>
              </button>
            ))}
          </div>
        )}

        {currentScreen === 'language' && (
          <div className="flex flex-col gap-1">
            {languageOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleLanguageTap(option.id)}
                className="flex items-center gap-3 p-4 bg-secondary rounded-xl border border-theme active:bg-tertiary transition-colors"
              >
                <Icon name={option.icon} size={24} className="text-primary" />
                <span className="text-base text-primary">{option.greekLabel}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {currentScreen === 'settings' && (
        <p className="text-center text-[10px] text-muted p-3">
          Find the globe icon — you can't read Greek!
        </p>
      )}
      {currentScreen === 'language' && (
        <p className="text-center text-[10px] text-muted p-3">
          Find "English" — it's the only one you can read!
        </p>
      )}
    </div>
  );
}
