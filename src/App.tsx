import React, { useState, useEffect, useCallback } from 'react';
import { 
  Smartphone, 
  Maximize2, 
  Download, 
  Settings, 
  Palette, 
  Sparkles, 
  Layers,
  Keyboard as KeyboardIcon,
  HelpCircle,
  CheckCircle2,
  Share2,
  QrCode,
  Code2
} from 'lucide-react';
import { LanguageId, KeyboardSettings, KeyboardTheme } from './types/keyboard';
import { THEMES } from './utils/themeStyles';
import { GboardToolbar } from './components/GboardToolbar';
import { GboardKeyboard } from './components/GboardKeyboard';
import { EditorArea } from './components/EditorArea';
import { KeyboardSettingsModal } from './components/KeyboardSettingsModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { PhoneConnectModal } from './components/PhoneConnectModal';
import { SystemKeyboardModal } from './components/SystemKeyboardModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  LANGUAGE_SUBTYPES,
  getImeBridge,
  isNativeIme,
  languageFromSubtype,
} from './utils/nativeIme';

const DEFAULT_SETTINGS: KeyboardSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  popupPreviewEnabled: true,
  theme: 'gboard-dark',
  keyboardHeight: 'normal',
  fontSize: 'medium',
  showSublabels: true,
};

