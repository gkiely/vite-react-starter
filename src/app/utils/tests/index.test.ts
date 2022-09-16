import { isEqual } from '../';

describe('isEqual', () => {
  test.each([
    [{}, {}],
    [{ key: 'value' }, { key: 'value' }],
    [{ key: {} }, { key: {} }],
    [{ key: [1] }, { key: [1] }],
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
  ])('isEqual(%o, %o) -> true', (value, other) => {
    expect(isEqual(value, other)).toBe(true);
  });

  test.each([
    [{ key: '1' }, { k: '1' }],
    [{ key: {} }, { k: '1' }],
    [{ key: {} }, { key: [] }],
    [{}, { k: '1' }],
    [{}, []],
  ])('isEqual(%o, %o) -> false', (value, other) => {
    expect(isEqual(value, other)).toBe(false);
  });
});
