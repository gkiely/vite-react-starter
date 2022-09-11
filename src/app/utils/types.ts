import _ from 'cypress/types/lodash';
import type { AnyStateMachine, StateMachine } from 'xstate';

export type Intersect<T> = (T extends unknown ? (x: T) => 0 : never) extends (x: infer R) => 0
  ? R
  : never;

// https://stackoverflow.com/a/69802660/1845423
// Until exact types are supported: https://github.com/microsoft/TypeScript/issues/12936
export type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

// https://stackoverflow.com/a/56300887/1845423
// export type Flatten<T> = T extends { type: 'Union'; items: unknown[] }
//   ? { [P in keyof T]: P extends 'items' ? Flatten<T[P][number]> : never }[keyof T]
//   : T;

// Get list of events from machines
export type GetEvents<T extends AnyStateMachine> = T extends StateMachine<
  infer _Context,
  infer _,
  infer Events
>
  ? Events
  : never;
