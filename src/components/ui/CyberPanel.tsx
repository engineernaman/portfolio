import { ReactNode } from 'react';

interface CyberPanelProps {
  children: ReactNode;
  className?: string;
  glow?: 'green' | 'cyan' | 'magenta';
}

const borderMap = {
  green: 'border-white/[0.08] hover:border-emerald-500/25',
  cyan: 'border-white/[0.08] hover:border-cyan-500/25',
  magenta: 'border-white/[0.08] hover:border-rose-500/25',
};

const CyberPanel = ({ children, className = '', glow = 'green' }: CyberPanelProps) => (
  <div
    className={`cyber-panel relative rounded-xl border backdrop-blur-md transition-colors duration-200 ${borderMap[glow]} ${className}`}
  >
    {children}
  </div>
);

export default CyberPanel;
