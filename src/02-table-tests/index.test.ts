import { simpleCalculator, Action } from './index';

describe('simpleCalculator', () => {
  const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Add, expected: 4 },
    { a: 3, b: 2, action: Action.Add, expected: 5 },
    { a: 5, b: 3, action: Action.Subtract, expected: 2 },
    { a: 4, b: 2, action: Action.Multiply, expected: 8 },
    { a: 8, b: 4, action: Action.Divide, expected: 2 },
    { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
    { a: 3, b: 2, action: '?', expected: null },
    { a: '3', b: 2, action: Action.Add, expected: null },
    { a: 3, b: '2', action: Action.Add, expected: null },
    { a: 3, b: 2, action: null, expected: null },
  ];

  test.each(testCases)(
    'should calculate $action for $a and $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
