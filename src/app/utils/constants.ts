declare const MINIFLARE: boolean | number;
export const DEV_SERVER = typeof MINIFLARE !== 'undefined';
export const TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
export const SERVER_HOST = DEV_SERVER ? 'http://localhost:8080' : '';
export const DEV = import.meta.env?.DEV; // Workers don't support for import.meta.env
export const CLIENT_HOST = TEST ? 'http://localhost' : '';
