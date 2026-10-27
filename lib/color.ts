export function normalizeHex(value: string): string | null {
  const hex = value.trim().replace(/^#/, '');
  if (/^[\da-f]{3}$/i.test(hex)) return '#' + hex.split('').map(c => c + c).join('').toUpperCase();
  return /^[\da-f]{6}$/i.test(hex) ? '#' + hex.toUpperCase() : null;
}

export function colorValues(hex: string) {
  const normalized = normalizeHex(hex);
  if (!normalized) throw new Error('Geçersiz HEX');
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn), delta = max - min;
  const l = (max + min) / 2;
  let h = 0;
  if (delta) {
    h = max === rn ? ((gn - bn) / delta) % 6 : max === gn ? (bn - rn) / delta + 2 : (rn - gn) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  const s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0;
  return { HEX: normalized, RGB: `rgb(${r}, ${g}, ${b})`, HSL: `hsl(${Math.round(h) % 360}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` };
}

export function addHistory(history: string[], hex: string) {
  return [hex, ...history.filter(item => item !== hex)].slice(0, 20);
}
