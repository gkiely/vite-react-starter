/* eslint-disable no-console */
import type { Plugin } from 'vite';
import { spawn, spawnSync } from 'node:child_process';

export const generateTypesFilePath = 'src/app/utils/generate-types.ts';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let running = false;

// Generate types for state.matches
// Runs on hot update and build
// TODO: see if there is a way to do this with vite-node instead of vitest
// https://www.npmjs.com/package/vite-node
const plugin = (command: 'build' | 'serve'): Plugin => ({
  name: 'generate-types',
  config() {
    if (command === 'build') {
      spawnSync('vitest', ['run', generateTypesFilePath], {
        stdio: 'inherit',
      });
    }
  },
  handleHotUpdate(e) {
    console.log('hot update', running, e.file);
    if (running || e.file.endsWith('states.generated.ts')) return;
    running = true;
    console.log('running');
    const child = spawn('vitest', ['run', generateTypesFilePath], {
      stdio: 'inherit',
    });

    child.once('close', () => {
      console.log('closed');
      running = false;
    });
  },
});

export default plugin;
