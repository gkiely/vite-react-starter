import { splitVendorChunkPlugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import wranglerPlugin from './scripts/vite-plugin-wrangler';
import clearVitest from './scripts/vite-plugin-clear-vitest';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import generateTypes from './scripts/vite-plugin-generate-types';
import path from 'node:path';
const TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const DEV = !TEST;
const event = process.env.npm_lifecycle_event;
const WATCH_TEST = TEST && event === 'test';
const generateTypesCommand = event?.startsWith('generate-types') || event === 'dev';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // When generating types, run in node environment
  test: generateTypesCommand
    ? {
        environment: 'node',
        globals: true,
        include: ['src/app/utils/generate-types.ts'],
        css: false,
        isolate: false,
        passWithNoTests: true,
        coverage: {
          enabled: false,
        },
      }
    : {
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
    !TEST && generateTypes(command),
    process.argv.includes('--server') ? wranglerPlugin() : undefined,
    DEV &&
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint -c .eslintrc.json --cache --fix --ext ts,tsx src',
          dev: {
            logLevel: ['error'],
          },
        },
      }),
    // Clear terminal plugin for vitest
    WATCH_TEST && clearVitest(),
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
      machines: path.resolve(__dirname, './src/app/machines'),
      types: path.resolve(__dirname, './src/app/types'),
      server: command === 'serve' ? './server' : path.resolve(__dirname, './server'),
    },
  },
  build: {
    rollupOptions: {
      external: ['./utils/runtime-error-overlay'],
    },
  },
  server: {
    port: 3000,
    watch: {
      ignored: ['/coverage'],
    },
    proxy: {
      '/server': 'http://localhost:8080/',
      '/api': 'http://localhost:8080/',
    },
    open: true,
  },
  json: {
    stringify: true,
  },
  optimizeDeps: {
    // Fix vite being unable to discover zod after updating an npm package
    include: ['zod'],
  },
}));
