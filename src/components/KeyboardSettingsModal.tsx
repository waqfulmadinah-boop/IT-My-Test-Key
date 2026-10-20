import React from 'react';
import { 
  X, 
  Volume2, 
  Vibrate, 
  Sparkles, 
  Palette, 
  Maximize2, 
  Type, 
  Eye,
  Check
} from 'lucide-react';
import { KeyboardSettings, KeyboardTheme } from '../types/keyboard';
import { THEMES, ThemeConfig } from '../utils/themeStyles';
import { soundManager } from '../utils/audio';

interface KeyboardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: KeyboardSettings;
  onUpdateSettings: (newSettings: Partial<KeyboardSettings>) => void;
  currentTheme: ThemeConfig;
}

export const KeyboardSettingsModal: React.FC<KeyboardSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentTheme,
}) => {
  if (!isOpen) return null;

  const handleTestSound = () => {
    soundManager.playKeyClick(false);
    if (settings.hapticEnabled) {
      soundManager.vibrate(20);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Palette className="text-blue-400" size={20} />
            <h2 className="text-base font-bold text-white">জি-বোর্ড সেটিংস ও থিম</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Theme Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block">
              কিবোর্ড থিম নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(THEMES) as KeyboardTheme[]).map((themeKey) => {
                const t = THEMES[themeKey];
                const isSelected = settings.theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => onUpdateSettings({ theme: themeKey })}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                        : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs text-white">{t.nameBn}</div>
                      <div className="text-[10px] text-slate-400">{t.name}</div>
                    </div>
                    {isSelected && <Check size={16} className="text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Interactivity */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              টাচ ও সাউন্ড প্রতিক্রিয়া
            </label>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-blue-400" />
                <div>
                  <div className="text-xs font-medium text-white">কি প্রেস শব্দ (Sound)</div>
                  <div className="text-[11px] text-slate-400">অক্ষর চাপার সাথে বাস্তবসম্মত সাউন্ড হবে</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings.soundEnabled && (
                  <button
                    type="button"
                    onClick={handleTestSound}
                    className="text-[10px] px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 hover:bg-blue-600/50"
                  >
                    পরীক্ষা
                  </button>
                )}
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            {/* Haptic Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <Vibrate size={18} className="text-emerald-400" />
                <div>
                  <div className="text-xs font-medium text-white">ভাইব্রেশন / হ্যাপটিক (Vibration)</div>
                  <div className="text-[11px] text-slate-400">মোবাইলে কি স্পর্শে হালকা কম্পন অনুভূত হবে</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticEnabled}
                onChange={(e) => onUpdateSettings({ hapticEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600"
              />
            </div>

            {/* Popup Preview Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-amber-400" />
                <div>
                  <div className="text-xs font-medium text-white">জি-বোর্ড পপ-আপ প্রিভিউ (Popup Preview)</div>
                  <div className="text-[11px] text-slate-400">কি প্রেস করার সময় আঙুলের উপরে বড় অক্ষরের বাবল উঠবে</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.popupPreviewEnabled}
                onChange={(e) => onUpdateSettings({ popupPreviewEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600"
              />
            </div>

            {/* Sublabel toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-purple-400" />
                <div>
                  <div className="text-xs font-medium text-white">বর্ণের পরিচিতি ও ক্রম (Sub-labels)</div>
                  <div className="text-[11px] text-slate-400">অক্ষরের নিচে সিরিয়াল নম্বর বা যুক্ত রূপের বিবরণ দেখাবে</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showSublabels}
                onChange={(e) => onUpdateSettings({ showSublabels: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-700 border-slate-600"
              />
            </div>
          </div>

          {/* Sizing & Layout */}
          <div className="grid grid-cols-2 gap-3">
            {/* Keyboard Height */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                কিবোর্ডের উচ্চতা
              </label>
              <select
                value={settings.keyboardHeight}
                onChange={(e) => onUpdateSettings({ keyboardHeight: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="compact">কমপ্যাক্ট (ছোট)</option>
                <option value="normal">সাধারণ (স্ট্যান্ডার্ড)</option>
                <option value="tall">উঁচু (বড় বোতাম)</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                অক্ষরের মাপ
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="small">ছোট (Small)</option>
                <option value="medium">মাঝারি (Medium)</option>
                <option value="large">বড় (Large)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-colors"
          >
            সম্পন্ন করুন
          </button>
        </div>
      </div>
    </div>
  );
};
