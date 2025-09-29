import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Add welcome notification
    const welcomeNotification: Notification = {
      id: 'welcome',
      type: 'success',
      title: 'System Online',
      message: 'Welcome to SoumySec Terminal. All systems operational.',
      duration: 5000
    };
    
    setTimeout(() => {
      addNotification(welcomeNotification);
    }, 2000);

    // Expose global notification function
    (window as any).showNotification = addNotification;
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
    
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }
    
    // Play sound effect
    if ((window as any).playTypingSound) {
      (window as any).playTypingSound();
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Zap;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-400 bg-green-400/10 text-green-400';
      case 'error': return 'border-red-400 bg-red-400/10 text-red-400';
      case 'warning': return 'border-yellow-400 bg-yellow-400/10 text-yellow-400';
      case 'info': return 'border-cyan-400 bg-cyan-400/10 text-cyan-400';
      default: return 'border-gray-400 bg-gray-400/10 text-gray-400';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type);
        const colors = getColors(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 backdrop-blur-sm bg-black/90 ${colors} animate-slide-in-left`}
          >
            <div className="flex items-start space-x-3">
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm font-mono">{notification.title}</h4>
                <p className="text-xs mt-1 opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress bar for timed notifications */}
            {notification.duration && (
              <div className="mt-3 w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                <div 
                  className={`h-full bg-current rounded-full animate-progress`}
                  style={{ 
                    animationDuration: `${notification.duration}ms`,
                    animationTimingFunction: 'linear'
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
      
      <style>
        {`
          @keyframes slide-in-left {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
          
          .animate-slide-in-left {
            animation: slide-in-left 0.3s ease-out;
          }
          
          .animate-progress {
            animation: progress linear;
          }
        `}
      </style>
    </div>
  );
};

export default NotificationSystem;