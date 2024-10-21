import axios, { AxiosInstance } from 'axios';
import { THROTTLE_TIME, throttledGetDataFromApi } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  let mockAxios: jest.Mocked<typeof axios>;
  let mockGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios = axios as jest.Mocked<typeof axios>;
    jest.useFakeTimers();

    mockGet = jest
      .fn()
      .mockResolvedValue({ data: { id: 1, title: 'Test post' } });
    mockAxios.create.mockReturnValue({
      get: mockGet,
      defaults: { headers: {} },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      getUri: jest.fn(),
      request: jest.fn(),
    } as unknown as AxiosInstance);
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi('/posts');

    expect(mockGet).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
    const testData = { id: 1, title: 'Test post' };
    mockGet.mockResolvedValueOnce({ data: testData });
    const result = await throttledGetDataFromApi('/posts');

    expect(result).toEqual(testData);
  });

  test('should throttle the API requests', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: 'mockData' });

    mockAxios.create.mockReturnValue({
      get: mockGet,
      defaults: { headers: {} },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      getUri: jest.fn(),
      request: jest.fn(),
    } as unknown as AxiosInstance);

    await throttledGetDataFromApi('/posts');
    await throttledGetDataFromApi('/posts');

    jest.advanceTimersByTime(THROTTLE_TIME);
    const result = await throttledGetDataFromApi('/posts');

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result).toEqual('mockData');
  });
});
