import { useState, useCallback } from 'react';
import { Icon } from '../Icon';
import { RngEngine } from '../../engine/seeded-rng';

interface BlindTranslationProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface MenuOption {
  id: string;
  label: string;
  icon: string;
  isTarget: boolean;
}

type ForeignLanguage = 'greek' | 'arabic' | 'korean' | 'japanese' | 'hindi';

const settingsMenuGreek: MenuOption[] = [
  { id: 'general', label: 'Γενικά', icon: 'settings', isTarget: false },
  { id: 'display', label: 'Οθόνη', icon: 'display', isTarget: false },
  { id: 'sound', label: 'Ήχος', icon: 'sound', isTarget: false },
  { id: 'language', label: 'Γλώσσα και εισαγωγή', icon: 'globe', isTarget: true },
  { id: 'battery', label: 'Μπαταρία', icon: 'battery', isTarget: false },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isTarget: false },
  { id: 'bluetooth', label: 'Bluetooth', icon: 'bluetooth', isTarget: false },
  { id: 'storage', label: 'Αποθήκευση', icon: 'storage', isTarget: false },
];

const settingsMenuArabic: MenuOption[] = [
  { id: 'general', label: 'عام', icon: 'settings', isTarget: false },
  { id: 'display', label: 'الشاشة', icon: 'display', isTarget: false },
  { id: 'sound', label: 'الصوت', icon: 'sound', isTarget: false },
  { id: 'language', label: 'اللغة والإدخال', icon: 'globe', isTarget: true },
  { id: 'battery', label: 'البطارية', icon: 'battery', isTarget: false },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isTarget: false },
  { id: 'bluetooth', label: 'البلوتوث', icon: 'bluetooth', isTarget: false },
  { id: 'storage', label: 'التخزين', icon: 'storage', isTarget: false },
];

const settingsMenuKorean: MenuOption[] = [
  { id: 'general', label: '일반', icon: 'settings', isTarget: false },
  { id: 'display', label: '디스플레이', icon: 'display', isTarget: false },
  { id: 'sound', label: '소리', icon: 'sound', isTarget: false },
  { id: 'language', label: '언어', icon: 'globe', isTarget: true },
  { id: 'battery', label: '배터리', icon: 'battery', isTarget: false },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isTarget: false },
  { id: 'bluetooth', label: '블루투스', icon: 'bluetooth', isTarget: false },
  { id: 'storage', label: '저장공간', icon: 'storage', isTarget: false },
];

const settingsMenuJapanese: MenuOption[] = [
  { id: 'general', label: '設定', icon: 'settings', isTarget: false },
  { id: 'display', label: 'ディスプレイ', icon: 'display', isTarget: false },
  { id: 'sound', label: 'サウンド', icon: 'sound', isTarget: false },
  { id: 'language', label: '言語', icon: 'globe', isTarget: true },
  { id: 'battery', label: 'バッテリー', icon: 'battery', isTarget: false },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isTarget: false },
  { id: 'bluetooth', label: 'ブルートゥース', icon: 'bluetooth', isTarget: false },
  { id: 'storage', label: 'ストレージ', icon: 'storage', isTarget: false },
];

const settingsMenuHindi: MenuOption[] = [
  { id: 'general', label: 'सेटिंग्स', icon: 'settings', isTarget: false },
  { id: 'display', label: 'डिस्प्ले', icon: 'display', isTarget: false },
  { id: 'sound', label: 'साउंड', icon: 'sound', isTarget: false },
  { id: 'language', label: 'भाषा', icon: 'globe', isTarget: true },
  { id: 'battery', label: 'बैटरी', icon: 'battery', isTarget: false },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', isTarget: false },
  { id: 'bluetooth', label: 'ब्लूटूथ', icon: 'bluetooth', isTarget: false },
  { id: 'storage', label: 'स्टोरेज', icon: 'storage', isTarget: false },
];

const languageOptions: MenuOption[] = [
  { id: 'greek', label: 'Ελληνικά', icon: 'globe', isTarget: false },
  { id: 'english', label: 'English', icon: 'globe', isTarget: true },
  { id: 'chinese', label: '中文', icon: 'globe', isTarget: false },
  { id: 'korean', label: '한국어', icon: 'globe', isTarget: false },
  { id: 'japanese', label: '日本語', icon: 'globe', isTarget: false },
  { id: 'hindi', label: 'हिन्दी', icon: 'globe', isTarget: false },
  { id: 'spanish', label: 'Español', icon: 'globe', isTarget: false },
  { id: 'french', label: 'Français', icon: 'globe', isTarget: false },
  { id: 'arabic', label: 'العربية', icon: 'globe', isTarget: false },
];

const headerLabels: Record<ForeignLanguage, { settings: string; language: string; hintSettings: string; hintLanguage: string }> = {
  greek: {
    settings: 'Ρυθμίσεις',
    language: 'Γλώσσα',
    hintSettings: 'Find the globe icon — you can\'t read Greek!',
    hintLanguage: 'Find "English" — it\'s the only one you can read!',
  },
  arabic: {
    settings: 'الإعدادات',
    language: 'اللغة',
    hintSettings: 'Find the globe icon — you can\'t read Arabic!',
    hintLanguage: 'Find "English" — it\'s the only one you can read!',
  },
  korean: {
    settings: '설정',
    language: '언어',
    hintSettings: 'Find the globe icon — you can\'t read Korean!',
    hintLanguage: 'Find "English" — it\'s the only one you can read!',
  },
  japanese: {
    settings: '設定',
    language: '言語',
    hintSettings: 'Find the globe icon — you can\'t read Japanese!',
    hintLanguage: 'Find "English" — it\'s the only one you can read!',
  },
  hindi: {
    settings: 'सेटिंग्स',
    language: 'भाषा',
    hintSettings: 'Find the globe icon — you can\'t read Hindi!',
    hintLanguage: 'Find "English" — it\'s the only one you can read!',
  },
};

const allSettingsMenus: Record<ForeignLanguage, MenuOption[]> = {
  greek: settingsMenuGreek,
  arabic: settingsMenuArabic,
  korean: settingsMenuKorean,
  japanese: settingsMenuJapanese,
  hindi: settingsMenuHindi,
};

export function BlindTranslation({ onComplete, onCancel }: BlindTranslationProps) {
  const languages: ForeignLanguage[] = ['greek', 'arabic', 'korean', 'japanese', 'hindi'];
  const [foreignLang] = useState<ForeignLanguage>(() =>
    languages[Math.floor(RngEngine.random() * languages.length)]
  );
  const settingsMenu = allSettingsMenus[foreignLang];
  const headers = headerLabels[foreignLang];
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
          className="mt-6 px-6 py-3 bg-accent-green text-primary font-bold rounded-xl"
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
          {currentScreen === 'settings' ? headers.settings : headers.language}
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
                <span className="text-base text-primary" dir={foreignLang === 'arabic' ? 'rtl' : 'ltr'}>{option.label}</span>
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
                <span className="text-base text-primary" dir={option.id === 'arabic' ? 'rtl' : 'ltr'}>{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {currentScreen === 'settings' && (
        <p className="text-center text-[10px] text-muted p-3">
          {headers.hintSettings}
        </p>
      )}
      {currentScreen === 'language' && (
        <p className="text-center text-[10px] text-muted p-3">
          {headers.hintLanguage}
        </p>
      )}
    </div>
  );
}
