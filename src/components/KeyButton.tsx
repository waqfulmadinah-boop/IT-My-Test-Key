import React, { useState } from 'react';
import { KeyItem, KeyboardSettings } from '../types/keyboard';
import { soundManager } from '../utils/audio';

interface KeyButtonProps {
  item: KeyItem;
  onPress: (text: string) => void;
  settings: KeyboardSettings;
  customClass?: string;
  themeClasses: {
    keyBg: string;
    keyText: string;
    keyBorder: string;
    keyActive: string;
    keyShadow: string;
    popupBg: string;
    popupText: string;
  };
}

export const KeyButton: React.FC<KeyButtonProps> = ({
  item,
  onPress,
  settings,
  customClass = '',
  themeClasses,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(true);

    if (settings.soundEnabled) {
      soundManager.playKeyClick(item.type === 'action' || item.type === 'space');
    }
    if (settings.hapticEnabled) {
      soundManager.vibrate(14);
    }

    onPress(item.insertText);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
  };

  const isSpecialKey = item.type === 'action' || item.type === 'modifier' || item.type === 'space';

  // Height based on keyboard height setting
  const heightClass = 
    settings.keyboardHeight === 'compact' ? 'h-10 min-h-[40px]' :
    settings.keyboardHeight === 'tall' ? 'h-14 min-h-[56px]' :
    'h-12 min-h-[48px]';

  // Font size
  const fontClass = 
    settings.fontSize === 'small' ? 'text-base' :
    settings.fontSize === 'large' ? 'text-2xl font-bold' :
    'text-xl font-medium';

  return (
    <div className="relative inline-flex flex-1 justify-center items-center">
      {/* Gboard Magnified Key Popup Preview */}
      {isPressed && settings.popupPreviewEnabled && !isSpecialKey && (
        <div
          className={`absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center justify-center min-w-[56px] h-14 px-3 rounded-2xl ${themeClasses.popupBg} ${themeClasses.popupText} shadow-2xl border border-white/20 animate-in fade-in zoom-in-90 duration-75`}
        >
          <span className="text-2xl font-bold leading-none">{item.label}</span>
          {item.subLabel && (
            <span className="text-[10px] opacity-80 mt-0.5 truncate max-w-[70px]">
              {item.subLabel}
            </span>
          )}
          {/* Downward triangle pointer */}
          <div
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${themeClasses.popupBg} border-r border-b border-white/20`}
          />
        </div>
      )}

      {/* Actual Key Cap */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        className={`w-full ${heightClass} ${customClass} ${themeClasses.keyBg} ${themeClasses.keyText} ${themeClasses.keyBorder} ${themeClasses.keyShadow} rounded-lg flex flex-col items-center justify-center transition-all duration-75 select-none active:scale-[0.96] border shadow-sm ${
          isPressed ? themeClasses.keyActive : ''
        }`}
      >
        <span className={`${fontClass} leading-none tracking-normal`}>
          {item.label}
        </span>
        {settings.showSublabels && item.subLabel && !isSpecialKey && (
          <span className="text-[9px] opacity-65 leading-none mt-0.5 scale-90 max-w-[95%] truncate">
            {item.subLabel}
          </span>
        )}
      </button>
    </div>
  );
};
