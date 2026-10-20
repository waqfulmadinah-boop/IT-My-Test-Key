import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  WifiOff, 
  Zap, 
  CheckCircle2, 
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Info
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
  onSwitchToFullscreen?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  onInstall,
  onSwitchToFullscreen,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    try {
      const success = await onInstall();
      if (success) {
        onClose();
      }
    } catch {
      // Ignored
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow">
              <Smartphone size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">মোবাইল অ্যাপ ইনস্টল ও টেস্ট</h2>
              <p className="text-[11px] text-slate-400">PWA ইনস্টল ও ব্যবহারের পদ্ধতি</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Important Notice about Studio Preview */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2.5">
            <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>টেস্টিং টিপস:</strong> আপনি সরাসরি এই প্রিভিউ স্ক্রিনেই কিবোর্ডের সব বোতাম চেপে সব ভাষা টেস্ট করতে পারেন! ব্রাউজারের ভেতর থাকায় কোনো অতিরিক্ত ইনস্টল ছাড়াই এটি এখনই ১০০% কার্যকর।
            </div>
          </div>

          {/* Quick Simulation / Fullscreen Button */}
          {onSwitchToFullscreen && (
            <button
              onClick={() => {
                onSwitchToFullscreen();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all active:scale-98"
            >
              <Maximize2 size={15} />
              <span>ফুলস্ক্রিন মোবাইল ভিউ চালু করুন</span>
            </button>
          )}

          {/* App Card Showcase */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-gradient-to-r from-blue-900/30 to-slate-800/60 border border-blue-500/20">
            <img 
              src="/icon.svg" 
              alt="GBoard Icon" 
              className="w-12 h-12 rounded-xl shadow-md border border-white/10" 
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">জি-বোর্ড বহুভাষিক কিবোর্ড</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">বাংলা • العربية • English • اردو</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <Zap size={10} /> অতি দ্রুত
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                  <WifiOff size={10} /> অফলাইনেও সচল
                </span>
              </div>
            </div>
          </div>

          {/* Direct Install Button if supported by browser */}
          {isInstallable && !isInstalled && (
            <div className="space-y-1.5">
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-98"
              >
                <Download size={16} />
                <span>সরাসরি মোবাইলে ইনস্টল করুন (Install App)</span>
              </button>
              <p className="text-[10px] text-center text-slate-400">
                এক ক্লিকে আপনার ফোনের হোম স্ক্রিনে অ্যাপ আইকন তৈরি হয়ে যাবে।
              </p>
            </div>
          )}

          {/* Mobile Chrome Instructions */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
              <span>অ্যান্ড্রয়েড ফোনে হোমস্ক্রিনে অ্যাপ তৈরির নিয়ম:</span>
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <p>১. ফোনের গুগল ক্রোম (Chrome) ব্রাউজারের উপরের ৩টি ডট (Menu ⋮) এ চাপুন।</p>
              <p>২. <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> এ চাপুন।</p>
              <p>৩. নিশ্চিত করলে আপনার ফোনের অ্যাপ তালিকায় কিবোর্ডটি চলে আসবে!</p>
            </div>
          </div>

          {/* iOS Safari Instructions */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5 text-xs">
              <span>আইফোন / আইপ্যাডে (iOS Safari) নিয়ম:</span>
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <p>১. সাফারির নিচে <Share size={12} className="inline text-blue-400 mx-1" /> <strong>Share</strong> চাপুন।</p>
              <p>২. নিচে স্ক্রোল করে <PlusSquare size={12} className="inline text-emerald-400 mx-1" /> <strong>Add to Home Screen</strong> চাপুন।</p>
              <p>৩. ডানে <strong>Add</strong> চাপলেই হোমস্ক্রিনে অ্যাপ যুক্ত হবে।</p>
            </div>
          </div>

          {/* Copy link to open in mobile browser */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400">ফোনের ব্রাউজারে খুলতে লিংক কপি করুন:</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition-all"
            >
              {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedLink ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
