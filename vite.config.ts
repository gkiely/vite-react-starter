import { Plugin, splitVendorChunkPlugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import wranglerPlugin from './scripts/vite-plugin-wrangler';
import clearVitest from './scripts/vite-plugin-clear-vitest';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'node:path';
const DEV_TEST = process.env.NODE_ENV === 'test' && process.env.npm_lifecycle_event === 'test';

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
        'src/app/utils/runtime-error-overlay.ts',
        'server/dev-server.tsx',
      ],
      '100': true, // 100% coverage
    },
  },
  plugins: [
    react(),
    process.argv.includes('--server') ? wranglerPlugin() : undefined,
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint -c .eslintrc.json --cache --fix --ext ts,tsx src',
        dev: {
          logLevel: ['error'],
        },
      },
    }) as Plugin,
    // Clear terminal plugin for vitest
    DEV_TEST ? clearVitest() : undefined,
    vanillaExtractPlugin({
      identifiers: command === 'serve' ? 'debug' : 'short',
    }),
    command === 'build' ? splitVendorChunkPlugin() : undefined,
  ],
  // TODO
  // Submit fix to esbuild for 'linked': https://github.com/evanw/esbuild/blob/master/pkg/api/api_impl.go#L1458
  // or change to 'eof', read eof and move to txt and link
  esbuild: {
    legalComments: 'none',
  },
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
      server: command === 'serve' ? './server' : path.resolve(__dirname, './server'),
    },
  },
  build: {
    rollupOptions: {
      external: ['./utils/runtime-error-overlay'],
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
