import { LanguageId } from '../types/keyboard';

export interface AndroidImeBridge {
  commitText?: (text: string) => void;
  deleteBackward?: () => void;
  sendEnter?: () => void;
  setLanguage?: (language: string) => void;
  closeKeyboard?: () => void;
  notifyReady?: () => void;
}

export interface ImeHandlers {
  onStartInput?: (subtype?: string) => void;
  onFinishInput?: () => void;
  onSelectionChanged?: (left: number, right: number) => void;
  setLanguage?: (language: string) => void;
}

declare global {
  interface Window {
    AndroidIME?: AndroidImeBridge;
    __gboardIme?: ImeHandlers;
    __imeHandle?: AndroidImeBridge;
  }
}

export const LANGUAGE_SUBTYPES: Record<LanguageId, string> = {
  bengali: 'bn-BD',
  arabic: 'ar',
  urdu: 'ur',
  english: 'en-US',
};

export function isNativeIme(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.AndroidIME || window.__imeHandle) return true;
  try {
    return new URLSearchParams(window.location.search).get('ime') === '1';
  } catch {
    return false;
  }
}

export function getImeBridge(): AndroidImeBridge | null {
  if (typeof window === 'undefined') return null;
  return window.AndroidIME ?? window.__imeHandle ?? null;
}

export function languageFromSubtype(subtype?: string | null): LanguageId | null {
  if (!subtype) return null;
  const normalized = subtype.trim();
  if (!normalized) return null;
  const direct = (Object.keys(LANGUAGE_SUBTYPES) as LanguageId[]).find(
    (lang) => LANGUAGE_SUBTYPES[lang].toLowerCase() === normalized.toLowerCase()
  );
  if (direct) return direct;
  const base = normalized.split(/[-_]/)[0].toLowerCase();
  if (base === 'bn') return 'bengali';
  if (base === 'ar') return 'arabic';
  if (base === 'ur') return 'urdu';
  if (base === 'en') return 'english';
  return null;
}
