import React, { useRef, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Share2, 
  Volume2, 
  Mic, 
  MicOff,
  Type
} from 'lucide-react';
import { LanguageId } from '../types/keyboard';
import { ThemeConfig } from '../utils/themeStyles';

interface EditorAreaProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  currentLanguage: LanguageId;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onCopy: () => void;
  copied: boolean;
  theme: ThemeConfig;
  activeFont: string;
  setActiveFont: (font: string) => void;
  cursorPosition: number;
  setCursorPosition: (pos: number) => void;
}

export const EditorArea: React.FC<EditorAreaProps> = ({
  text,
  setText,
  currentLanguage,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onCopy,
  copied,
  theme,
  activeFont,
  setActiveFont,
  cursorPosition,
  setCursorPosition,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  // Synchronize cursor position when updated from keyboard buttons
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.selectionStart = cursorPosition;
      textareaRef.current.selectionEnd = cursorPosition;
    }
  }, [cursorPosition]);

  // Is RTL for Arabic or Urdu
  const isRTL = currentLanguage === 'arabic' || currentLanguage === 'urdu';

  // Character and word counts
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Handle manual typing in textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionStart || 0);
  };

  // Text to Speech
  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !text.trim()) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (currentLanguage === 'bengali') utterance.lang = 'bn-BD';
    else if (currentLanguage === 'arabic') utterance.lang = 'ar-SA';
    else if (currentLanguage === 'urdu') utterance.lang = 'ur-PK';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Voice typing (Web Speech API)
  const handleVoiceTyping = () => {
    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('ভয়েস টাইপিং এই ব্রাউজারে সমর্থিত নয়, অনুগ্রহ করে কিবোর্ড দিয়ে লিখুন।');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      if (currentLanguage === 'bengali') recognition.lang = 'bn-BD';
      else if (currentLanguage === 'arabic') recognition.lang = 'ar-SA';
      else if (currentLanguage === 'urdu') recognition.lang = 'ur-PK';
      else recognition.lang = 'en-US';

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        showToast('মাইক্রোফোন সংযোগে সমস্যা হয়েছে বা অনুমতি দেওয়া হয়নি।');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const before = text.slice(0, cursorPosition);
          const after = text.slice(cursorPosition);
          const newText = before + (before.length && !before.endsWith(' ') ? ' ' : '') + transcript + ' ' + after;
          setText(newText);
          setCursorPosition(before.length + transcript.length + 1);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast('ভয়েস টাইপিং চালু করা যায়নি।');
    }
  };

  // Share text
  const handleShare = async () => {
    if (!text.trim()) {
      showToast('শেয়ার করার জন্য আগে কিছু লিখুন!');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gboard বহুভাষিক কিবোর্ড লেখা',
          text: text,
        });
        showToast('সফলভাবে শেয়ার করা হয়েছে!');
      } catch {
        // Ignored or cancelled by user
      }
    } else {
      // Safe fallback: copy to clipboard and notify user
      try {
        await navigator.clipboard.writeText(text);
        showToast('টেক্সট কপি হয়েছে! আপনি যেকোনো মেসেজিং অ্যাপে পেস্ট করতে পারেন।');
      } catch {
        showToast('ক্লিপবোর্ডে কপি করতে নিচের "কপি করুন" বাটন চাপুন।');
      }
    }
  };

  // Download as text file
  const handleDownload = () => {
    if (!text.trim()) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyboard_note_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get active font CSS class
  const getFontFamilyClass = () => {
    if (activeFont === 'bengali') return 'font-bengali';
    if (activeFont === 'arabic') return 'font-arabic text-2xl leading-relaxed';
    if (activeFont === 'urdu') return 'font-urdu text-2xl leading-loose';
    return 'font-english';
  };

  return (
    <div className={`w-full flex flex-col rounded-2xl ${theme.previewCardBg} border shadow-lg overflow-hidden transition-all duration-200`}>
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-black/15 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-300">
            {currentLanguage === 'bengali' && 'বাংলা নোটপ্যাড'}
            {currentLanguage === 'arabic' && 'دفتر النصوص العربي'}
            {currentLanguage === 'urdu' && 'اردو تحریر'}
            {currentLanguage === 'english' && 'English Notepad'}
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
            {charCount} বর্ণ • {wordCount} শব্দ
          </span>
        </div>

        {/* Top editor quick actions */}
        <div className="flex items-center gap-1">
          {/* Font choice dropdown */}
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md">
            <Type size={12} className="text-slate-400" />
            <select
              value={activeFont}
              onChange={(e) => setActiveFont(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="bengali" className="bg-slate-900 text-white">বাংলা ফন্ট</option>
              <option value="arabic" className="bg-slate-900 text-white">العربية (Amiri)</option>
              <option value="urdu" className="bg-slate-900 text-white">اردو (Nastaliq)</option>
              <option value="english" className="bg-slate-900 text-white">Inter (English)</option>
            </select>
          </div>

          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="পূর্বাবস্থায় ফিরুন (Undo)"
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <RotateCcw size={13} />
          </button>

          {/* Redo */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="পুনরায় করুন (Redo)"
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <RotateCw size={13} />
          </button>
        </div>
      </div>

      {/* Real Textarea with Cursor and Direction support */}
      <div className="relative p-3 flex-1 min-h-[140px] max-h-[220px] flex flex-col">
        {toastMessage && (
          <div className="absolute top-2 left-3 right-3 z-30 p-2 rounded-lg bg-blue-600/95 text-white text-xs text-center shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {toastMessage}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onSelect={handleSelect}
          dir={isRTL ? 'rtl' : 'ltr'}
          placeholder={
            currentLanguage === 'bengali'
              ? 'কিবোর্ডের অক্ষর চেপে এখানে লিখুন...'
              : currentLanguage === 'arabic'
              ? 'اكتب هنا باستخدام لوحة المفاتيح...'
              : currentLanguage === 'urdu'
              ? 'یہاں کی بورڈ کے ذریعے لکھیے...'
              : 'Tap keyboard keys below to type here...'
          }
          className={`w-full h-full flex-1 bg-transparent border-0 resize-none focus:outline-none ${getFontFamilyClass()} text-lg sm:text-xl text-slate-100 placeholder:text-slate-500 overflow-y-auto leading-relaxed`}
        />
      </div>

      {/* Editor Footer Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 bg-black/10 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={onCopy}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white/10 hover:bg-white/15 text-slate-200'
            }`}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition-all"
          >
            <Share2 size={13} />
            <span>শেয়ার</span>
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs transition-all"
            title="নোট ডাউনলোড করুন"
          >
            <Download size={13} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Voice Typing */}
          <button
            onClick={handleVoiceTyping}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-white/10 hover:bg-white/15 text-slate-300'
            }`}
            title="ভয়েস টাইপিং"
          >
            {isListening ? <MicOff size={13} /> : <Mic size={13} />}
            <span>{isListening ? 'শুনছি...' : 'ভয়েস'}</span>
          </button>

          {/* Text to Speech */}
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isSpeaking
                ? 'bg-blue-600 text-white animate-pulse'
                : 'bg-white/10 hover:bg-white/15 text-slate-300'
            }`}
            title="উচ্চারণ শুনুন"
          >
            <Volume2 size={13} />
            <span>{isSpeaking ? 'চলছে' : 'পড়ুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
