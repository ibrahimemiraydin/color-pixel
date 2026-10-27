import { expect, it } from 'vitest';
import { detectLanguage, translate } from './i18n';

it('Türkçe bölge kodlarını tanır ve diğer diller için İngilizce kullanır', () => {
  for (const locale of ['tr', 'tr-TR', 'TR_tr']) expect(detectLanguage(locale)).toBe('tr');
  for (const locale of ['en-US', 'de-DE', '']) expect(detectLanguage(locale)).toBe('en');
});

it('dinamik mesajları iki dilde gösterir', () => {
  expect(translate('tr', 'copied', 'HEX')).toBe('HEX kodu kopyalandı.');
  expect(translate('en', 'copied', 'HEX')).toBe('HEX code copied.');
});
