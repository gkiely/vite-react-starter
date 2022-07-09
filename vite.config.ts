import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import wranglerPlugin from './scripts/vite-plugin-wrangler';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const serverIndex = process.argv.indexOf('--server');
const wranglerEnabled = serverIndex > -1;
const serverPath = wranglerEnabled ? process.argv[serverIndex + 1] : '';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./setup.vitest.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    deps: {
      fallbackCJS: true,
    },
    // https://github.com/bcoe/c8#cli-options--configuration
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/*.css.ts'],
      '100': true, // 100% coverage
    },
  },
  plugins: [
    react(),
    ...(wranglerEnabled ? [wranglerPlugin({ path: serverPath })] : []),
    checker({ typescript: true }),
    vanillaExtractPlugin({
      identifiers: command === 'serve' ? 'debug' : 'short',
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8080/',
    },
    open: true,
  },
  json: {
    stringify: true,
  },
}));
