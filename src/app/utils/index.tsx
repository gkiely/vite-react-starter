import { Context, Next } from 'hono';
import { delay } from '@gkiely/utils';
import type { EventObject } from 'xstate';

export * from '@gkiely/utils';

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

export function delayMiddleware(timeout = 1000) {
  return async (_c: Context, next: Next) => {
    await delay(timeout);
    await next();
  };
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

// array to enum
export const toEnum = <T extends string>(array: readonly T[]) => {
  const result: { [key in T]: key } = {} as { [key in T]: key };
  for (const key of array) {
    result[key] = key;
  }
  return result;
};

export const unique = <T extends unknown>(arr: T[]) => [...new Set(arr)];

// https://github.com/dmnd/dedent/blob/master/dedent.js
// export const dedent = (s: string, ...values: Array<string>): string => {
//   return s.replace(/\n/g, '').trim();
//   return s;
// };

/* c8 ignore stop */
