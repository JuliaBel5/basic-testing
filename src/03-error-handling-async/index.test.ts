import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const input = 42;
    const result = await resolveValue(input);
    expect(result).toBe(input);
  });

  test('should resolve string value', async () => {
    const input = 'Hello, world!';
    const result = await resolveValue(input);
    expect(result).toBe(input);
  });

  test('should resolve null value', async () => {
    const result = await resolveValue(null);
    expect(result).toBeNull();
  });

  test('should resolve undefined value', async () => {
    const result = await resolveValue(undefined);
    expect(result).toBeUndefined();
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'Custom error message';
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );
  });
});
