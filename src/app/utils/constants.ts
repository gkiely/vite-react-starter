declare const MINIFLARE: boolean | number;
export const DEV = typeof MINIFLARE !== 'undefined';
export const TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
export const SERVER_HOST = DEV ? 'http://localhost:8080' : '';
