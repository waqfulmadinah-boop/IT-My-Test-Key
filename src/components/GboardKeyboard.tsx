import React, { useRef } from 'react';
import { 
  Delete, 
  CornerDownLeft, 
  Globe, 
  ArrowBigUp, 
  Hash, 
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { KeyItem, LanguageId, KeyboardSettings } from '../types/keyboard';
import { 
  BENGALI_ALL_49_SERIAL, 
  BENGALI_CONJUNCTS, 
  BENGALI_KARS, 
  BENGALI_NUMBERS_PUNCT,
  ARABIC_ALPHABET,
  ARABIC_ALIF_VARIANTS,
  ARABIC_TASHKEEL,
  ARABIC_HONORIFICS,
  ARABIC_NUMERALS_PUNCT,
  ENGLISH_LOWERCASE,
  ENGLISH_UPPERCASE,
  ENGLISH_NUMBERS_SYMBOLS,
  URDU_ALPHABET,
  URDU_SIGNS_TASHKEEL,
  URDU_DIGITS,
  LANGUAGES
} from '../data/keyboardData';
import { KeyButton } from './KeyButton';
import { ThemeConfig } from '../utils/themeStyles';
import { soundManager } from '../utils/audio';

interface GboardKeyboardProps {
  currentLanguage: LanguageId;
  onLanguageChange: (lang: LanguageId) => void;
  currentSubTab: string;
  onSubTabChange: (tab: string) => void;
  settings: KeyboardSettings;
  theme: ThemeConfig;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  searchQuery: string;
}

export const GboardKeyboard: React.FC<GboardKeyboardProps> = ({
  currentLanguage,
  onLanguageChange,
  currentSubTab,
  onSubTabChange,
  settings,
  theme,
  onKeyPress,
  onBackspace,
  onEnter,
  onSpace,
  searchQuery,
}) => {
  const backspaceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backspaceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get active keys list based on language and subTab
  const getKeys = (): KeyItem[] => {
    let list: KeyItem[] = [];

    if (currentLanguage === 'bengali') {
      if (currentSubTab === 'conjuncts') list = BENGALI_CONJUNCTS;
      else if (currentSubTab === 'kars') list = BENGALI_KARS;
      else if (currentSubTab === 'numbers') list = BENGALI_NUMBERS_PUNCT;
      else list = BENGALI_ALL_49_SERIAL; // default: all 49 letters in serial order
    } else if (currentLanguage === 'arabic') {
      if (currentSubTab === 'alif-variants') list = ARABIC_ALIF_VARIANTS;
      else if (currentSubTab === 'tashkeel') list = ARABIC_TASHKEEL;
      else if (currentSubTab === 'honorifics') list = ARABIC_HONORIFICS;
      else if (currentSubTab === 'numbers') list = ARABIC_NUMERALS_PUNCT;
      else list = ARABIC_ALPHABET;
    } else if (currentLanguage === 'english') {
      if (currentSubTab === 'upper') list = ENGLISH_UPPERCASE;
      else if (currentSubTab === 'symbols') list = ENGLISH_NUMBERS_SYMBOLS;
      else list = ENGLISH_LOWERCASE;
    } else if (currentLanguage === 'urdu') {
      if (currentSubTab === 'signs') list = URDU_SIGNS_TASHKEEL;
      else if (currentSubTab === 'digits') list = URDU_DIGITS;
      else list = URDU_ALPHABET;
    }

    // Filter by search query if present
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      // Search all keys of current language
      let allLangKeys: KeyItem[] = [];
      if (currentLanguage === 'bengali') {
        allLangKeys = [...BENGALI_ALL_49_SERIAL, ...BENGALI_CONJUNCTS, ...BENGALI_KARS, ...BENGALI_NUMBERS_PUNCT];
      } else if (currentLanguage === 'arabic') {
        allLangKeys = [...ARABIC_ALPHABET, ...ARABIC_ALIF_VARIANTS, ...ARABIC_TASHKEEL, ...ARABIC_HONORIFICS, ...ARABIC_NUMERALS_PUNCT];
      } else if (currentLanguage === 'english') {
        allLangKeys = [...ENGLISH_LOWERCASE, ...ENGLISH_UPPERCASE, ...ENGLISH_NUMBERS_SYMBOLS];
      } else if (currentLanguage === 'urdu') {
        allLangKeys = [...URDU_ALPHABET, ...URDU_SIGNS_TASHKEEL, ...URDU_DIGITS];
      }

      list = allLangKeys.filter(
        (k) =>
          k.label.toLowerCase().includes(q) ||
          k.insertText.toLowerCase().includes(q) ||
          (k.subLabel && k.subLabel.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const keys = getKeys();

  // Cycle to next language
  const handleCycleLanguage = () => {
    const langIds: LanguageId[] = ['bengali', 'arabic', 'english', 'urdu'];
    const currentIndex = langIds.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % langIds.length;
    onLanguageChange(langIds[nextIndex]);
  };

  // Backspace with long-press continuous deletion
  const startBackspace = () => {
    if (settings.soundEnabled) soundManager.playKeyClick(true);
    if (settings.hapticEnabled) soundManager.vibrate(18);
    onBackspace();

    backspaceTimerRef.current = setTimeout(() => {
      backspaceIntervalRef.current = setInterval(() => {
        if (settings.soundEnabled) soundManager.playKeyClick(true);
        if (settings.hapticEnabled) soundManager.vibrate(10);
        onBackspace();
      }, 70);
    }, 400);
  };

  const stopBackspace = () => {
    if (backspaceTimerRef.current) clearTimeout(backspaceTimerRef.current);
    if (backspaceIntervalRef.current) clearInterval(backspaceIntervalRef.current);
  };

  // Space press
  const handleSpacePress = () => {
    if (settings.soundEnabled) soundManager.playKeyClick(true);
    if (settings.hapticEnabled) soundManager.vibrate(12);
    onSpace();
  };

  // Enter press
  const handleEnterPress = () => {
    if (settings.soundEnabled) soundManager.playKeyClick(true);
    if (settings.hapticEnabled) soundManager.vibrate(16);
    onEnter();
  };

  // Get current language native name for spacebar
  const currentLangMeta = LANGUAGES.find((l) => l.id === currentLanguage);

  return (
    <div
      className={`w-full ${theme.keyboardChassis} border-t px-1 sm:px-2 pt-1.5 pb-2.5 flex flex-col select-none touch-manipulation transition-colors duration-200`}
    >
      {/* Keyboard Grid */}
      <div className="w-full flex-1 min-h-[170px] max-h-[260px] overflow-y-auto overflow-x-hidden p-1 scrollbar-thin">
        {keys.length === 0 ? (
          <div className="w-full h-32 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
            <span>কোনো বর্ণ পাওয়া যায়নি</span>
            <button
              onClick={() => onSubTabChange(currentLanguage === 'english' ? 'lower' : currentLanguage === 'urdu' ? 'alphabet' : currentLanguage === 'arabic' ? 'alphabet' : 'all-serial')}
              className="text-blue-400 hover:underline mt-1"
            >
              স্বাভাবিক ভিউতে ফিরুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-1 sm:gap-1.5 w-full">
            {keys.map((keyItem) => (
              <KeyButton
                key={keyItem.id}
                item={keyItem}
                onPress={onKeyPress}
                settings={settings}
                themeClasses={theme}
              />
            ))}
          </div>
        )}
      </div>

      {/* Gboard Bottom Action Row: ?123, Globe, Spacebar, Enter, Backspace */}
      <div className="w-full flex items-center justify-between gap-1 sm:gap-1.5 mt-1.5 px-0.5">
        {/* Toggle Mode / Numbers / Case */}
        {currentLanguage === 'english' ? (
          <button
            type="button"
            onClick={() => onSubTabChange(currentSubTab === 'upper' ? 'lower' : 'upper')}
            className={`w-12 sm:w-14 h-12 rounded-lg flex items-center justify-center ${theme.actionKeyBg} ${theme.actionKeyText} border ${theme.keyBorder} active:scale-95 transition-all text-xs font-semibold`}
            title="ছোট / বড় হাতের অক্ষর (Caps)"
          >
            <ArrowBigUp size={20} className={currentSubTab === 'upper' ? 'text-blue-400 fill-blue-400' : ''} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (currentLanguage === 'bengali') {
                onSubTabChange(currentSubTab === 'numbers' ? 'all-serial' : 'numbers');
              } else if (currentLanguage === 'arabic') {
                onSubTabChange(currentSubTab === 'numbers' ? 'alphabet' : 'numbers');
              } else if (currentLanguage === 'urdu') {
                onSubTabChange(currentSubTab === 'digits' ? 'alphabet' : 'digits');
              }
            }}
            className={`w-12 sm:w-14 h-12 rounded-lg flex items-center justify-center ${theme.actionKeyBg} ${theme.actionKeyText} border ${theme.keyBorder} active:scale-95 transition-all text-xs font-semibold`}
            title="সংখ্যা ও চিহ্ন"
          >
            <span className="font-sans">?১২৩</span>
          </button>
        )}

        {/* Language Globe Button */}
        <button
          type="button"
          onClick={handleCycleLanguage}
          className={`w-11 sm:w-12 h-12 rounded-lg flex items-center justify-center ${theme.actionKeyBg} ${theme.actionKeyText} border ${theme.keyBorder} active:scale-95 transition-all`}
          title="ভাষা পরিবর্তন করুন"
        >
          <Globe size={19} />
        </button>

        {/* Gboard Center Spacebar with Language Indicator */}
        <button
          type="button"
          onClick={handleSpacePress}
          className={`flex-1 h-12 rounded-lg flex items-center justify-center ${theme.spaceKeyBg} ${theme.spaceKeyText} border ${theme.keyBorder} ${theme.keyShadow} active:scale-[0.98] transition-all`}
        >
          <div className="flex items-center gap-1.5 opacity-80 text-xs sm:text-sm font-medium">
            <span>{currentLangMeta?.flag}</span>
            <span>{currentLangMeta?.nativeName}</span>
            <span className="text-[10px] opacity-60">| স্পেস</span>
          </div>
        </button>

        {/* Backspace Button with long-press repeat */}
        <button
          type="button"
          onPointerDown={startBackspace}
          onPointerUp={stopBackspace}
          onPointerLeave={stopBackspace}
          onPointerCancel={stopBackspace}
          className={`w-12 sm:w-14 h-12 rounded-lg flex items-center justify-center ${theme.actionKeyBg} ${theme.actionKeyText} border ${theme.keyBorder} active:scale-95 transition-all`}
          title="ব্যাকস্পেস (মুছুন)"
        >
          <Delete size={20} />
        </button>

        {/* Enter / Newline Button */}
        <button
          type="button"
          onClick={handleEnterPress}
          className={`w-12 sm:w-14 h-12 rounded-lg flex items-center justify-center ${theme.accentBg} ${theme.accentText} shadow-md active:scale-95 transition-all`}
          title="নতুন লাইন (Enter)"
        >
          <CornerDownLeft size={20} />
        </button>
      </div>
    </div>
  );
};
