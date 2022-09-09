import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import { expect, vi } from 'vitest';

// Disable runtime css
import '@vanilla-extract/css/disableRuntimeStyles';

// Configuration:
// https://testing-library.com/docs/dom-testing-library/api-configuration
configure({
  // Disable hidden check for better perf
  // https://github.com/testing-library/dom-testing-library/issues/552#issuecomment-626718645
  defaultHidden: true,
  testIdAttribute: 'data-test-id',
  // Don't log dom snapshot
  // https://stackoverflow.com/a/64155473/1845423
  getElementError(message) {
    if (!message) return new Error('No error message provided');
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    error.stack = undefined;
    return error;
  },
});

vi.stubGlobal('fetch', () => ({
  json: vi.fn(),
}));

vi.stubGlobal('location', {
  pathname: '/',
});

// Fail if console logs
// When not running in watch or coverage mode
if (process.env.VITEST_MODE !== 'WATCH' && process.env.npm_lifecycle_event !== 'coverage') {
  const { log } = console;
  const reportError = (msg: string, type: 'log' | 'warn' | 'error') => {
    log(msg);
    const err = new Error(`console.${type} was called`);
    expect.fail(
      (err.stack as string)
        .replace(/(.+setup\.vitest\.ts.+\n+)/g, '')
        .replace(/.+file:\/\/\/.+\n/g, '')
        .replace(/.+\/node_modules\/.+\n?/g, '')
    );
  };

  vi.stubGlobal('console', {
    log: (msg: string) => reportError(msg, 'log'),
    warn: (msg: string) => reportError(msg, 'warn'),
    error: (msg: string) => reportError(msg, 'error'),
  });
}
