let progress = 0;
const listeners = new Set<(p: number) => void>();

export function setGlobalScrollProgress(value: number) {
  progress = Math.min(1, Math.max(0, value));
  listeners.forEach((fn) => fn(progress));
}

export function getGlobalScrollProgress() {
  return progress;
}

export function subscribeScrollProgress(listener: (p: number) => void) {
  listeners.add(listener);
  listener(progress);
  return () => listeners.delete(listener);
}
