import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SoundSystem = ({ compact = false }: { compact?: boolean }) => {
  const { registerPlayTypingSound, reducedMotion } = useApp();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playTypingSound = () => {
    if (!isEnabled || !audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800 + Math.random() * 200, audioContext.currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playAmbientSound = () => {
    if (!isEnabled || !audioContextRef.current || isPlaying) return;
    
    setIsPlaying(true);
    const audioContext = audioContextRef.current;
    
    // Create ambient cyberpunk drone
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.frequency.setValueAtTime(60, audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(120.5, audioContext.currentTime);
    oscillator1.type = 'sawtooth';
    oscillator2.type = 'triangle';
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 2);
    
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    
    oscillatorRef.current = oscillator1;
    gainNodeRef.current = gainNode;
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      stopAmbientSound();
    }, 30000);
  };

  const stopAmbientSound = () => {
    if (oscillatorRef.current && gainNodeRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 1);
      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current = null;
          gainNodeRef.current = null;
          setIsPlaying(false);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    registerPlayTypingSound(playTypingSound);
  }, [isEnabled, registerPlayTypingSound]);

  if (reducedMotion) return null;

  const btnClass = compact
    ? 'p-2 rounded-lg border transition-colors'
    : 'p-3 rounded-full border transition-all duration-300 hover:scale-110';

  return (
    <div className={compact ? 'flex items-center gap-1.5' : 'flex flex-col space-y-2'}>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`${btnClass} ${
          isEnabled
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            : 'bg-black/50 border-white/10 text-slate/50 hover:text-white'
        }`}
        aria-label={isEnabled ? 'Disable sound effects' : 'Enable sound effects'}
      >
        {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {isEnabled && (
        <button
          onClick={isPlaying ? stopAmbientSound : playAmbientSound}
          className={`${btnClass} ${
            isPlaying
              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 animate-pulse'
              : 'bg-black/50 border-white/10 text-slate/50 hover:text-white'
          }`}
          aria-label={isPlaying ? 'Stop ambient sound' : 'Play ambient sound'}
        >
          <Music className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SoundSystem;