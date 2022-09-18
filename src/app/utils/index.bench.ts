import { bench, describe } from 'vitest';

export function assertType<T>(_value: unknown): asserts _value is T {}

const types = {
  NaN: 'NaN',
  object: 'object',
  array: 'array',
  number: 'number',
} as const;

type Obj = Record<string, unknown>;

const getValueTypeOld = (value: unknown) => {
  const t = typeof value;
  if (t === types.object && Array.isArray(value)) return 'array';
  if (t === types.object && value !== null) return 'object';
  if (t === types.number && Number.isNaN(value)) return 'NaN';
  return t;
};

const getValueType = (value: unknown) => {
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

export const isEqual = (value: unknown, other: unknown): boolean => {
  if (value === other) return true;
  const valueType = getValueType(value);
  const otherType = getValueType(other);
  if (valueType !== otherType) return false;
  if (valueType === types.NaN && otherType === types.NaN) return true;

  const hasObject =
    valueType === types.object ||
    valueType === types.array ||
    otherType === types.object ||
    otherType === types.array;

  if (!hasObject) return value === other;

  assertType<Obj>(value);
  assertType<Obj>(other);

  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);
  if (valueKeys.length === 0 && otherKeys.length === 0) return true;

  return (
    valueKeys.length === otherKeys.length && !valueKeys.some((k) => !isEqual(value[k], other[k]))
  );
};

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
  bench('normal', () => {
    tests.forEach((test) => {
      isEqualOld(test[0], test[1]);
    });
  });

  bench('updated', () => {
    tests.forEach((test) => {
      isEqual(test[0], test[1]);
    });
  });
});
