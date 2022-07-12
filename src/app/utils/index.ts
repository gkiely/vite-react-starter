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

// export function assertObject<T>(value: unknown): asserts value is Required<T> {
//   if (value === undefined) {
//     throw new Error('value must be defined');
//   }
// }

// export const isObject = (x: unknown): x is Record<string, unknown> => {
//   return typeof x === 'object' && x !== null;
// };

export function assertType<T>(value: unknown): asserts value is T {
  if (value === undefined) {
    throw new Error('value must be defined');
  }
}

// export function assertObject(value: unknown): asserts value is Record<string, unknown> {
//   if (value === undefined) {
//     throw new Error('value must be defined');
//   }
// }

// export function assertObjectKey<T>(value: unknown): asserts value is Record<string, T> {
//   if (value === undefined) {
//     throw new Error('value must be defined');
//   }
// }
