import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Pipette, Trash2, ArrowUpRight } from 'lucide-react';
import { browser } from 'wxt/browser';
import { addHistory, colorValues, normalizeHex } from '../../lib/color';
import { detectLanguage, translate, type Language, type TranslationKey } from '../../lib/i18n';

type EyeDropperWindow = Window & { EyeDropper?: new () => { open: (options?: { signal: AbortSignal }) => Promise<{ sRGBHex: string }> } };
const initial = '#A3E635';

export default function App() {
  const [color, setColor] = useState(initial);
  const [input, setInput] = useState(initial);
  const [history, setHistory] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState<Language>(() => detectLanguage(navigator.language));
  const [message, setMessage] = useState<TranslationKey | ''>('');
  const [messageValue, setMessageValue] = useState('');
  const t = (key: TranslationKey, value = '') => translate(language, key, value);
  const [invalid, setInvalid] = useState(false);
  const [copied, setCopied] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controller = useRef<AbortController | null>(null);
  const values = colorValues(color);
  const supported = Boolean((window as EyeDropperWindow).EyeDropper);

  useEffect(() => {
    let active = true;
    browser.storage.local.get(['history', 'language']).then(data => {
      if (!active) return;
      const saved = Array.isArray(data.history) ? [...new Set(data.history.filter((v): v is string => typeof v === 'string').map(normalizeHex).filter((v): v is string => v !== null))].slice(0, 20) : [];
      setHistory(saved);
      if (data.language === 'tr' || data.language === 'en') setLanguage(data.language);
      if (saved[0]) { setColor(saved[0]); setInput(saved[0]); }
      setReady(true);
    }).catch(() => { if (active) setMessage('loadError'); });
    return () => { active = false; controller.current?.abort(); if (timer.current) clearTimeout(timer.current); };
  }, []);

  useEffect(() => { document.documentElement.lang = language; document.title = 'Color Pixel'; }, [language]);

  async function changeLanguage(next: Language) {
    setLanguage(next);
    try { await browser.storage.local.set({ language: next }); }
    catch { setMessage('languageError'); }
  }

  async function select(hex: string) {
    setColor(hex); setInput(hex); setInvalid(false); setMessage('');
    const next = addHistory(history, hex);
    setHistory(next);
    try { await browser.storage.local.set({ history: next }); }
    catch { setMessage('saveError'); }
  }

  async function pick() {
    const EyeDropper = (window as EyeDropperWindow).EyeDropper;
    if (!EyeDropper || busy) return;
    setBusy(true); setMessage('');
    controller.current = new AbortController();
    try {
      const result = await new EyeDropper().open({ signal: controller.current.signal });
      const hex = normalizeHex(result.sRGBHex);
      if (hex) await select(hex);
    } catch (error) {
      setMessage(error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'pickError');
    } finally { setBusy(false); controller.current = null; }
  }

  async function copy(format: keyof typeof values) {
    try {
      await navigator.clipboard.writeText(values[format]);
      setCopied(format); setMessage('copied'); setMessageValue(format);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(''), 1800);
    } catch { setMessage('copyError'); }
  }

  async function clearHistory() {
    try { await browser.storage.local.set({ history: [] }); setHistory([]); setMessage('cleared'); }
    catch { setMessage('clearError'); }
  }

  return <main className="p-4">
    <header className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5"><img className="logo" src="/icon/color-pixel.svg" width="34" height="34" alt="" /><div><h1 className="text-sm font-semibold tracking-tight">Color Pixel</h1><p className="text-[10px] text-zinc-500">{t('tagline')}</p></div></div>
      <select aria-label="Language / Dil" value={language} disabled={!ready || busy} onChange={e => void changeLanguage(e.target.value as Language)} className="language-select rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-[11px] text-zinc-300"><option value="tr">TR · Türkçe</option><option value="en">EN · English</option></select>
    </header>

    <section aria-label={t('selectedColor')} className="swatch relative mb-4 overflow-hidden rounded-2xl" style={{ backgroundColor: color }}>
      <div className="absolute bottom-3 left-3 rounded-full bg-black/75 px-3 py-1.5 font-mono text-xs text-white">{color}</div>
      <span className="absolute right-3 top-3 rounded-full bg-black/10 p-1.5 text-black/50"><ArrowUpRight size={16} /></span>
    </section>

    <button className="pick-button flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold" onClick={pick} disabled={!ready || busy || !supported}>
      <Pipette size={17} />{busy ? t('picking') : t('pick')}
    </button>
    <p className="mt-2 mb-3 text-center text-[10px] text-zinc-500">{supported ? t('hint') : t('unsupported')}</p>

    <section aria-label={t('colorCodes')} className="space-y-2">
      {(Object.keys(values) as (keyof typeof values)[]).map(format => <div className="code-row flex items-center gap-3 rounded-xl px-3" key={format}>
        <span className="w-7 text-[10px] font-semibold text-zinc-500">{format}</span>
        <input aria-label={t('colorCode', format)} readOnly value={values[format]} className="min-w-0 flex-1 border-0 bg-transparent py-2 font-mono text-xs text-zinc-200 outline-none" onFocus={e => e.target.select()} />
        <button aria-label={t('copyCode', format)} title={t('copy')} onClick={() => copy(format)} className="icon-button p-1.5">{copied === format ? <Check size={14} className="text-lime-300" /> : <Copy size={14} />}</button>
      </div>)}
    </section>

    <form className="mt-2 flex gap-2" onSubmit={e => { e.preventDefault(); const hex = normalizeHex(input); if (hex) void select(hex); else { setInvalid(true); setMessage('invalidHex'); } }}>
      <label className="sr-only" htmlFor="hex-input">{t('enterHex')}</label>
      <input id="hex-input" value={input} onChange={e => { setInput(e.target.value); setInvalid(false); }} aria-invalid={invalid} placeholder="#A3E635" maxLength={20} spellCheck={false} className={`hex-input min-w-0 flex-1 rounded-lg px-3 py-2 font-mono text-xs ${invalid ? 'border-red-400' : 'border-zinc-700'}`} />
      <button disabled={!ready || busy} className="apply-button rounded-lg px-3 text-xs font-medium" type="submit">{t('apply')}</button>
    </form>

    <section aria-label={t('history')} className="mt-4 border-t border-white/8 pt-3">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-medium text-zinc-300">{t('recent')} <span className="ml-1 text-[10px] text-zinc-600">{history.length}/20</span></h2><button onClick={clearHistory} disabled={!ready || busy || !history.length} className="icon-button p-1" title={t('clear')} aria-label={t('clearLabel')}><Trash2 size={13} /></button></div>
      {history.length ? <div className="grid grid-cols-10 gap-1.5">{history.map(hex => <button key={hex} disabled={busy} onClick={() => void select(hex)} title={hex} aria-label={t('selectColor', hex)} aria-pressed={color === hex} className="history-swatch aspect-square rounded-md" style={{ backgroundColor: hex }} />)}</div> : <p className="rounded-xl border border-dashed border-zinc-800 px-3 py-4 text-center text-[11px] text-zinc-500">{ready ? t('empty') : t('loading')}</p>}
    </section>
    <p role="status" aria-live="polite" className="mt-3 min-h-4 text-[11px] text-zinc-400">{message ? t(message, messageValue) : ''}</p>
    <footer className="mt-1 flex items-center justify-between text-[9px] text-zinc-600"><span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-lime-400" />{t('localOnly')}</span><span>{t('explore')}</span></footer>
  </main>;
}
