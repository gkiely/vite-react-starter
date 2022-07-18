import { DependencyList, EffectCallback, useEffect } from 'react';

/* c8 ignore start */
export function assert(value: unknown): asserts value {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

export function assertRequired<T>(value: T): asserts value is Required<T> {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

export function assertType<T>(value: unknown): asserts value is T {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAsyncEffect = (
  effect: () => Promise<void>,
  deps?: DependencyList,
  cleanup?: ReturnType<EffectCallback>
) => {
  useEffect(() => {
    void effect();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

// Generate hash from string
export const getHash = (str: string) => {
  if (str.length === 0) {
    return 0;
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]) {
  const result: Partial<T> = {};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result as Required<Pick<T, K>>;
}

export const generateId = () => {
  const prefixes = new Map<string, number>();

  return [
    (prefix?: string): string => {
      if (prefix === undefined) {
        // eslint-disable-next-line no-param-reassign
        prefix = 'id';
      }
      const p = prefixes.get(prefix);
      const count = p === undefined ? 0 : p + 1;
      prefixes.set(prefix, count);
      return `${prefix}-${count}`;
    },
    () => prefixes.clear(),
  ] as const;
};

export const id = (prefix = '', i: number) => {
  return `${prefix}-${i}`;
};

type Tag = 'text' | 'code';
export type Tags = {
  [key in Tag]: string;
}[];

export const renderTags = (tags: Tags) => {
  return tags.map(({ text, code }, i) => {
    if (text) return <span key={id('tag', i)}>{text}</span>;
    if (code) return <code key={id('tag', i)}>{code}</code>;
    return undefined;
  });
};

export const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
};

export const omit = (obj: object, keys: string[]) => {
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

// prefix enum
export const prefixedEnum = <P extends string, T extends string>(
  prefix: P,
  array: readonly T[]
) => {
  const result: { [key in T]: `${P}${T}` } = {} as { [key in T]: `${P}${T}` };
  for (const key of array) {
    result[key] = `${prefix}${key}`;
  }
  return result;
};

/* c8 ignore stop */
