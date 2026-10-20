import { KeyboardTheme } from '../types/keyboard';

export interface ThemeConfig {
  id: KeyboardTheme;
  name: string;
  nameBn: string;
  keyboardChassis: string;
  keyBg: string;
  keyText: string;
  keyBorder: string;
  keyActive: string;
  keyShadow: string;
  actionKeyBg: string;
  actionKeyText: string;
  actionKeyActive: string;
  spaceKeyBg: string;
  spaceKeyText: string;
  accentBg: string;
  accentText: string;
  popupBg: string;
  popupText: string;
  toolbarBg: string;
  toolbarText: string;
  previewCardBg: string;
}

export const THEMES: Record<KeyboardTheme, ThemeConfig> = {
  'gboard-dark': {
    id: 'gboard-dark',
    name: 'Gboard Dark',
    nameBn: 'জি-বোর্ড ডার্ক',
    keyboardChassis: 'bg-slate-900 border-slate-700/60',
    keyBg: 'bg-slate-800 hover:bg-slate-700',
    keyText: 'text-slate-100',
    keyBorder: 'border-slate-700/70',
    keyActive: 'bg-slate-700 brightness-125 scale-95',
    keyShadow: 'shadow-[0_2px_0_rgba(15,23,42,0.8)]',
    actionKeyBg: 'bg-slate-700/80 hover:bg-slate-700',
    actionKeyText: 'text-slate-200',
    actionKeyActive: 'bg-slate-600',
    spaceKeyBg: 'bg-slate-800 hover:bg-slate-700',
    spaceKeyText: 'text-slate-300',
    accentBg: 'bg-blue-600 hover:bg-blue-500',
    accentText: 'text-white',
    popupBg: 'bg-slate-800',
    popupText: 'text-white',
    toolbarBg: 'bg-slate-900/90 border-slate-800',
    toolbarText: 'text-slate-300',
    previewCardBg: 'bg-slate-900/80 border-slate-700/50',
  },
  'gboard-light': {
    id: 'gboard-light',
    name: 'Gboard Light',
    nameBn: 'জি-বোর্ড লাইট',
    keyboardChassis: 'bg-gray-200 border-gray-300',
    keyBg: 'bg-white hover:bg-gray-50',
    keyText: 'text-gray-900',
    keyBorder: 'border-gray-200',
    keyActive: 'bg-gray-100 scale-95',
    keyShadow: 'shadow-[0_2px_0_rgba(156,163,175,0.6)]',
    actionKeyBg: 'bg-gray-300 hover:bg-gray-200',
    actionKeyText: 'text-gray-800',
    actionKeyActive: 'bg-gray-400',
    spaceKeyBg: 'bg-white hover:bg-gray-50',
    spaceKeyText: 'text-gray-700',
    accentBg: 'bg-blue-600 hover:bg-blue-500',
    accentText: 'text-white',
    popupBg: 'bg-white',
    popupText: 'text-gray-900',
    toolbarBg: 'bg-gray-100 border-gray-300',
    toolbarText: 'text-gray-700',
    previewCardBg: 'bg-white border-gray-200 text-gray-900',
  },
  'material-blue': {
    id: 'material-blue',
    name: 'Material Blue',
    nameBn: 'ম্যাটেরিয়াল ব্লু',
    keyboardChassis: 'bg-sky-950 border-sky-800/60',
    keyBg: 'bg-sky-900/80 hover:bg-sky-900',
    keyText: 'text-sky-50',
    keyBorder: 'border-sky-700/60',
    keyActive: 'bg-sky-800 scale-95',
    keyShadow: 'shadow-[0_2px_0_rgba(8,47,73,0.9)]',
    actionKeyBg: 'bg-sky-800/80 hover:bg-sky-800',
    actionKeyText: 'text-sky-200',
    actionKeyActive: 'bg-sky-700',
    spaceKeyBg: 'bg-sky-900/90 hover:bg-sky-900',
    spaceKeyText: 'text-sky-200',
    accentBg: 'bg-sky-500 hover:bg-sky-400',
    accentText: 'text-sky-950 font-bold',
    popupBg: 'bg-sky-900',
    popupText: 'text-white',
    toolbarBg: 'bg-sky-950/90 border-sky-900',
    toolbarText: 'text-sky-200',
    previewCardBg: 'bg-sky-950/80 border-sky-800/50',
  },
  'emerald': {
    id: 'emerald',
    name: 'Emerald Forest',
    nameBn: 'মরু সবুজ (ইসলামিক)',
    keyboardChassis: 'bg-emerald-950 border-emerald-800/60',
    keyBg: 'bg-emerald-900/70 hover:bg-emerald-900',
    keyText: 'text-emerald-50',
    keyBorder: 'border-emerald-700/60',
    keyActive: 'bg-emerald-800 scale-95',
    keyShadow: 'shadow-[0_2px_0_rgba(6,78,59,0.9)]',
    actionKeyBg: 'bg-emerald-800/80 hover:bg-emerald-800',
    actionKeyText: 'text-emerald-200',
    actionKeyActive: 'bg-emerald-700',
    spaceKeyBg: 'bg-emerald-900/80 hover:bg-emerald-900',
    spaceKeyText: 'text-emerald-200',
    accentBg: 'bg-emerald-500 hover:bg-emerald-400',
    accentText: 'text-emerald-950 font-bold',
    popupBg: 'bg-emerald-900',
    popupText: 'text-emerald-50',
    toolbarBg: 'bg-emerald-950/90 border-emerald-900',
    toolbarText: 'text-emerald-200',
    previewCardBg: 'bg-emerald-950/80 border-emerald-800/50',
  },
  'amoled': {
    id: 'amoled',
    name: 'Pure AMOLED Black',
    nameBn: 'পিউর অ্যামোলেড ব্ল্যাক',
    keyboardChassis: 'bg-black border-neutral-800',
    keyBg: 'bg-neutral-900 hover:bg-neutral-800',
    keyText: 'text-white',
    keyBorder: 'border-neutral-800',
    keyActive: 'bg-neutral-800 scale-95',
    keyShadow: 'shadow-[0_2px_0_rgba(0,0,0,1)]',
    actionKeyBg: 'bg-neutral-800 hover:bg-neutral-700',
    actionKeyText: 'text-neutral-300',
    actionKeyActive: 'bg-neutral-700',
    spaceKeyBg: 'bg-neutral-900 hover:bg-neutral-800',
    spaceKeyText: 'text-neutral-300',
    accentBg: 'bg-white hover:bg-neutral-200',
    accentText: 'text-black font-bold',
    popupBg: 'bg-neutral-900',
    popupText: 'text-white',
    toolbarBg: 'bg-black border-neutral-900',
    toolbarText: 'text-neutral-400',
    previewCardBg: 'bg-black border-neutral-800',
  },
  'sunset': {
    id: 'sunset',
    name: 'Sunset Twilight',
    nameBn: 'সানসেট টুইলাইট',
    keyboardChassis: 'bg-slate-950 border-purple-900/60',
    keyBg: 'bg-purple-950/60 hover:bg-purple-900/70',
    keyText: 'text-rose-100',
    keyBorder: 'border-purple-800/50',
    keyActive: 'bg-purple-800 scale-95',
    keyShadow: 'shadow-[0_2px_0_rgba(59,7,100,0.9)]',
    actionKeyBg: 'bg-purple-900/70 hover:bg-purple-900',
    actionKeyText: 'text-rose-200',
    actionKeyActive: 'bg-purple-800',
    spaceKeyBg: 'bg-purple-950/80 hover:bg-purple-900/80',
    spaceKeyText: 'text-rose-200',
    accentBg: 'bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110',
    accentText: 'text-white font-bold',
    popupBg: 'bg-purple-900',
    popupText: 'text-rose-100',
    toolbarBg: 'bg-slate-950/90 border-purple-900/50',
    toolbarText: 'text-rose-200',
    previewCardBg: 'bg-slate-950/80 border-purple-900/50',
  },
};
