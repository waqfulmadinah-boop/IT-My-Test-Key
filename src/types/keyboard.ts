export type LanguageId = 'bengali' | 'arabic' | 'english' | 'urdu';

export interface KeyItem {
  id: string;
  label: string; // Display on key
  insertText: string; // What actually inserts into text
  subLabel?: string; // Small badge or pronunciation/detail
  type?: 'char' | 'action' | 'modifier' | 'space';
  isDiacritic?: boolean; // For combining marks like Tashkeel / Harakat / Kars
  width?: 'normal' | 'wide' | 'extra-wide' | 'fill';
  category?: string;
}

export type KeyboardTheme = 
  | 'gboard-dark' 
  | 'gboard-light' 
  | 'material-blue' 
  | 'emerald' 
  | 'amoled' 
  | 'sunset';

export interface KeyboardSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  popupPreviewEnabled: boolean;
  theme: KeyboardTheme;
  keyboardHeight: 'compact' | 'normal' | 'tall';
  fontSize: 'small' | 'medium' | 'large';
  showSublabels: boolean;
}
