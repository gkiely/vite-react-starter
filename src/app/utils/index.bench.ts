import { bench, describe } from 'vitest';
import { isEqual as _isEqual } from 'lodash';
import nanoEqual from 'nano-equal';
import fastEqual from 'fast-deep-equal';
import { isEqual } from '@gkiely/utils';

export function assertType<T>(_value: unknown): asserts _value is T {}

type Obj = Record<string, unknown>;

const getValueTypeOld = (value: unknown) => {
  const t = typeof value;
  if (t === types.object && Array.isArray(value)) return 'array';
  if (t === types.object && value !== null) return 'object';
  if (t === types.number && Number.isNaN(value)) return 'NaN';
  return t;
};

// Inspired by:
// https://github.com/smelukov/nano-equal
// https://stackoverflow.com/a/32922084/1845423
export const isEqualOld = (value: unknown, other: unknown): boolean => {
  if (value === other) return true;
  const valueType = getValueTypeOld(value);
  const otherType = getValueTypeOld(other);
  const typesArr = [valueType, otherType];

  if (typesArr.every((o) => o === 'NaN')) return true;

  const hasObject = typesArr.some((o) => ['object', 'array'].includes(o));
  if (!hasObject) {
    return value === other;
  }
  if (valueType !== otherType) return false;

  assertType<Obj>(value);
  assertType<Obj>(other);

  const v = Object.keys(value);
  const o = Object.keys(other);
  if (v.length === 0 && o.length === 0) return true;

  return v.length === o.length && v.every((k) => isEqualOld(value[k], other[k]));
};

const types = {
  NaN: 'NaN',
  object: 'object',
  array: 'array',
  number: 'number',
  date: 'date',
  null: 'null',
  function: 'function',
  regexp: 'regexp',
} as const;

// const getValueType = (value: unknown) => {
//   const t = typeof value;
//   if (t === types.object && value !== null) {
//     if (Array.isArray(value)) return types.array;
//     if (value instanceof Date) return types.date;
//     if (value instanceof RegExp) return types.regexp;
//     return types.object;
//   }
//   if (t === types.number && Number.isNaN(value)) return types.NaN;
//   if (value === null) return types.null;
//   return t;
// };

// // Inspired by:
// // https://github.com/smelukov/nano-equal
// // https://stackoverflow.com/a/32922084/1845423
// // This function is benchmarked using vitest bench
// export const isEqual = (value: unknown, other: unknown): boolean => {
//   if (value === other) return true;
//   const valueType = getValueType(value);
//   const otherType = getValueType(other);
//   if (valueType !== otherType) return false;
//   if (valueType === types.NaN && otherType === types.NaN) return true;
//   if (valueType === types.date && otherType === types.date) {
//     assertType<Date>(value);
//     assertType<Date>(other);
//     return value.getTime() === other.getTime();
//   }
//   if (valueType === types.function && otherType === types.function) {
//     assertType<() => void>(value);
//     assertType<() => void>(other);
//     return value.toString() === other.toString();
//   }
//   if (valueType === types.regexp && otherType === types.regexp) {
//     assertType<RegExp>(value);
//     assertType<RegExp>(other);
//     return value.source === other.source && value.flags === other.flags;
//   }

//   const isObject =
//     valueType === types.object ||
//     valueType === types.array ||
//     otherType === types.object ||
//     otherType === types.array;

//   if (!isObject) return value === other;

//   assertType<Obj>(value);
//   assertType<Obj>(other);

//   const valueKeys = Object.keys(value);
//   const otherKeys = Object.keys(other);

//   return (
//     valueKeys.length === otherKeys.length &&
//     !valueKeys.some((k) => (k in other ? !isEqual(value[k], other[k]) : true))
//   );
// };

const tests = [
  [{}, {}],
  [{ key: 'value' }, { key: 'value' }],
  [{ key: 1 }, { key: 1 }],
  [{ key: {} }, { key: {} }],
  [{ key: [1] }, { key: [1] }],
  [
    {
      key: NaN,
    },
    {
      key: NaN,
    },
  ],
  [
    {
      key: new Date(2020, 9, 25),
    },
    {
      key: new Date(2020, 9, 25),
    },
  ],
  [
    {
      key: [1, 2, { prop2: 1, prop: 2 }, 4, 5],
    },
    {
      key: [1, 2, { prop2: 1, prop: 2 }, 4, 5],
    },
  ],
  [
    {
      parent: {
        child: [
          {
            nested: {
              nested: {},
            },
          },
        ],
      },
    },
    {
      parent: {
        child: [
          {
            nested: {
              nested: {},
            },
          },
        ],
      },
    },
  ],
] as const;

describe('sort', () => {
  bench('lodash', () => {
    tests.forEach((test) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      _isEqual(test[0], test[1]);
    });
  });
  bench('nanoEqual', () => {
    tests.forEach((test) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      nanoEqual(test[0], test[1]);
    });
  });

  bench('fast-deep-equal', () => {
    tests.forEach((test) => {
      fastEqual(test[0], test[1]);
    });
  });

  // bench('isEqualOld', () => {
  //   tests.forEach((test) => {
  //     isEqualOld(test[0], test[1]);
  //   });
  // });

  bench('@gkiely/utils.isEqual', () => {
    tests.forEach((test) => {
      isEqual(test[0], test[1]);
    });
  });
});
