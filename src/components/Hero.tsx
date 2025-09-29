import React, { useEffect, useState } from 'react';
import { ChevronDown, Code, Shield, Zap } from 'lucide-react';

const Hero = () => {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const tagline = "Securing Systems, Empowering Minds";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(tagline.slice(0, i));
      i++;
      if (i > tagline.length) {
        clearInterval(timer);
      }
    }, 100);

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="matrix-bg"></div>
      </div>

      {/* Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-lines"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white glitch-text neon-text" data-text="SOUMY NAMAN SRIVASTAVA">
            SOUMY NAMAN
            <br />
            <span className="text-cyan-400 hologram-text">SRIVASTAVA</span>
          </h1>
          <div className="text-xl md:text-2xl text-green-400 mb-6 h-8 font-mono">
            {text}<span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity animate-pulse`}>|</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-12">
          <div className="flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full border border-cyan-500/30">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-white">Cyber Security Lead</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full border border-green-500/30">
            <Code className="w-5 h-5 text-green-400" />
            <span className="text-white">9+ Years Experience</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/50 px-4 py-2 rounded-full border border-purple-500/30">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-white">DevSecOps Expert</span>
          </div>
        </div>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Penetration Testing • Cloud Security • Digital Forensics • DevSecOps
          <br />
          Protecting digital infrastructure with cutting-edge security solutions
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a 
            href="#projects"
            className="cyber-button bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 glow-effect inline-block circuit-border"
            onClick={() => (window as any).playTypingSound && (window as any).playTypingSound()}
          >
            View My Work
          </a>
          <a 
            href="#contact"
            className="cyber-button border border-green-400 text-green-400 px-8 py-3 rounded-full font-semibold hover:bg-green-400 hover:text-black transition-all duration-300 inline-block"
            onClick={() => (window as any).playTypingSound && (window as any).playTypingSound()}
          >
            Contact Me
          </a>
        </div>

        <a 
          href="#about"
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hover:text-green-400 transition-colors duration-300"
        >
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </a>
      </div>

      <style jsx>{`
        .glitch-text {
          position: relative;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          animation: glitch-anim-1 0.5s infinite linear alternate-reverse;
          color: #ff0040;
          z-index: -1;
        }
        .glitch-text::after {
          animation: glitch-anim-2 0.5s infinite linear alternate-reverse;
          color: #00ff41;
          z-index: -2;
        }
        
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(40% 0 61% 0); }
          20% { clip-path: inset(92% 0 1% 0); }
          40% { clip-path: inset(43% 0 1% 0); }
          60% { clip-path: inset(25% 0 58% 0); }
          80% { clip-path: inset(54% 0 7% 0); }
          100% { clip-path: inset(58% 0 43% 0); }
        }
        
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(25% 0 58% 0); }
          20% { clip-path: inset(54% 0 7% 0); }
          40% { clip-path: inset(58% 0 43% 0); }
          60% { clip-path: inset(40% 0 61% 0); }
          80% { clip-path: inset(92% 0 1% 0); }
          100% { clip-path: inset(43% 0 1% 0); }
        }

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

        .scan-lines {
          background: linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%);
          background-size: 100% 2px;
          width: 100%;
          height: 100%;
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }

        .glow-effect {
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        .glow-effect:hover {
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
        }
      `}</style>
    </section>
  );
};

export default Hero;