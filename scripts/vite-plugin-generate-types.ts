/* eslint-disable no-console */
import type { Plugin } from 'vite';

// Clear terminal on initial and subsequent loads for vitest
const plugin = (): Plugin => ({
  name: 'generate-types',
  handleHotUpdate(_ctx) {
    console.log('hot update');
  },
});

export default plugin;
