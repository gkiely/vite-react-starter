/* eslint-disable no-console */
import type { Plugin } from 'vite';
import pc from 'picocolors';

let canClear = false;
let timeout: NodeJS.Timeout;

const clear = () => {
  process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc\n');
};

// Clear terminal on initial and subsequent loads for vitest
const plugin = (): Plugin => ({
  name: 'clear-vitest',
  config: () => clear(),
  load: (p) => {
    if (canClear) {
      clear();
      console.log(pc.black(pc.bgBlue(' RERUN ')), pc.gray(p.match(/(src|server)\/.+/)?.[0]), '\n');
      return;
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      canClear = true;
    }, 1000);
  },
});

export default plugin;
