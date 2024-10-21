import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 100);

    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 100);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 100);

    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 100);

    jest.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const testFilePath = 'test.txt';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call join with pathToFile', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from('File content'));

    await readFileAsynchronously(testFilePath);

    expect(join).toHaveBeenCalledWith(__dirname, testFilePath);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously(testFilePath);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from('File content'));

    const result = await readFileAsynchronously(testFilePath);

    expect(result).toBe('File content');
  });
});
