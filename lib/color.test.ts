import { describe, expect, it } from 'vitest';
import { addHistory, colorValues, normalizeHex } from './color';

describe('HEX girişi', () => {
  it('kısa, küçük harfli ve boşluklu kodları düzenler', () => {
    expect(normalizeHex(' abc ')).toBe('#AABBCC');
    expect(normalizeHex('#ff00aa')).toBe('#FF00AA');
  });
  it('geçersiz değerleri reddeder', () => {
    for (const value of ['', '#12', '#12345g', '#12345678', 'red']) expect(normalizeHex(value)).toBeNull();
  });
});
describe('renk dönüşümleri', () => {
  it.each([
    ['#FF0000', 'rgb(255, 0, 0)', 'hsl(0, 100%, 50%)'],
    ['#00FF00', 'rgb(0, 255, 0)', 'hsl(120, 100%, 50%)'],
    ['#0000FF', 'rgb(0, 0, 255)', 'hsl(240, 100%, 50%)'],
    ['#000000', 'rgb(0, 0, 0)', 'hsl(0, 0%, 0%)'],
    ['#FFFFFF', 'rgb(255, 255, 255)', 'hsl(0, 0%, 100%)'],
    ['#FF00FF', 'rgb(255, 0, 255)', 'hsl(300, 100%, 50%)'],
    ['#808080', 'rgb(128, 128, 128)', 'hsl(0, 0%, 50%)'],
  ])('%s doğru dönüştürülür', (hex, RGB, HSL) => { expect(colorValues(hex)).toEqual({ HEX: hex, RGB, HSL }); });
});
describe('geçmiş', () => {
  it('tekrarlanan rengi başa taşır ve 20 renk sınırını korur', () => {
    expect(addHistory(['#FFFFFF', '#000000'], '#000000')).toEqual(['#000000', '#FFFFFF']);
    const colors = Array.from({ length: 20 }, (_, i) => `#${i.toString(16).padStart(6, '0')}`);
    expect(addHistory(colors, '#FFFFFF')).toHaveLength(20);
    expect(addHistory(colors, '#FFFFFF').at(-1)).toBe(colors[18]);
  });
});
