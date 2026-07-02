/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#010208',
        surface: '#0a0f14',
        slate: '#e2e8f0',
        readable: '#f8fafc',
        'readable-muted': '#cbd5e1',
        'readable-dim': '#94a3b8',
        mist: '#94a3b8',
        neon: '#00ff41',
        matrix: '#00ffff',
        accent: '#ff0040',
        cyber: '#00ff41',
        neural: '#00ffff',
        cloud: '#38bdf8',
        chain: '#8b5cf6',
        ivory: '#e2e8f0',
        coral: '#ff0040',
        violet: '#8b5cf6',
        gold: '#00ffff',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        cyber: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.85, filter: 'brightness(1.3)' },
        },
      },
      boxShadow: {
        neon: '0 0 12px rgba(52, 211, 153, 0.15)',
        matrix: '0 0 12px rgba(34, 211, 238, 0.15)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
