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

/* c8 ignore stop */
