// Translation tables for foreign language UI strings in mini-games.
// Keys are the English strings. Each language maps key → translated string.
// Uses {n} placeholders for dynamic values.

import type { ForeignLanguage } from '../types/game';

type TranslationTable = Record<string, string>;

const greek: TranslationTable = {
  'tabs.open': '{n} καρτέλες ανοιχτές',
  'tabs.closed': '{n}/{n} κλείστηκαν',
  'duplicates.left': '{n} διπλότυπα απομένουν',
  'duplicates.delete': 'Διαγραφή',
  'duplicates.freed': 'Χώρος αποθηκευτικό χώρου απελευθερώθηκε!',
  'antivirus.home': 'Αρχική Οθόνη',
  'antivirus.scanning': 'Σάρωση...',
  'antivirus.longpress': 'Μακρύ πάτημα για αφαίρεση',
  'antivirus.removed': 'αφαιρέθηκε!',
  'quicksettings.title': 'Γρήγορες Ρυθμίσεις',
  'quicksettings.flashlight': 'Φακός',
  'quicksettings.on': 'ΕΝΕΡΓΟ',
  'quicksettings.off': 'ΑΝΕΝΕΡΓΟ',
  'quicksettings.page': 'Σελίδα {n}/{n}',
};

const arabic: TranslationTable = {
  'tabs.open': '{n} علامات تبويب مفتوحة',
  'tabs.closed': 'تم إغلاق {n}/{n}',
  'duplicates.left': '{n} صور مكررة متبقية',
  'duplicates.delete': 'حذف',
  'duplicates.freed': 'تم تحرير مساحة التخزين!',
  'antivirus.home': 'الشاشة الرئيسية',
  'antivirus.scanning': 'جارٍ الفحص...',
  'antivirus.longpress': 'اضغط مطولاً للإزالة',
  'antivirus.removed': 'تمت الإزالة!',
  'quicksettings.title': 'الإعدادات السريعة',
  'quicksettings.flashlight': 'الكمّارية',
  'quicksettings.on': 'تشغيل',
  'quicksettings.off': 'إيقاف',
  'quicksettings.page': 'صفحة {n}/{n}',
};

const korean: TranslationTable = {
  'tabs.open': '{n}개 탭 열림',
  'tabs.closed': '{n}/{n}개 닫음',
  'duplicates.left': '{n}개 중복 사진',
  'duplicates.delete': '삭제',
  'duplicates.freed': '저장 공간 확보!',
  'antivirus.home': '홈 화면',
  'antivirus.scanning': '스캔 중...',
  'antivirus.longpress': '길게 눌러 제거',
  'antivirus.removed': '제거됨!',
  'quicksettings.title': '빠른 설정',
  'quicksettings.flashlight': '손전등',
  'quicksettings.on': '켜기',
  'quicksettings.off': '끄기',
  'quicksettings.page': '페이지 {n}/{n}',
};

const japanese: TranslationTable = {
  'tabs.open': '{n}タブ開いています',
  'tabs.closed': '{n}/{n}閉じました',
  'duplicates.left': '{n}件の重複写真',
  'duplicates.delete': '削除',
  'duplicates.freed': 'ストレージを解放しました！',
  'antivirus.home': 'ホーム画面',
  'antivirus.scanning': 'スキャン中...',
  'antivirus.longpress': '長押しでアンインストール',
  'antivirus.removed': '削除しました！',
  'quicksettings.title': 'クイック設定',
  'quicksettings.flashlight': 'ライト',
  'quicksettings.on': 'オン',
  'quicksettings.off': 'オフ',
  'quicksettings.page': 'ページ {n}/{n}',
};

const hindi: TranslationTable = {
  'tabs.open': '{n} टैब खुले हैं',
  'tabs.closed': '{n}/{n} बंद',
  'duplicates.left': '{n} डुप्लिकेट फ़ोटो',
  'duplicates.delete': 'हटाएँ',
  'duplicates.freed': 'स्टोरेज खाली हो गया!',
  'antivirus.home': 'होम स्क्रीन',
  'antivirus.scanning': 'स्कैन हो रहा है...',
  'antivirus.longpress': 'हटाने के लिए लंबे समय तक दबाएँ',
  'antivirus.removed': 'हटा दिया गया!',
  'quicksettings.title': 'क्विक सेटिंग्स',
  'quicksettings.flashlight': 'टॉर्च',
  'quicksettings.on': 'चालू',
  'quicksettings.off': 'बंद',
  'quicksettings.page': 'पृष्ठ {n}/{n}',
};

const chinese: TranslationTable = {
  'tabs.open': '{n} 个标签页打开',
  'tabs.closed': '已关闭 {n}/{n}',
  'duplicates.left': '{n} 个重复照片',
  'duplicates.delete': '删除',
  'duplicates.freed': '存储空间已释放！',
  'antivirus.home': '主屏幕',
  'antivirus.scanning': '扫描中...',
  'antivirus.longpress': '长按以卸载',
  'antivirus.removed': '已删除！',
  'quicksettings.title': '快速设置',
  'quicksettings.flashlight': '手电筒',
  'quicksettings.on': '开',
  'quicksettings.off': '关',
  'quicksettings.page': '第 {n}/{n} 页',
};

const translations: Record<ForeignLanguage, TranslationTable> = {
  greek,
  arabic,
  korean,
  japanese,
  hindi,
  chinese,
};

/**
 * Translate a UI string key. Falls back to the key itself (English) if no language
 * or no translation exists. Supports {var} placeholder substitution.
 */
export function t(
  lang: ForeignLanguage | null,
  key: string,
  vars?: Record<string, string | number>,
): string {
  if (!lang) return key;
  const table = translations[lang];
  let str = table[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}

/** Returns true if the language requires right-to-left rendering. */
export function isRTL(lang: ForeignLanguage | null): boolean {
  return lang === 'arabic';
}
