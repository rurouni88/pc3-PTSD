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
  'faceid.aligning': 'Στοίχιση...',
  'faceid.scanning': 'Σάρωση...',
  'faceid.almost': 'Σχεδόν...',
  'faceid.distractions': '{n}/{max} αποσπάσεις',
  'fingerprint.clean': 'Καθαρό',
  'fingerprint.perTap': '{n}%/πίεση',
  'fingerprint.wipe': 'Πετσόμασσε με το πουκάμισο',
  'fingerprint.wiping': 'Πετσόμασσω...',
  'fingerprint.lotion': 'Κρέμα',
  'fingerprint.toast_crumbs': 'Περιττοί ψωμί',
  'fingerprint.sweat': 'Ιδρώς',
  'fingerprint.flour': 'Αλεύρι',
  'fingerprint.mud': 'Λασπόνι',
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
  'faceid.aligning': 'محاذاة...',
  'faceid.scanning': 'جارٍ الفحص...',
  'faceid.almost': 'شبه مكتمل...',
  'faceid.distractions': '{n}/{max} مقاطعات',
  'fingerprint.clean': 'نظيف',
  'fingerprint.perTap': '{n}%/لمسة',
  'fingerprint.wipe': 'امسح الشاشة بالقميص',
  'fingerprint.wiping': 'جارٍ المسح...',
  'fingerprint.lotion': 'مرطب',
  'fingerprint.toast_crumbs': 'فتات توست',
  'fingerprint.sweat': 'عرق',
  'fingerprint.flour': 'دقيق',
  'fingerprint.mud': 'وحل',
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
  'faceid.aligning': '정렬 중...',
  'faceid.scanning': '스캔 중...',
  'faceid.almost': '거의 다 됐어요...',
  'faceid.distractions': '집중 분산 {n}/{max}',
  'fingerprint.clean': '깨끗함',
  'fingerprint.perTap': '{n}%/탭',
  'fingerprint.wipe': '셔츠로 화면 닦기',
  'fingerprint.wiping': '닦는 중...',
  'fingerprint.lotion': '로션',
  'fingerprint.toast_crumbs': '토스트 부스러기',
  'fingerprint.sweat': '땀',
  'fingerprint.flour': '밀가루',
  'fingerprint.mud': '진흙',
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
  'faceid.aligning': '整列中...',
  'faceid.scanning': 'スキャン中...',
  'faceid.almost': 'もうすぐ...',
  'faceid.distractions': '分心 {n}/{max}',
  'fingerprint.clean': 'きれいです',
  'fingerprint.perTap': '{n}%/タップ',
  'fingerprint.wipe': 'シャツで画面を拭く',
  'fingerprint.wiping': '拭いています...',
  'fingerprint.lotion': 'ローション',
  'fingerprint.toast_crumbs': 'トーストのくず',
  'fingerprint.sweat': '汗',
  'fingerprint.flour': '小麦粉',
  'fingerprint.mud': '泥',
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
  'faceid.aligning': 'सामंजस्य...',
  'faceid.scanning': 'स्कैन हो रहा है...',
  'faceid.almost': 'लगभग हो गया...',
  'faceid.distractions': '{n}/{max} ध्यान भटकना',
  'fingerprint.clean': 'साफ़',
  'fingerprint.perTap': '{n}%/टैप',
  'fingerprint.wipe': 'कमीज़ से स्क्रीन पोंछें',
  'fingerprint.wiping': 'पोंछ रहे हैं...',
  'fingerprint.lotion': 'लotion',
  'fingerprint.toast_crumbs': 'टोस्ट के कण',
  'fingerprint.sweat': 'पसीना',
  'fingerprint.flour': 'आटा',
  'fingerprint.mud': 'कचरा',
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
  'faceid.aligning': '对准中...',
  'faceid.scanning': '扫描中...',
  'faceid.almost': '快好了...',
  'faceid.distractions': '分心 {n}/{max}',
  'fingerprint.clean': '干净',
  'fingerprint.perTap': '每次 {n}%',
  'fingerprint.wipe': '用衣服擦屏幕',
  'fingerprint.wiping': '擦拭中...',
  'fingerprint.lotion': '乳液',
  'fingerprint.toast_crumbs': '面包屑',
  'fingerprint.sweat': '汗水',
  'fingerprint.flour': '面粉',
  'fingerprint.mud': '泥土',
};

const english: TranslationTable = {
  'tabs.open': '{n} tabs open',
  'tabs.closed': '{n} closed',
  'duplicates.left': '{n} duplicates left',
  'duplicates.delete': 'Delete',
  'duplicates.freed': 'Storage freed!',
  'antivirus.home': 'Home Screen',
  'antivirus.scanning': 'Scanning...',
  'antivirus.longpress': 'Long-press to remove',
  'antivirus.removed': 'removed!',
  'quicksettings.title': 'Quick Settings',
  'quicksettings.flashlight': 'Flashlight',
  'quicksettings.on': 'ON',
  'quicksettings.off': 'OFF',
  'quicksettings.page': 'Page {n}/{total}',
  'faceid.aligning': 'Aligning...',
  'faceid.scanning': 'Scanning...',
  'faceid.almost': 'Almost there...',
  'faceid.distractions': '{n}/{max} distractions',
  'fingerprint.clean': 'Clean',
  'fingerprint.perTap': '{n}%/tap',
  'fingerprint.wipe': 'Wipe Screen with Shirt',
  'fingerprint.wiping': 'Wiping...',
  'fingerprint.lotion': 'Lotion',
  'fingerprint.toast_crumbs': 'Toast crumbs',
  'fingerprint.sweat': 'Sweat',
  'fingerprint.flour': 'Flour',
  'fingerprint.mud': 'Mud',
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
  const table = lang ? translations[lang] : english;
  let str = table[key] ?? english[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.split(`{${k}}`).join(String(v));
    }
  }
  return str;
}

/** Returns true if the language requires right-to-left rendering. */
export function isRTL(lang: ForeignLanguage | null): boolean {
  return lang === 'arabic';
}
