import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./setup.vitest.ts'],
  },
  plugins: [react(), checker({ typescript: true })],
  server: {
    open: true,
  },
  json: {
    stringify: true,
  },
});
