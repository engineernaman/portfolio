import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const SoundSystem = () => {
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

  // Expose typing sound globally
  useEffect(() => {
    (window as any).playTypingSound = playTypingSound;
  }, [isEnabled]);

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col space-y-2">
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`p-3 rounded-full border transition-all duration-300 ${
          isEnabled 
            ? 'bg-green-500/20 border-green-400 text-green-400' 
            : 'bg-gray-800/50 border-gray-600 text-gray-400'
        } hover:scale-110`}
        title={isEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects'}
      >
        {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
      
      {isEnabled && (
        <button
          onClick={isPlaying ? stopAmbientSound : playAmbientSound}
          className={`p-3 rounded-full border transition-all duration-300 ${
            isPlaying 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 animate-pulse' 
              : 'bg-gray-800/50 border-gray-600 text-gray-400'
          } hover:scale-110`}
          title={isPlaying ? 'Stop Ambient Sound' : 'Play Ambient Sound'}
        >
          <Music className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SoundSystem;