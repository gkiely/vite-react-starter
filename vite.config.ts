import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

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
  plugins: [react(), checker({ typescript: true })],
  server: {
    open: true,
  },
  json: {
    stringify: true,
  },
});
