import { TEST } from 'utils/constants';
import type { act as Act } from '@testing-library/react';

// Fixes service.subscribe triggering a "not wrapped in act" warning
// Only runs in test mode
export let act = ((cb: () => void) => {
  if (import.meta.env.DEV) {
    throw new Error('act(() => ...) was not removed, see filterReplace vite.config.ts');
  }
  cb();
}) as typeof Act;
if (import.meta.env.DEV && TEST) {
  act = await import('@testing-library/react').then((o) => o.act);
}
