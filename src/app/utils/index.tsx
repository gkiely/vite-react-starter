import { Context, Next } from 'hono';
import type { EventObject } from 'xstate';

/* c8 ignore start */
export function assertType<T>(value: unknown): asserts value is T {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

export function assertEventType<TE extends EventObject, TType extends TE['type']>(
  event: TE,
  eventType: TType
): asserts event is TE & { type: TType } {
  if (event.type !== eventType) {
    throw new Error(`Invalid event: expected "${eventType}", got "${event.type}"`);
  }
}

export const delay = (ms: number, signal?: AbortController['signal']) => {
  if (signal) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, ms);
      const abort = () => {
        clearTimeout(timeout);
        reject();
        signal.removeEventListener('abort', abort);
      };
      signal.addEventListener('abort', abort);
    });
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function delayMiddleware(timeout = 1000) {
  return async (_c: Context, next: Next) => {
    await delay(timeout);
    await next();
  };
}

export function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
  const result: Partial<T> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result as Required<Pick<T, K>>;
}

export const id = (prefix = '', i: number) => {
  return `${prefix}-${i}`;
};

type Tag = 'text' | 'code';
export type Tags = {
  [key in Tag]?: string;
}[];

export const renderTags = (tags: Tags) => {
  return tags.map(({ text, code }, i) => {
    if (text) return <span key={id('tag', i)}>{text}</span>;
    if (code) return <code key={id('tag', i)}>{code}</code>;
    return [];
  });
};

export const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

export const omit = (obj: object, ...keys: string[]) => {
  const result: { [key: string]: unknown } = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key as keyof typeof obj];
    }
  }
  return result;
};

// array to enum
export const toEnum = <T extends string>(array: readonly T[]) => {
  const result: { [key in T]: key } = {} as { [key in T]: key };
  for (const key of array) {
    result[key] = key;
  }
  return result;
};

export const unique = <T extends unknown>(arr: T[]) => [...new Set(arr)];

const isObjectLike = (value: unknown) => {
  return typeof value === 'object' && value !== null;
};

const getValueType = (value: unknown) => {
  const t = typeof value;
  if (t === 'object' && Array.isArray(value)) return 'array';
  if (t === 'object' && value !== null) return 'object';
  return t;
};

// https://stackoverflow.com/a/32922084/1845423
export const isEqual = (value: unknown, other: unknown): boolean => {
  if (value === other) return true;

  if (!isObjectLike(value) || !isObjectLike(other)) {
    return value === other;
  }
  if (getValueType(value) !== getValueType(other)) return false;

  assertType<Record<string, unknown>>(value);
  assertType<Record<string, unknown>>(other);

  const v = Object.keys(value);
  const o = Object.keys(other);
  if (v.length === 0 && o.length === 0) return true;

  return v.length === o.length && v.every((k) => isEqual(value[k], other[k]));
};

// https://github.com/dmnd/dedent/blob/master/dedent.js
// export const dedent = (s: string, ...values: Array<string>): string => {
//   return s.replace(/\n/g, '').trim();
//   return s;
// };

/* c8 ignore stop */
