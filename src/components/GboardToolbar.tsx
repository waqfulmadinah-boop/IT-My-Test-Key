import React from 'react';
import { 
  Globe, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Settings, 
  Search, 
  Sparkles,
  Download,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { LanguageId, KeyboardSettings } from '../types/keyboard';
import { LANGUAGES } from '../data/keyboardData';
import { ThemeConfig } from '../utils/themeStyles';

interface GboardToolbarProps {
  currentLanguage: LanguageId;
  onLanguageChange: (lang: LanguageId) => void;
  currentSubTab: string;
  onSubTabChange: (tab: string) => void;
  settings: KeyboardSettings;
  onUpdateSettings: (newSettings: Partial<KeyboardSettings>) => void;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
  onClearText: () => void;
  onCopyText: () => void;
  copied: boolean;
  theme: ThemeConfig;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const GboardToolbar: React.FC<GboardToolbarProps> = ({
  currentLanguage,
  onLanguageChange,
  currentSubTab,
  onSubTabChange,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenInstall,
  onClearText,
  onCopyText,
  copied,
  theme,
  searchQuery,
  onSearchChange,
  isInstallable,
  isInstalled,
}) => {
  // Tabs for each language
  const getSubTabs = () => {
    switch (currentLanguage) {
      case 'bengali':
        return [
          { id: 'all-serial', label: '১-৪৯ বর্ণমালা' },
          { id: 'conjuncts', label: 'যুক্ত হরফ (ক্ষ,ত্র..)' },
          { id: 'kars', label: 'কার ও চিহ্ন' },
          { id: 'numbers', label: 'সংখ্যা ও যতি' },
        ];
      case 'arabic':
        return [
          { id: 'alphabet', label: 'الحروف (ا-ي)' },
          { id: 'alif-variants', label: 'আলিফের রূপ (أ,إ,أُ..)' },
          { id: 'tashkeel', label: 'হরকত ও তাশদীদ (َ ِ ُ ْ ّ)' },
          { id: 'honorifics', label: 'ইসলামিক চিহ্ন (ﷺ..)' },
          { id: 'numbers', label: 'الأرقام (١٢٣)' },
        ];
      case 'english':
        return [
          { id: 'lower', label: 'lowercase (a-z)' },
          { id: 'upper', label: 'UPPERCASE (A-Z)' },
          { id: 'symbols', label: '?123 & Symbols' },
        ];
      case 'urdu':
        return [
          { id: 'alphabet', label: 'حروف تہجی (ا-ے)' },
          { id: 'signs', label: 'اعراب و علامات (ؔ ؐ ؕ)' },
          { id: 'digits', label: 'اعداد (۱۲۳)' },
        ];
      default:
        return [];
    }
  };

  const subTabs = getSubTabs();

  return (
    <div className={`w-full ${theme.toolbarBg} border-b select-none flex flex-col transition-colors duration-200`}>
      {/* Top Gboard Utility Strip */}
      <div className="flex items-center justify-between px-2 py-1.5 gap-1.5 border-b border-white/5 overflow-x-auto text-xs">
        {/* Language selector chips */}
        <div className="flex items-center gap-1 shrink-0">
          {LANGUAGES.map((lang) => {
            const isActive = currentLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => onLanguageChange(lang.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? `${theme.accentBg} ${theme.accentText} shadow-sm font-semibold scale-105`
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            );
          })}
        </div>

        {/* Action icons right side */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {/* Quick Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            title={settings.soundEnabled ? 'শব্দ বন্ধ করুন' : 'শব্দ চালু করুন'}
            className={`p-1.5 rounded-md transition-colors ${
              settings.soundEnabled ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {settings.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Copy Button */}
          <button
            onClick={onCopyText}
            title="লেখা কপি করুন"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
          </button>

          {/* Clear text */}
          <button
            onClick={onClearText}
            title="সব মুছুন"
            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <Trash2 size={15} />
          </button>

          {/* Install App Button */}
          {!isInstalled && (
            <button
              onClick={onOpenInstall}
              title="মোবাইল অ্যাপ ইনস্টল করুন"
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-transform active:scale-95 animate-pulse"
            >
              <Download size={13} />
              <span className="hidden sm:inline">ইনস্টল</span>
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="কিবোর্ড সেটিংস ও থিম"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* Sub-category Filter Tabs & Search row */}
      <div className="flex items-center justify-between px-2 py-1 gap-2 overflow-x-auto text-xs bg-black/10">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {subTabs.map((tab) => {
            const isActive = currentSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSubTabChange(tab.id)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600/90 text-white font-medium shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quick Letter Filter / Search */}
        <div className="relative shrink-0 flex items-center ml-auto">
          <Search size={12} className="absolute left-2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="বর্ণ বা যুক্তাক্ষর খুঁজুন..."
            className="pl-6 pr-2 py-1 w-28 sm:w-36 rounded-md bg-white/5 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:w-40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-1.5 text-slate-400 hover:text-slate-200 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
