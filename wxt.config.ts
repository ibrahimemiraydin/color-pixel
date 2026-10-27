import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import { key } from './extension-key.json';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: '__MSG_extensionName__',
    key,
    description: '__MSG_extensionDescription__',
    default_locale: 'en',
    permissions: ['storage', 'clipboardWrite'],
    minimum_chrome_version: '95',
    icons: { 16: '/icon/16.png', 32: '/icon/32.png', 48: '/icon/48.png', 128: '/icon/128.png' },
  },
  vite: () => ({ plugins: [tailwindcss()] }),
});
