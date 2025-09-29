import React, { useEffect, useState } from 'react';

interface GlitchEffectProps {
    children: React.ReactNode;
    intensity?: 'low' | 'medium' | 'high';
    trigger?: boolean;
    className?: string;
}

const GlitchEffect: React.FC<GlitchEffectProps> = ({
    children,
    intensity = 'medium',
    trigger = false,
    className = ''
}) => {
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        if (trigger) {
            setIsGlitching(true);
            const timeout = setTimeout(() => setIsGlitching(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [trigger]);

    useEffect(() => {
        const intervals = {
            low: 8000,
            medium: 5000,
            high: 2000
        };

        const interval = setInterval(() => {
            if (Math.random() < 0.3) {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 200);
            }
        }, intervals[intensity]);

        return () => clearInterval(interval);
    }, [intensity]);

    return (
        <>
            <style>
                {`
          @keyframes glitch-effect-1 {
            0% { transform: translateX(-2px) skew(1deg); }
            10% { transform: translateX(2px) skew(-1deg); }
            20% { transform: translateX(-1px) skew(0.5deg); }
            30% { transform: translateX(1px) skew(-0.5deg); }
            40% { transform: translateX(-2px) skew(1deg); }
            50% { transform: translateX(2px) skew(-1deg); }
            60% { transform: translateX(-1px) skew(0.5deg); }
            70% { transform: translateX(1px) skew(-0.5deg); }
            80% { transform: translateX(-2px) skew(1deg); }
            90% { transform: translateX(2px) skew(-1deg); }
            100% { transform: translateX(-1px) skew(0.5deg); }
          }
          
          @keyframes glitch-effect-2 {
            0% { transform: translateX(2px) skew(-1deg); }
            10% { transform: translateX(-2px) skew(1deg); }
            20% { transform: translateX(1px) skew(-0.5deg); }
            30% { transform: translateX(-1px) skew(0.5deg); }
            40% { transform: translateX(2px) skew(-1deg); }
            50% { transform: translateX(-2px) skew(1deg); }
            60% { transform: translateX(1px) skew(-0.5deg); }
            70% { transform: translateX(-1px) skew(0.5deg); }
            80% { transform: translateX(2px) skew(-1deg); }
            90% { transform: translateX(-2px) skew(1deg); }
            100% { transform: translateX(1px) skew(-0.5deg); }
          }
          
          .glitch-container-active {
            position: relative;
          }
          
          .glitch-container-active::before,
          .glitch-container-active::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            pointer-events: none;
          }
          
          .glitch-container-active::before {
            animation: glitch-effect-1 0.3s infinite linear alternate-reverse;
            background: linear-gradient(90deg, transparent 0%, #ff0040 2%, transparent 8%, transparent 92%, #ff0040 98%, transparent 100%);
            mix-blend-mode: multiply;
          }
          
          .glitch-container-active::after {
            animation: glitch-effect-2 0.3s infinite linear alternate-reverse;
            background: linear-gradient(90deg, transparent 0%, #00ffff 2%, transparent 8%, transparent 92%, #00ffff 98%, transparent 100%);
            mix-blend-mode: multiply;
          }
        `}
            </style>
            <div className={`relative ${className}`}>
                <div className={`${isGlitching ? 'glitch-container-active' : ''}`}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default GlitchEffect;