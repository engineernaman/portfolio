import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Clock, Activity, Shield, Zap } from 'lucide-react';

const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    security: 100
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      
      // Simulate system stats
      setSystemStats({
        cpu: Math.random() * 100,
        memory: 60 + Math.random() * 30,
        network: 80 + Math.random() * 20,
        security: 95 + Math.random() * 5
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (value: number, reverse = false) => {
    if (reverse) {
      if (value > 80) return 'text-red-400';
      if (value > 60) return 'text-yellow-400';
      return 'text-violet';
    } else {
      if (value > 80) return 'text-violet';
      if (value > 60) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-black/90 border-b border-cyan-500/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between text-xs font-mono">
          {/* Left side - System info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-coral" />
              <span className="text-white">SOUMY</span>
              <span className="text-coral">SEC</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Activity className="w-3 h-3 text-violet" />
              <span className="text-gray-400">CPU:</span>
              <span className={getStatusColor(systemStats.cpu, true)}>
                {systemStats.cpu.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-gray-400">MEM:</span>
              <span className={getStatusColor(systemStats.memory, true)}>
                {systemStats.memory.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Center - Status messages */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-2 h-2 bg-violet rounded-full"></div>
              <span className="text-violet">SYSTEM SECURE</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-violet" />
              <span className="text-gray-400">SEC:</span>
              <span className="text-violet">{systemStats.security.toFixed(1)}%</span>
            </div>
          </div>

          {/* Right side - Network and time */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Wifi className="w-3 h-3 text-coral" />
              <span className="text-gray-400">NET:</span>
              <span className={getStatusColor(systemStats.network)}>
                {systemStats.network.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Battery className="w-3 h-3 text-violet" />
              <span className="text-violet">PWR: ∞</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-coral" />
              <span className="text-coral">{formatTime(time)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;