import { createContext, useContext, useCallback, useRef, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextValue {
  playTypingSound: () => void;
  showNotification: (title: string, message: string, type?: Notification['type']) => void;
  triggerMatrix: () => void;
  registerPlayTypingSound: (fn: () => void) => void;
  registerShowNotification: (fn: (title: string, message: string, type?: Notification['type']) => void) => void;
  registerTriggerMatrix: (fn: () => void) => void;
  scrollProgress: number;
  setScrollProgress: (value: number) => void;
  reducedMotion: boolean;
  openIntelLab: () => void;
  closeIntelLab: () => void;
  intelLabOpen: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  reducedMotion,
}: {
  children: ReactNode;
  reducedMotion: boolean;
}) {
  const playTypingRef = useRef<() => void>(() => {});
  const showNotificationRef = useRef<(title: string, message: string, type?: Notification['type']) => void>(() => {});
  const triggerMatrixRef = useRef<() => void>(() => {});
  const scrollProgressRef = useRef(0);
  const [intelLabOpen, setIntelLabOpen] = useState(false);

  const playTypingSound = useCallback(() => playTypingRef.current(), []);
  const showNotification = useCallback(
    (title: string, message: string, type?: Notification['type']) =>
      showNotificationRef.current(title, message, type),
    []
  );
  const triggerMatrix = useCallback(() => triggerMatrixRef.current(), []);
  const openIntelLab = useCallback(() => setIntelLabOpen(true), []);
  const closeIntelLab = useCallback(() => setIntelLabOpen(false), []);

  const registerPlayTypingSound = useCallback((fn: () => void) => {
    playTypingRef.current = fn;
  }, []);

  const registerShowNotification = useCallback(
    (fn: (title: string, message: string, type?: Notification['type']) => void) => {
      showNotificationRef.current = fn;
    },
    []
  );

  const registerTriggerMatrix = useCallback((fn: () => void) => {
    triggerMatrixRef.current = fn;
  }, []);

  const setScrollProgress = useCallback((value: number) => {
    scrollProgressRef.current = value;
  }, []);

  return (
    <AppContext.Provider
      value={{
        playTypingSound,
        showNotification,
        triggerMatrix,
        registerPlayTypingSound,
        registerShowNotification,
        registerTriggerMatrix,
        scrollProgress: scrollProgressRef.current,
        setScrollProgress,
        reducedMotion,
        openIntelLab,
        closeIntelLab,
        intelLabOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
