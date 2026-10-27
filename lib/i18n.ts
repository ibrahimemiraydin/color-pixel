export type Language = 'tr' | 'en';

const tr = {
  tagline: 'Bir renk, bin ihtimal.',
  selectedColor: 'Seçili renk',
  pick: 'Ekrandan renk seç',
  picking: 'Ekrandan bir renk seçin…',
  hint: 'Bir piksele tıklayın · İptal etmek için Esc',
  unsupported: 'Bu tarayıcı ekran damlalığını desteklemiyor.',
  colorCodes: 'Renk kodları',
  colorCode: '{value} renk kodu',
  copyCode: '{value} kodunu kopyala',
  copy: 'Kopyala',
  enterHex: 'HEX kodu girin',
  apply: 'Uygula',
  history: 'Renk geçmişi',
  recent: 'Son renkler',
  clear: 'Geçmişi temizle',
  clearLabel: 'Renk geçmişini temizle',
  selectColor: '{value} rengini seç',
  empty: 'Seçtiğiniz renkler burada birikir.',
  loading: 'Geçmiş yükleniyor…',
  localOnly: 'Yalnızca cihazınızda saklanır',
  explore: 'RENKLERİ KEŞFET',
  loadError: 'Ayarlar okunamadı. Paneli yeniden açın.',
  saveError: 'Renk seçildi ancak geçmiş kaydedilemedi.',
  cancelled: 'Renk seçimi iptal edildi.',
  pickError: 'Renk seçici açılamadı. Yeniden deneyin.',
  copied: '{value} kodu kopyalandı.',
  copyError: 'Kopyalanamadı. Renk kodunu seçip elle kopyalayabilirsiniz.',
  cleared: 'Geçmiş temizlendi.',
  clearError: 'Geçmiş temizlenemedi. Yeniden deneyin.',
  invalidHex: '3 veya 6 haneli bir HEX kodu girin.',
  languageError: 'Dil tercihi kaydedilemedi. Yeniden deneyin.',
};

export type TranslationKey = keyof typeof tr;
const en: Record<TranslationKey, string> = {
  tagline: 'One color, endless possibilities.',
  selectedColor: 'Selected color',
  pick: 'Pick a screen color',
  picking: 'Choose a color on your screen…',
  hint: 'Click a pixel · Press Esc to cancel',
  unsupported: 'This browser does not support the screen eyedropper.',
  colorCodes: 'Color codes',
  colorCode: '{value} color code',
  copyCode: 'Copy {value} code',
  copy: 'Copy',
  enterHex: 'Enter a HEX code',
  apply: 'Apply',
  history: 'Color history',
  recent: 'Recent colors',
  clear: 'Clear history',
  clearLabel: 'Clear color history',
  selectColor: 'Select {value} color',
  empty: 'Your picked colors will appear here.',
  loading: 'Loading history…',
  localOnly: 'Stored only on your device',
  explore: 'EXPLORE COLORS',
  loadError: 'Could not load settings. Reopen the popup.',
  saveError: 'Color selected, but history could not be saved.',
  cancelled: 'Color selection cancelled.',
  pickError: 'Could not open the color picker. Try again.',
  copied: '{value} code copied.',
  copyError: 'Could not copy. Select the color code and copy it manually.',
  cleared: 'History cleared.',
  clearError: 'Could not clear history. Try again.',
  invalidHex: 'Enter a 3- or 6-digit HEX code.',
  languageError: 'Could not save your language preference. Try again.',
};

export function detectLanguage(locale: string): Language {
  return locale.toLowerCase().split(/[-_]/)[0] === 'tr' ? 'tr' : 'en';
}

export function translate(language: Language, key: TranslationKey, value = '') {
  return ({ tr, en }[language][key]).replace('{value}', value);
}
