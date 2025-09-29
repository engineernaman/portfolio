import React, { useState, useEffect } from 'react';
import { Palette, Zap, Shield, Code } from 'lucide-react';

interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  icon: React.ComponentType<any>;
}

const themes: Theme[] = [
  {
    name: 'Matrix Green',
    primary: '#00ff41',
    secondary: '#00ffff',
    accent: '#ff0040',
    background: 'from-black via-gray-900 to-black',
    icon: Code
  },
  {
    name: 'Neon Blue',
    primary: '#00ffff',
    secondary: '#0080ff',
    accent: '#ff4080',
    background: 'from-blue-900 via-black to-blue-900',
    icon: Zap
  },
  {
    name: 'Cyber Purple',
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#f59e0b',
    background: 'from-purple-900 via-black to-purple-900',
    icon: Shield
  },
  {
    name: 'Hacker Red',
    primary: '#ff0040',
    secondary: '#ff4080',
    accent: '#00ff41',
    background: 'from-red-900 via-black to-red-900',
    icon: Palette
  }
];

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);

  useEffect(() => {
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-accent', theme.accent);
    
    // Update CSS classes dynamically
    const root = document.documentElement;
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  const switchTheme = (index: number) => {
    setCurrentTheme(index);
    setIsOpen(false);
    
    // Play sound effect if available
    if ((window as any).playTypingSound) {
      (window as any).playTypingSound();
    }
  };

  const CurrentIcon = themes[currentTheme].icon;

  return (
    <div className="fixed top-32 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full border border-cyan-400 bg-black/80 text-cyan-400 hover:bg-cyan-400/20 transition-all duration-300 hover:scale-110"
        title="Switch Theme"
      >
        <CurrentIcon className="w-5 h-5" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black/95 border border-cyan-400/30 rounded-lg p-4 backdrop-blur-sm min-w-[200px]">
          <h3 className="text-cyan-400 font-bold mb-3 text-sm">Cyberpunk Themes</h3>
          <div className="space-y-2">
            {themes.map((theme, index) => {
              const Icon = theme.icon;
              return (
                <button
                  key={index}
                  onClick={() => switchTheme(index)}
                  className={`w-full flex items-center space-x-3 p-2 rounded transition-all duration-300 ${
                    currentTheme === index
                      ? 'bg-cyan-400/20 border border-cyan-400/50'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: theme.primary }} />
                  <span className="text-white text-sm">{theme.name}</span>
                  <div className="flex space-x-1 ml-auto">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.accent }}
                    />
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