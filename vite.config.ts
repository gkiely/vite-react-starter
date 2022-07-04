import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import wranglerPlugin from './scripts/wrangler-plugin';

const viteNode = process.env.npm_lifecycle_script.startsWith('vite-node');

const plugins = viteNode
  ? [checker({ typescript: true })]
  : [react(), wranglerPlugin(), checker({ typescript: true })];

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./setup.vitest.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // https://github.com/bcoe/c8#cli-options--configuration
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,tsx}'],
      '100': true, // 100% coverage
    },
  },
  plugins,
  server: {
    proxy: {
      '/api': 'http://localhost:8080/',
    },
    open: true,
  },
  json: {
    stringify: true,
  },
});
