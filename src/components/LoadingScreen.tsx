import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Code, Zap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const loadingSteps = [
    { text: 'Initializing security protocols...', icon: Shield, duration: 800 },
    { text: 'Loading penetration testing modules...', icon: Code, duration: 1000 },
    { text: 'Establishing secure connections...', icon: Terminal, duration: 900 },
    { text: 'Activating defense systems...', icon: Zap, duration: 700 },
    { text: 'System ready. Welcome to SoumySec.', icon: Shield, duration: 500 }
  ];

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    const runLoadingSequence = async () => {
      for (let i = 0; i < loadingSteps.length; i++) {
        setCurrentStep(i);
        setTerminalLines(prev => [...prev, `> ${loadingSteps[i].text}`]);

        // Animate progress for this step
        const stepProgress = ((i + 1) / loadingSteps.length) * 100;
        const startProgress = (i / loadingSteps.length) * 100;
        const progressDiff = stepProgress - startProgress;
        const progressIncrement = progressDiff / (loadingSteps[i].duration / 50);

        let currentProgress = startProgress;
        progressTimer = setInterval(() => {
          currentProgress += progressIncrement;
          if (currentProgress >= stepProgress) {
            currentProgress = stepProgress;
            clearInterval(progressTimer);
          }
          setProgress(currentProgress);
        }, 50);

        await new Promise(resolve => {
          stepTimer = setTimeout(resolve, loadingSteps[i].duration);
        });
      }

      // Complete loading
      setTimeout(() => {
        onComplete();
      }, 1000);
    };

    runLoadingSequence();

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [onComplete]);

  const CurrentIcon = loadingSteps[currentStep]?.icon || Shield;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Matrix background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="matrix-bg"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8 group">
          <Shield className="w-12 h-12 text-cyan-400 animate-pulse" />
          <span className="text-4xl font-bold text-white">
            Soumy<span className="text-cyan-400">Sec</span>
          </span>
        </div>

        {/* Current Step Icon */}
        <div className="mb-8">
          <CurrentIcon className="w-16 h-16 text-green-400 mx-auto animate-spin" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-cyan-400 text-sm mt-2 font-mono">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Terminal Output */}
        <div className="bg-black/80 border border-green-500/30 rounded-lg p-6 text-left font-mono text-sm max-h-64 overflow-y-auto">
          {terminalLines.map((line, index) => (
            <div 
              key={index} 
              className={`text-green-400 mb-1 ${index === terminalLines.length - 1 ? 'animate-pulse' : ''}`}
            >
              {line}
              {index === terminalLines.length - 1 && <span className="animate-pulse">|</span>}
            </div>
          ))}
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .matrix-bg {
          background: linear-gradient(90deg, transparent 24%, rgba(0, 255, 65, 0.03) 25%, rgba(0, 255, 65, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, 0.03) 75%, rgba(0, 255, 65, 0.03) 76%, transparent 77%, transparent);
          background-size: 20px 20px;
          width: 100%;
          height: 100%;
          animation: matrix-move 20s linear infinite;
        }

        @keyframes matrix-move {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(100px); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;