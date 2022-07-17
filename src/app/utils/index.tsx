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
  let i = 0;
  return [
    (prefix = ''): string => {
      return `${prefix}-${i++}`;
    },
    () => (i = 0),
  ] as const;
};

type Tag = 'text' | 'code';
export type Tags = {
  [key in Tag]: string;
}[];

export const renderTags = (tags: Tags) => {
  return tags.map(({ text, code }) => {
    if (text) return <>{text}</>;
    if (code) return <code>{code}</code>;
    return undefined;
  });
};

/* c8 ignore stop */
