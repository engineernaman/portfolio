let progress = 0;
let velocity = 0;
const listeners = new Set<(p: number) => void>();

export function setGlobalScrollProgress(value: number) {
  const next = Math.min(1, Math.max(0, value));
  if (Math.abs(next - progress) < 0.0001) return;
  velocity = next - progress;
  progress = next;
  listeners.forEach((fn) => fn(progress));
}

export function getGlobalScrollProgress() {
  return progress;
}

export function getScrollVelocity() {
  return velocity;
}

export function subscribeScrollProgress(listener: (p: number) => void) {
  listeners.add(listener);
  listener(progress);
  return () => listeners.delete(listener);
}

/** Read scroll in useFrame — always fresh, no stale React state */
export function readScrollProgress() {
  return progress;
}
