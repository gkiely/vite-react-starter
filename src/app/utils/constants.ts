declare const MINIFLARE: boolean | number;
export const DEV_SERVER = typeof MINIFLARE !== 'undefined';
export const TEST =
  import.meta.env?.DEV && typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
export const SERVER_HOST = DEV_SERVER ? 'http://localhost:8080' : TEST ? 'http://localhost' : '';
export const DEV = import.meta.env?.DEV && !TEST; // Workers don't support for import.meta.env
export const CLIENT_HOST = TEST ? 'http://localhost' : '';
export const CLIENT = typeof MINIFLARE === 'undefined' && !import.meta.env.TEST;
export const SERVER = !CLIENT;
