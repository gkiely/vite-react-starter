declare const MINIFLARE: boolean | number;
export const DEV_SERVER = typeof MINIFLARE !== 'undefined';
export const TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
export const SERVER_HOST = DEV_SERVER ? 'http://localhost:8080' : '';
export const DEV =
  typeof process === 'undefined' && !DEV_SERVER && import.meta.env.MODE === 'development';
