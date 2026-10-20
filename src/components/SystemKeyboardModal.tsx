import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Code2, 
  Download, 
  Check, 
  Copy, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  FileCode
} from 'lucide-react';

interface SystemKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemKeyboardModal: React.FC<SystemKeyboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'manifest' | 'service'>('explanation');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.waqfulmadinah.gboardmulti">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="জি-বোর্ড বহুভাষিক কিবোর্ড"
        android:theme="@style/Theme.AppCompat.NoActionBar">

        <!-- Android Input Method Service (IME) -->
        <service
            android:name=".GboardMultiIME"
            android:label="জি-বোর্ড বহুভাষিক (বাংলা, আরবি, ইংরেজি, উর্দু)"
            android:permission="android.permission.BIND_INPUT_METHOD"
            android:exported="true">
            <intent-filter>
                <action android:name="android.view.InputMethod" />
            </intent-filter>
            <meta-data
                android:name="android.view.im"
                android:resource="@xml/method" />
        </service>

        <!-- Settings / Standalone Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const serviceCode = `package com.waqfulmadinah.gboardmulti

import android.inputmethodservice.InputMethodService
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface

class GboardMultiIME : InputMethodService() {
    private var webView: WebView? = null

    override fun onCreateInputView(): View {
        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            addJavascriptInterface(WebAppInterface(), "AndroidIME")
            // Loads the optimized local HTML/JS keyboard bundle
            loadUrl("file:///android_asset/keyboard/index.html")
        }
        return webView!!
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun commitText(text: String) {
            currentInputConnection?.commitText(text, 1)
        }

        @JavascriptInterface
        fun deleteBackward() {
            currentInputConnection?.deleteSurroundingText(1, 0)
        }
    }
}`;

  const currentCode = activeTab === 'manifest' ? manifestCode : serviceCode;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Ignored
    }
  };

  const downloadAndroidProjectZip = () => {
    const projectSummary = `জি-বোর্ড বহুভাষিক কিবোর্ড (Android IME Project Bundle)
৪টি ভাষা: বাংলা (৪৯ বর্ণ ও যুক্তাক্ষর), আরবি (আলিফের রূপ ও হরকত), ইংরেজি (Upper/Lower), উর্দু
প্যাকেজ: com.waqfulmadinah.gboardmulti

=== AndroidManifest.xml ===
${manifestCode}

=== GboardMultiIME.kt ===
${serviceCode}
`;
    const blob = new Blob([projectSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GboardMulti_Android_IME_Source.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow">
              <Smartphone size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">সিস্টেম কিবোর্ড (System IME APK) গাইড</h2>
              <p className="text-[11px] text-slate-400">ফোনের সকল অ্যাপের ভেতর কিবোর্ড ব্যবহারের তথ্য</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'explanation'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            মোবাইল অ্যাপ বনাম সিস্টেম কীবোর্ড
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'manifest'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AndroidManifest.xml
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'service'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kotlin IME Service
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {activeTab === 'explanation' ? (
            <div className="space-y-4">
              {/* Highlight Card */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs">
                  <Sparkles size={15} />
                  <span>গুরুত্বপূর্ণ তথ্য (Android System Keyboard):</span>
                </div>
                <p className="text-[12px] text-slate-200 leading-relaxed">
                  অ্যান্ড্রয়েড বা আইফোনের নিজস্ব নিরাপত্তা ব্যবস্থার কারণে কোনো ব্রাউজার লিংক বা ওয়েব অ্যাপ্লিকেশন সরাসরি সিস্টেমের ভেতর (যেমন: <strong>WhatsApp, Facebook, SMS</strong>-এ) ডিফল্ট সিস্টেম কিবোর্ড হিসেবে রেজিস্টার হতে পারে না। 
                  এর জন্য দুটি বাস্তবসম্মত উপায় রয়েছে:
                </p>
              </div>

              {/* Way 1: Standalone PWA / Quick Typer App */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">১</div>
                  <span>উপায় ১: স্বাধীন মোবাইল অ্যাপ (PWA Standalone)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  আমরা কিবোর্ডটিকে এখন এমনভাবে সাজিয়েছি যাতে এটি ফোনে খুললে কোনো ফ্রেম ছাড়াই <strong>পুরো মোবাইল স্ক্রিনের নিচে হুবহু আসল জি-বোর্ডের মতো ডক হয়ে থাকবে</strong>। আপনি এখানে বাংলা (৪৯ বর্ণ ও যুক্তাক্ষর), আরবি, উর্দু বা ইংরেজি টাইপ করে এক ট্যাপে কপি বা হোয়াটসঅ্যাপে শেয়ার করতে পারবেন।
                </p>
              </div>

              {/* Way 2: Android Native APK (InputMethodService) */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">২</div>
                  <span>উপায় ২: আসল সিস্টেম কিবোর্ড হিসেবে ইনস্টল (Android IME APK)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  আপনি যদি চান এই কিবোর্ডটি ফোনের সেটিংসে <strong>"Default Keyboard"</strong> হিসেবে দেখা যাবে এবং সব অ্যাপের ভেতর নিচ থেকে উঠে আসবে—তার জন্য প্রস্তুত <strong>Android InputMethodService</strong> কোড আমরা তৈরি করে দিয়েছি (পাশের ট্যাবে দেখুন)। এটি দিয়ে বিনামূল্যে Android Studio অথবা PhoneGap/Capacitor দিয়ে সরাসরি <code>.apk</code> তৈরি করে ফোনে ইনস্টল করা যাবে।
                </p>
                <button
                  onClick={downloadAndroidProjectZip}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs mt-2 transition-colors"
                >
                  <Download size={13} />
                  <span>অ্যান্ড্রয়েড কিবোর্ড সোর্স ফাইল ডাউনলোড (.txt)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">
                  {activeTab === 'manifest' ? 'AndroidManifest.xml' : 'GboardMultiIME.kt'}
                </span>
                <button
                  onClick={handleCopyCode}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    copiedCode ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-200'
                  }`}
                >
                  {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedCode ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-black/60 border border-slate-800 font-mono text-[10px] sm:text-[11px] text-blue-300 overflow-x-auto max-h-[300px] leading-relaxed">
                <code>{currentCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
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
