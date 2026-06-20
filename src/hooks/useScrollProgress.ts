import { useEffect, useState } from 'react';
import { subscribeScrollProgress } from '../lib/scrollState';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => subscribeScrollProgress(setProgress), []);

  return progress;
}
