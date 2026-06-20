import React, { useState, useEffect } from 'react';
import { Palette, Zap, Shield, Code } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
}

const themes: Theme[] = [
  {
    name: 'Matrix Green',
    primary: '#34d399',
    secondary: '#22d3ee',
    accent: '#ff0040',
    icon: Code,
  },
  {
    name: 'Neon Cyan',
    primary: '#22d3ee',
    secondary: '#34d399',
    accent: '#f59e0b',
    icon: Zap,
  },
  {
    name: 'Cyber Purple',
    primary: '#8b5cf6',
    secondary: '#22d3ee',
    accent: '#34d399',
    icon: Shield,
  },
  {
    name: 'Alert Red',
    primary: '#ff0040',
    secondary: '#ff4080',
    accent: '#34d399',
    icon: Palette,
  },
];

const ThemeSwitcher = () => {
  const { playTypingSound } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);

  useEffect(() => {
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-accent', theme.accent);

    const root = document.documentElement;
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [isOpen]);

  const switchTheme = (index: number) => {
    setCurrentTheme(index);
    setIsOpen(false);
    playTypingSound();
  };

  const CurrentIcon = themes[currentTheme].icon;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg border border-white/10 bg-black/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors"
        aria-label="Switch color theme"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 z-[100] bg-[#0a0e14]/98 border border-emerald-500/20 rounded-xl p-3 backdrop-blur-md min-w-[220px] shadow-xl shadow-black/50"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-emerald-400 font-mono text-[10px] tracking-wider uppercase mb-2">
            Cyber Themes
          </h3>
          <div className="space-y-1">
            {themes.map((theme, index) => {
              const Icon = theme.icon;
              return (
                <button
                  key={index}
                  onClick={() => switchTheme(index)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    currentTheme === index
                      ? 'bg-emerald-500/15 border border-emerald-500/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
                  <span className="text-white text-xs font-mono">{theme.name}</span>
                  <div className="flex gap-1 ml-auto shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.secondary }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