export default function App() {
  const [text, setText] = useState<string>('স্বাগতম! এটি একটি পূর্ণাঙ্গ বহুভাষিক জি-বোর্ড কিবোর্ড।');
  const [history, setHistory] = useState<string[]>(['স্বাগতম! এটি একটি পূর্ণাঙ্গ বহুভাষিক জি-বোর্ড কিবোর্ড।']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<number>(text.length);

  const [currentLanguage, setCurrentLanguage] = useState<LanguageId>('bengali');
  const [currentSubTab, setCurrentSubTab] = useState<string>('all-serial');
  const [activeFont, setActiveFont] = useState<string>('bengali');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // When running inside the Android IME WebView, keys must be sent to the
  // native input connection instead of the local notepad.
  const [isImeMode] = useState<boolean>(() => isNativeIme());

  // Auto-detect mobile devices so we NEVER show a fake phone frame on real phones
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [viewMode, setViewMode] = useState<'fullscreen' | 'simulator'>('fullscreen');

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
      if (isMobile) {
        setViewMode('fullscreen');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [settings, setSettings] = useState<KeyboardSettings>(() => {
    try {
      const saved = localStorage.getItem('gboard_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isPhoneConnectOpen, setIsPhoneConnectOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gboard_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // When language switches, auto-sync font and default subTab
  const handleLanguageChange = (newLang: LanguageId) => {
    setCurrentLanguage(newLang);
    setSearchQuery('');
    if (newLang === 'bengali') {
      setCurrentSubTab('all-serial');
      setActiveFont('bengali');
    } else if (newLang === 'arabic') {
      setCurrentSubTab('alphabet');
      setActiveFont('arabic');
    } else if (newLang === 'english') {
      setCurrentSubTab('lower');
      setActiveFont('english');
    } else if (newLang === 'urdu') {
      setCurrentSubTab('alphabet');
      setActiveFont('urdu');
    }
    getImeBridge()?.setLanguage?.(LANGUAGE_SUBTYPES[newLang]);
  };

  // Expose a native -> JS handler so the Android IME service can tell us
  // which keyboard subtype (bn-BD / ar / ur / en-US) is currently active.
  useEffect(() => {
    if (!isImeMode) return;
    window.__gboardIme = {
      onStartInput: (subtype?: string) => {
        const lang = languageFromSubtype(subtype);
        if (lang) handleLanguageChange(lang);
      },
      onFinishInput: () => {
        setIsSettingsOpen(false);
        setIsInstallOpen(false);
      },
      onSelectionChanged: () => {
        // Native owns the input connection while inside the IME WebView.
      },
      setLanguage: (subtype?: string) => {
        const lang = languageFromSubtype(subtype);
        if (lang) handleLanguageChange(lang);
      },
    };
    getImeBridge()?.notifyReady?.();
    return () => {
      window.__gboardIme = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImeMode]);

  // Push new state to history for undo/redo
  const pushToHistory = useCallback((newText: string) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newText];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Key press handler (insert at cursor position)
  const handleKeyPress = (char: string) => {
    const bridge = getImeBridge();
    if (isImeMode && bridge) {
      bridge.commitText?.(char);
      return;
    }
    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const newText = before + char + after;
    setText(newText);
    const newCursor = cursorPosition + char.length;
    setCursorPosition(newCursor);
    pushToHistory(newText);
  };

  // Backspace handler
  const handleBackspace = () => {
    const bridge = getImeBridge();
    if (isImeMode && bridge) {
      bridge.deleteBackward?.();
      return;
    }
    if (cursorPosition === 0) return;
    const before = text.slice(0, cursorPosition - 1);
    const after = text.slice(cursorPosition);
    const newText = before + after;
    setText(newText);
    setCursorPosition(cursorPosition - 1);
    pushToHistory(newText);
  };

  // Space handler
  const handleSpace = () => {
    handleKeyPress(' ');
  };

  // Enter handler
  const handleEnter = () => {
    const bridge = getImeBridge();
    if (isImeMode && bridge) {
      bridge.sendEnter?.();
      return;
    }
    handleKeyPress('\n');
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      setHistoryIndex(targetIndex);
      setText(history[targetIndex]);
      setCursorPosition(history[targetIndex].length);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setText(history[targetIndex]);
      setCursorPosition(history[targetIndex].length);
    }
  };

  // Clear text
  const handleClearText = () => {
    if (!text) return;
    setText('');
    setCursorPosition(0);
    pushToHistory('');
  };

  // Copy text to clipboard
  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleUpdateSettings = (newSettings: Partial<KeyboardSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const currentThemeConfig = THEMES[settings.theme] || THEMES['gboard-dark'];

  // Native Android IME mode: render only the keyboard surface, docked to the bottom.
  if (isImeMode) {
    return (
      <div className="w-full h-[100dvh] overflow-hidden flex flex-col justify-end select-none bg-slate-950">
        <GboardKeyboard
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          currentSubTab={currentSubTab}
          onSubTabChange={setCurrentSubTab}
          settings={settings}
          theme={currentThemeConfig}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          onSpace={handleSpace}
          searchQuery=""
          imeMode
        />
      </div>
    );
  }

  return (
    <div className={`w-full ${isMobileDevice ? 'h-[100dvh]' : 'min-h-screen'} bg-slate-950 text-slate-100 flex flex-col items-center justify-between select-none overflow-hidden`}>
      {/* Top Application Header */}
      <header className={`w-full ${isMobileDevice ? 'px-2 py-1.5 border-b' : 'max-w-4xl mt-2 px-3 py-2 rounded-2xl border'} flex items-center justify-between bg-slate-900/90 border-slate-800 shadow-md shrink-0 z-20`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <KeyboardIcon size={18} />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[140px] sm:max-w-none">
              জি-বোর্ড বহুভাষিক
            </h1>
            <p className="text-[9px] sm:text-[10px] text-slate-400">
              বাংলা • عربي • English • اردو
            </p>
          </div>
        </div>

        {/* Action icons & toggles */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Simulator vs Fullscreen toggle (only on desktop) */}
          {!isMobileDevice && (
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('fullscreen')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'fullscreen'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 size={12} />
                <span>ফুলস্ক্রিন</span>
              </button>
              <button
                onClick={() => setViewMode('simulator')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'simulator'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone size={12} />
                <span>সিমুলেটর</span>
              </button>
            </div>
          )}

          {/* System Keyboard / Android IME Guide */}
          <button
            onClick={() => setIsSystemModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="সিস্টেম কিবোর্ড হিসেবে ইনস্টল নির্দেশিকা"
          >
            <Code2 size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">সিস্টেম কিবোর্ড (APK)</span>
          </button>

          {/* Phone Link & QR button */}
          <button
            onClick={() => setIsPhoneConnectOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95"
            title="মোবাইল লিংক ও QR কোড"
          >
            <QrCode size={13} />
            <span className="hidden sm:inline">QR কোড</span>
          </button>

          {/* Install Button */}
          {!isInstalled && (
            <button
              onClick={() => setIsInstallOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-all active:scale-95"
              title="অ্যাপ ইনস্টল"
            >
              <Download size={13} />
              <span className="hidden sm:inline">ইনস্টল</span>
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="সেটিংস ও থিম"
          >
            <Settings size={15} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`w-full flex-1 flex flex-col justify-between overflow-hidden ${isMobileDevice ? 'p-0' : 'max-w-4xl p-2'}`}>
        {viewMode === 'simulator' && !isMobileDevice ? (
          /* Desktop Phone Simulator Mockup */
          <div className="w-full flex-1 flex items-center justify-center py-2">
            <div className="relative w-full max-w-[400px] rounded-[44px] bg-slate-900 p-3 shadow-2xl border-[6px] border-slate-800 flex flex-col h-[680px]">
              {/* Phone Dynamic Island */}
              <div className="w-full flex items-center justify-between px-6 pt-1 pb-2 shrink-0">
                <span className="text-[11px] font-semibold text-slate-400">12:30</span>
                <div className="w-16 h-3.5 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
                </div>
                <span className="text-slate-400 text-[10px]">98%</span>
              </div>

              {/* Inside simulator */}
              <div className="rounded-[30px] overflow-hidden flex flex-col bg-slate-950 flex-1 border border-slate-800/60 shadow-inner justify-between">
                <div className="p-2 flex-1 overflow-y-auto">
                  <EditorArea
                    text={text}
                    setText={setText}
                    currentLanguage={currentLanguage}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={historyIndex > 0}
                    canRedo={historyIndex < history.length - 1}
                    onCopy={handleCopyText}
                    copied={copied}
                    theme={currentThemeConfig}
                    activeFont={activeFont}
                    setActiveFont={setActiveFont}
                    cursorPosition={cursorPosition}
                    setCursorPosition={setCursorPosition}
                  />
                </div>

                <div className="shrink-0 flex flex-col">
                  <GboardToolbar
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                    currentSubTab={currentSubTab}
                    onSubTabChange={setCurrentSubTab}
                    settings={settings}
                    onUpdateSettings={handleUpdateSettings}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onOpenInstall={() => setIsInstallOpen(true)}
                    onClearText={handleClearText}
                    onCopyText={handleCopyText}
                    copied={copied}
                    theme={currentThemeConfig}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isInstallable={isInstallable}
                    isInstalled={isInstalled}
                  />

                  <GboardKeyboard
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                    currentSubTab={currentSubTab}
                    onSubTabChange={setCurrentSubTab}
                    settings={settings}
                    theme={currentThemeConfig}
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onEnter={handleEnter}
                    onSpace={handleSpace}
                    searchQuery={searchQuery}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Native Fullscreen Mobile Keyboard App (Clean, responsive, docked at bottom) */
          <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
            {/* Top Editor Notepad Area */}
            <div className={`flex-1 overflow-y-auto ${isMobileDevice ? 'p-1.5' : 'p-2'}`}>
              <EditorArea
                text={text}
                setText={setText}
                currentLanguage={currentLanguage}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onCopy={handleCopyText}
                copied={copied}
                theme={currentThemeConfig}
                activeFont={activeFont}
                setActiveFont={setActiveFont}
                cursorPosition={cursorPosition}
                setCursorPosition={setCursorPosition}
              />
            </div>

            {/* Bottom Docked Gboard Toolbar & Keyboard */}
            <div className="shrink-0 w-full flex flex-col z-10 shadow-2xl">
              <GboardToolbar
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                currentSubTab={currentSubTab}
                onSubTabChange={setCurrentSubTab}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenInstall={() => setIsInstallOpen(true)}
                onClearText={handleClearText}
                onCopyText={handleCopyText}
                copied={copied}
                theme={currentThemeConfig}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isInstallable={isInstallable}
                isInstalled={isInstalled}
              />

              <GboardKeyboard
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                currentSubTab={currentSubTab}
                onSubTabChange={setCurrentSubTab}
                settings={settings}
                theme={currentThemeConfig}
                onKeyPress={handleKeyPress}
                onBackspace={handleBackspace}
                onEnter={handleEnter}
                onSpace={handleSpace}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <KeyboardSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        currentTheme={currentThemeConfig}
      />

      <PWAInstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onInstall={install}
        onSwitchToFullscreen={() => setViewMode('fullscreen')}
      />

      <PhoneConnectModal
        isOpen={isPhoneConnectOpen}
        onClose={() => setIsPhoneConnectOpen(false)}
      />

      <SystemKeyboardModal
        isOpen={isSystemModalOpen}
        onClose={() => setIsSystemModalOpen(false)}
      />
    </div>
  );
}
