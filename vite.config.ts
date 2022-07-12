import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import wranglerPlugin from './scripts/vite-plugin-wrangler';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'node:path';

const wranglerEnabled = process.argv.includes('--server');

// Clear terminal on initial load for vitest
if (process.env.NODE_ENV === 'test') {
  console.clear();
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  test: {
    env: {
      // "ExperimentalWarning: The Fetch API is an experimental feature."
      // Remove when fetch is no longer experimental
      NODE_NO_WARNINGS: '1',
    },
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./setup.vitest.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'server/**/*.test.{ts,tsx}'],
    css: false,
    deps: {
      fallbackCJS: true,
    },
    // https://github.com/bcoe/c8#cli-options--configuration
    coverage: {
      enabled: true,
      include: ['src/**/*.{ts,tsx}', 'server/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'server/**/*.test.{ts,tsx}',
        'src/**/*.css.ts',
        'src/app/utils/constants.ts',
        'src/app/utils/test-utils.ts',
        'server/dev-server.tsx',
      ],
      '100': true, // 100% coverage
    },
  },
  plugins: [
    react(),
    ...(wranglerEnabled
      ? [
          wranglerPlugin({
            path: 'server/worker.ts',
            config: 'server/wrangler.toml',
          }),
        ]
      : []),
    checker({ typescript: true }),
    vanillaExtractPlugin({
      identifiers: command === 'serve' ? 'debug' : 'short',
    }),
  ],
  resolve: {
    alias: {
      img: path.resolve(__dirname, './src/img'),
      components: path.resolve(__dirname, './src/app/components'),
      elements: path.resolve(__dirname, './src/app/elements'),
      containers: path.resolve(__dirname, './src/app/containers'),
      groups: path.resolve(__dirname, './src/app/groups'),
      routes: path.resolve(__dirname, './src/app/routes'),
      sections: path.resolve(__dirname, './src/app/sections'),
      store: path.resolve(__dirname, './src/app/store'),
      utils: path.resolve(__dirname, './src/app/utils'),
      common: path.resolve(__dirname, './src/app/common'),
      server: './server',
    },
  },
  server: {
    proxy: {
      '/server': 'http://localhost:8080/',
      '/api': 'http://localhost:8080/',
    },
    open: true,
  },
  json: {
    stringify: true,
  },
}));
