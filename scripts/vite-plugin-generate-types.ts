/* eslint-disable no-console */
import type { Plugin } from 'vite';
import { spawn, spawnSync } from 'node:child_process';

export const generateTypesFilePath = 'src/app/utils/generate-types.ts';

// Generate types for state.matches
// Runs on hot update and build
// TODO: see if there is a way to do this with vite-node instead of vitest
// https://www.npmjs.com/package/vite-node
const blacklist = ['.generated.ts', 'tsconfig.tsbuildinfo', '.eslintcache'];
const plugin = (command: 'build' | 'serve'): Plugin => ({
  name: 'generate-types',
  config() {
    if (command === 'build') {
      // Debugging
      // spawnSync('vitest', ['run', generateTypesFilePath], {
      //   stdio: 'inherit',
      // });
      spawnSync('vitest', ['run', generateTypesFilePath]);
    }
  },
  handleHotUpdate(e) {
    if (blacklist.some((s) => e.file.endsWith(s))) return;
    // Debugging
    // spawn('vitest', ['run', generateTypesFilePath], {
    //   stdio: 'inherit',
    // });

    spawn('vitest', ['run', generateTypesFilePath]);
  },
});

export default plugin;
