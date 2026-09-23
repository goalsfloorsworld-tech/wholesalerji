'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Palette, Check } from 'lucide-react';

const emptySubscribe = () => () => {};

// Small utility to lighten or darken a hex color
function adjustColor(hex: string, factor: number) {
  if (!hex || !hex.startsWith('#')) return hex;
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  if (factor > 0) {
    r = Math.min(255, r + (255 - r) * factor);
    g = Math.min(255, g + (255 - g) * factor);
    b = Math.min(255, b + (255 - b) * factor);
  } else {
    r = Math.max(0, r + r * factor);
    g = Math.max(0, g + g * factor);
    b = Math.max(0, b + b * factor);
  }

  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function applyCustomTheme(hex: string) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-amber-500', hex);
  root.style.setProperty('--color-amber-400', adjustColor(hex, 0.15));
  root.style.setProperty('--color-amber-300', adjustColor(hex, 0.30));
  root.style.setProperty('--color-amber-600', adjustColor(hex, -0.15));
  root.style.setProperty('--color-amber-700', adjustColor(hex, -0.30));
  window.dispatchEvent(new CustomEvent('theme-color-changed', { detail: hex }));
}

export function removeCustomTheme() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.removeProperty('--color-amber-500');
  root.style.removeProperty('--color-amber-400');
  root.style.removeProperty('--color-amber-300');
  root.style.removeProperty('--color-amber-600');
  root.style.removeProperty('--color-amber-700');
  window.dispatchEvent(new CustomEvent('theme-color-changed', { detail: '#F5AB40' }));
}

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#F5AB40');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const PRESET_COLORS = ['#F5AB40', '#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6'];

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const savedColor = localStorage.getItem('custom-theme-color');
    if (savedColor) {
      setCustomColor(savedColor);
      applyCustomTheme(savedColor); // Re-apply strictly on mount just in case
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-stone-200/60 dark:bg-stone-900/60 border border-stone-300 dark:border-stone-800" />
    );
  }

  const isDark = resolvedTheme === 'dark' || theme === 'dark';

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      localStorage.setItem('custom-theme-color', newColor);
      applyCustomTheme(newColor);
    }, 500);
  };

  const setPresetColor = (color: string) => {
    setCustomColor(color);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    localStorage.setItem('custom-theme-color', color);
    applyCustomTheme(color);
  };

  const handleResetColor = () => {
    setCustomColor('#F5AB40');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    localStorage.removeItem('custom-theme-color');
    removeCustomTheme();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-700 dark:text-amber-400 hover:text-stone-950 dark:hover:text-amber-300 transition-colors shadow-sm focus:outline-none"
        aria-label="Theme Options"
        title="Theme Options"
      >
        {isDark ? (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-amber-500" />
        ) : (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100 text-stone-800" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 space-y-1">
            <button
              onClick={() => { setTheme('light'); setIsOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${!isDark ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4" />
                Light Mode
              </div>
              {!isDark && <Check className="w-4 h-4" />}
            </button>

            <button
              onClick={() => { setTheme('dark'); setIsOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isDark ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4" />
                Dark Mode
              </div>
              {isDark && <Check className="w-4 h-4" />}
            </button>
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800 p-3 bg-stone-50 dark:bg-[#151515]">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center justify-between gap-1.5 mb-0.5">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  Theme Accent
                </span>
                <button
                  onClick={handleResetColor}
                  className="text-[10px] uppercase font-bold text-stone-400 hover:text-amber-500 transition-colors"
                >
                  Reset
                </button>
              </label>
              
              <div className="flex items-center justify-between gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setPresetColor(color)}
                    className="w-6 h-6 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm transition-transform hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 dark:focus:ring-offset-stone-900"
                    style={{ backgroundColor: color }}
                    aria-label={`Set theme to ${color}`}
                  >
                    {customColor.toLowerCase() === color.toLowerCase() && (
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative w-full h-10 rounded-lg overflow-hidden border border-stone-300 dark:border-stone-700 shadow-inner group mt-1">
                <input 
                  type="color" 
                  value={customColor}
                  onChange={handleColorChange}
                  className="absolute -top-4 -left-4 w-32 h-32 cursor-pointer opacity-0"
                  title="Pick a custom hex color"
                />
                <div 
                  className="absolute inset-0 pointer-events-none transition-colors duration-200"
                  style={{ backgroundColor: customColor }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-stone-950/40 text-white px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur-[2px] shadow-sm">
                    {customColor}
                  </span>
                </div>
              </div>
              
              <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight text-center">
                Select an accent color. Buttons, gradients, and glows will update automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
