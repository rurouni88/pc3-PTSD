import { useState, useCallback } from 'react';
import { Icon } from '../Icon';
import { RngEngine } from '../../engine/seeded-rng';
import { playSound } from '../../engine/sound';
import { playHaptic } from '../../engine/haptics';
import type { ForeignLanguage, MiniGameQuality } from '../../types/game';
import { Hint } from '../Hint';

interface BlindTranslationProps {
  difficulty: string;
  foreignLanguage: ForeignLanguage | null;
  onComplete: (quality?: MiniGameQuality, selectedLanguage?: string) => void;
  onCancel: () => void;
}

interface MenuOption {
  id: string;
  label: string;
  icon: string;
  isTarget: boolean;
}

type DisplayLanguage = 'greek' | 'arabic' | 'korean' | 'japanese' | 'hindi';

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

const headerLabels: Record<DisplayLanguage, { settings: string; language: string; hintSettings: string; hintLanguage: string }> = {
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

const allSettingsMenus: Record<DisplayLanguage, MenuOption[]> = {
  greek: settingsMenuGreek,
  arabic: settingsMenuArabic,
  korean: settingsMenuKorean,
  japanese: settingsMenuJapanese,
  hindi: settingsMenuHindi,
};

const completionQuotes: Record<string, string> = {
  dad: 'Dad: "So that\'s how you change the language. I could\'ve done that myself."',
  mum: 'Mum: "Oh thank you, I thought I broke the phone. Can you also fix the text size?"',
  grandma: 'Grandma: "Oh thank you, I thought I broke the phone."',
};

const grandmaChineseQuote = '奶奶：「谢谢你，我以为手机坏了。其实中文挺好的。」';

export function BlindTranslation({ difficulty, foreignLanguage, onComplete, onCancel }: BlindTranslationProps) {
  const languages: DisplayLanguage[] = ['greek', 'arabic', 'korean', 'japanese', 'hindi'];
  // Use shared foreignLanguage if provided (Grandma), otherwise pick randomly (Dad/Mum)
  const [foreignLang] = useState<DisplayLanguage>(() => {
    if (foreignLanguage && foreignLanguage !== 'chinese') {
      return foreignLanguage as DisplayLanguage;
    }
    return languages[Math.floor(RngEngine.random() * languages.length)];
  });
  const settingsMenu = allSettingsMenus[foreignLang];
  const headers = headerLabels[foreignLang];
  const [currentScreen, setCurrentScreen] = useState<'settings' | 'language' | 'done'>('settings');
  const [wrongPick, setWrongPick] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  const handleSettingsTap = useCallback((id: string) => {
    const option = settingsMenu.find((o) => o.id === id);
    if (option?.isTarget) {
      setCurrentScreen('language');
      playSound('click');
      playHaptic('click');
    } else {
      setWrongPick(true);
      playSound('failure');
      playHaptic('failure');
      setTimeout(() => setWrongPick(false), 1500);
    }
  }, []);

  const handleLanguageTap = useCallback((id: string) => {
    const option = languageOptions.find((o) => o.id === id);
    const isEasterEgg = difficulty === 'grandma' && id === 'chinese';
    if (option?.isTarget || isEasterEgg) {
      setSelectedLanguage(option?.label ?? 'English');
      setCurrentScreen('done');
      playSound('success');
      playHaptic('complete');
    } else {
      setWrongPick(true);
      playSound('failure');
      playHaptic('failure');
      setTimeout(() => setWrongPick(false), 1500);
    }
  }, [difficulty]);

  const handleDone = useCallback(() => {
    // Report which language was selected so the engine can handle the Chinese Easter Egg
    const isChinese = selectedLanguage === '中文';
    onComplete(undefined, isChinese ? 'chinese' : 'english');
  }, [selectedLanguage, onComplete]);

  if (currentScreen === 'done') {
    const isChinese = selectedLanguage === '中文';
    const quote = isChinese ? grandmaChineseQuote : (completionQuotes[difficulty] ?? completionQuotes.grandma);
    return (
      <div className="h-full flex flex-col items-center justify-center bg-primary p-6">
        <Icon name="globe" size={48} className="text-accent-blue mb-4" />
        <p className="text-xl font-bold text-primary">Language: {selectedLanguage}</p>
        <p className="text-sm text-secondary mt-2" dir={isChinese ? 'ltr' : 'auto'}>
          {quote}
        </p>
        <button
          onClick={() => { playSound('success'); handleDone(); }}
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

      <Hint visible={currentScreen === 'settings'} className="p-3">{headers.hintSettings}</Hint>
      <Hint visible={currentScreen === 'language'} className="p-3">{headers.hintLanguage}</Hint>
    </div>
  );
}
