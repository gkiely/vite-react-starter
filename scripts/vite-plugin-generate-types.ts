/* eslint-disable no-console */
import type { Plugin } from 'vite';
import { spawn, spawnSync } from 'node:child_process';

let running = false;

// Generate types for state.matches
// Runs on hot update and build
// TODO: see if there is a way to do this with vite-node instead of vitest
// https://www.npmjs.com/package/vite-node
const plugin = (command: 'build' | 'serve'): Plugin => ({
  name: 'generate-types',
  config() {
    if (command === 'build') {
      spawnSync('npm', ['run', '--silent', 'generate-types'], {
        stdio: 'inherit',
      });
    }
  },
  handleHotUpdate() {
    if (running) return;
    running = true;
    const child = spawn('npm', ['run', '--silent', 'generate-types'], {
      stdio: 'inherit',
    });
    child.on('close', () => {
      running = false;
    });
  },
});

export default plugin;
