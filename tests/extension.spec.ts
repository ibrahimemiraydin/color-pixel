import { test, expect, chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

test('üretim uzantısı: giriş, kopyalama, kalıcılık ve geçmiş', async () => {
  const profile = await mkdtemp(resolve(tmpdir(), 'color-picker-test-'));
  const extension = resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(profile, {
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chromium', headless: true,
    locale: 'en-US',
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
  });
  try {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const { key } = JSON.parse(readFileSync(resolve('extension-key.json'), 'utf8')) as { key: string };
    const id = createHash('sha256').update(Buffer.from(key, 'base64')).digest('hex').slice(0, 32).replace(/[0-9a-f]/g, char => String.fromCharCode(97 + parseInt(char, 16)));
    await page.setViewportSize({ width: 360, height: 600 });
    await page.goto(`chrome-extension://${id}/popup.html`);
    await expect(page.getByLabel('Language / Dil')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Pick a screen color', exact: true })).toBeVisible();
    await page.getByLabel('Language / Dil').selectOption('tr');
    await expect(page.getByRole('button', { name: 'Uygula', exact: true })).toBeEnabled();
    await expect(page.getByRole('heading', { name: 'Color Pixel' })).toBeVisible();

    await page.getByLabel('HEX kodu girin', { exact: true }).fill('#abc');
    await page.getByRole('button', { name: 'Uygula', exact: true }).click();
    await expect(page.getByLabel('HEX renk kodu', { exact: true })).toHaveValue('#AABBCC');
    await expect(page.getByLabel('RGB renk kodu', { exact: true })).toHaveValue('rgb(170, 187, 204)');
    await page.getByLabel('HEX kodunu kopyala', { exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('HEX kodu kopyalandı.');
    await page.getByLabel('HEX kodu girin', { exact: true }).fill('');
    await page.getByLabel('HEX kodu girin', { exact: true }).press('Control+V');
    await expect(page.getByLabel('HEX kodu girin', { exact: true })).toHaveValue('#AABBCC');

    await page.getByLabel('HEX kodu girin', { exact: true }).fill('invalid');
    await page.getByRole('button', { name: 'Uygula', exact: true }).click();
    await expect(page.getByLabel('HEX kodu girin', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('HEX renk kodu', { exact: true })).toHaveValue('#AABBCC');
    await page.reload();
    await expect(page.getByLabel('Language / Dil')).toHaveValue('tr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    await expect(page.getByLabel('HEX renk kodu', { exact: true })).toHaveValue('#AABBCC');
    await expect(page.getByRole('button', { name: '#AABBCC rengini seç', exact: true })).toHaveCount(1);

    // Native screen interaction is mocked only for deterministic success/cancel coverage.
    await page.evaluate(() => Object.defineProperty(window, 'EyeDropper', { configurable: true, value: class { async open() { return { sRGBHex: '#123456' }; } } }));
    await page.getByRole('button', { name: 'Ekrandan renk seç', exact: true }).click();
    await expect(page.getByLabel('HEX renk kodu', { exact: true })).toHaveValue('#123456');
    await page.evaluate(() => Object.defineProperty(window, 'EyeDropper', { configurable: true, value: class { async open() { throw new DOMException('Cancelled', 'AbortError'); } } }));
    await page.getByRole('button', { name: 'Ekrandan renk seç', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Renk seçimi iptal edildi.');
    await expect(page.getByLabel('HEX renk kodu', { exact: true })).toHaveValue('#123456');

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(600);
    await page.screenshot({ path: 'test-results/popup.png' });
    for (let i = 0; i < 20; i++) {
      const hex = '#' + i.toString(16).padStart(6, '0');
      await page.getByLabel('HEX kodu girin', { exact: true }).fill(hex);
      await page.getByRole('button', { name: 'Uygula', exact: true }).click();
      await expect(page.getByRole('button', { name: `${hex.toUpperCase()} rengini seç`, exact: true })).toBeVisible();
    }
    expect(await page.locator('.history-swatch').count()).toBe(20);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(600);
    await page.screenshot({ path: 'test-results/color-pixel-tr.png' });
    await page.getByLabel('Language / Dil').selectOption('en');
    await expect(page.getByRole('button', { name: 'Pick a screen color', exact: true })).toBeVisible();
    await expect(page.getByLabel('HEX color code', { exact: true })).toHaveValue('#000013');
    await page.getByLabel('Enter a HEX code', { exact: true }).fill('invalid');
    await page.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Enter a 3- or 6-digit HEX code.');
    await page.getByLabel('Language / Dil').selectOption('tr');
    await expect(page.getByRole('status')).toHaveText('3 veya 6 haneli bir HEX kodu girin.');
    await page.getByLabel('Language / Dil').selectOption('en');
    await page.reload();
    await expect(page.getByLabel('Language / Dil')).toHaveValue('en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByLabel('HEX color code', { exact: true })).toHaveValue('#000013');
    expect(await page.locator('.history-swatch').count()).toBe(20);
    await page.getByLabel('Copy RGB code', { exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('RGB code copied.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(600);
    await page.screenshot({ path: 'test-results/color-pixel-en.png' });
    await page.getByRole('button', { name: 'Clear color history', exact: true }).click();
    await page.reload();
    await expect(page.getByText('Your picked colors will appear here.')).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await rm(profile, { recursive: true, force: true });
  }
});
