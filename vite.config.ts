import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import wranglerPlugin from './scripts/vite-plugin-wrangler';

const server = process.argv.includes('--server');
const serverIndex = process.argv.indexOf('--server');
const path = serverIndex > 0 ? process.argv[serverIndex + 1] : '';

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
  plugins: [react(), ...(server ? [wranglerPlugin({ path })] : []), checker({ typescript: true })],
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
