import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface PhoneConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneConnectModal: React.FC<PhoneConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Link for the phone to access
  const phoneAppUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') 
        ? 'https://ais-dev-mosl7ap7x554kgd3m5hlxo-807612499389.asia-southeast1.run.app'
        : window.location.origin)
    : 'https://ais-dev-mosl7ap7x554kgd3m5hlxo-807612499389.asia-southeast1.run.app';

  useEffect(() => {
    if (isOpen && phoneAppUrl) {
      QRCode.toDataURL(phoneAppUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [isOpen, phoneAppUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow">
              <QrCode size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">মোবাইল টেস্টিং লিংক ও QR কোড</h2>
              <p className="text-[11px] text-slate-400">ফোনের ক্যামেরা দিয়ে স্ক্যান করে সরাসরি টেস্ট করুন</p>
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
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="Phone Test QR Code" 
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-500 text-xs">
                  QR কোড লোড হচ্ছে...
                </div>
              )}
            </div>
            <p className="text-slate-400 text-[11px] mt-2.5 text-center flex items-center gap-1.5 font-medium">
              <Smartphone size={13} className="text-blue-400" />
              <span>মোবাইল ক্যামেরা দিয়ে উপরের কোডটি স্ক্যান করুন</span>
            </p>
          </div>

          {/* Copyable Link Box */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300">মোবাইল টেস্ট লিংক:</span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
              </button>
            </div>
            <div className="p-2 rounded-lg bg-black/40 text-[11px] font-mono text-blue-300 break-all select-all border border-white/5">
              {phoneAppUrl}
            </div>
          </div>

          {/* Tips for phone access */}
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2 text-[11px] text-blue-200">
            <div className="flex items-center gap-1.5 font-semibold text-blue-300 text-xs">
              <ShieldCheck size={14} className="text-blue-400" />
              <span>ফোনে খোলার সহজ টিপস:</span>
            </div>
            <p>
              ১. ফোনের ক্রোম (Chrome) বা ক্যামেরা দিয়ে লিংকে প্রবেশ করুন।
            </p>
            <p>
              ২. গুগল লগইন চাইলে আপনার অ্যাকাউন্ট <strong>(waqfulmadinah@gmail.com)</strong> দিয়ে প্রবেশ করলেই সরাসরি কিবোর্ডটি লোড হবে।
            </p>
            <p>
              ৩. এরপর ফোনের ব্রাউজারের ৩-ডট মেনু থেকে <strong>"Add to Home screen"</strong> চাপলেই এটি ফোনে অ্যাপ হিসেবে সেভ হয়ে যাবে।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <a
            href={phoneAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
          >
            <span>নতুন ট্যাবে খুলুন</span>
            <ExternalLink size={12} />
          </a>
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
