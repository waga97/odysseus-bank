/**
 * Tests for retry utility with exponential backoff
 */

import { withRetry, isRetryableError } from '../retry';

describe('withRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns result on first successful attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const result = await withRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on NETWORK_ERROR and succeeds', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('NETWORK_ERROR'))
      .mockResolvedValueOnce('success');

    const promise = withRetry(fn, { maxAttempts: 3, baseDelayMs: 100 });

    // Fast-forward through the delay
    await jest.runAllTimersAsync();

    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after max attempts exceeded', async () => {
    jest.useRealTimers(); // Use real timers for this test

    const fn = jest.fn().mockRejectedValue(new Error('NETWORK_ERROR'));

    await expect(
      withRetry(fn, { maxAttempts: 2, baseDelayMs: 10 })
    ).rejects.toThrow('NETWORK_ERROR');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry non-retryable errors', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('INSUFFICIENT_FUNDS'));

    await expect(withRetry(fn)).rejects.toThrow('INSUFFICIENT_FUNDS');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('respects custom shouldRetry function', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('CUSTOM_ERROR'))
      .mockResolvedValueOnce('success');

    const promise = withRetry(fn, {
      maxAttempts: 3,
      baseDelayMs: 100,
      shouldRetry: (error) => error.message === 'CUSTOM_ERROR',
    });

    await jest.runAllTimersAsync();

    const result = await promise;

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('isRetryableError', () => {
  it('returns true for NETWORK_ERROR', () => {
    expect(isRetryableError(new Error('NETWORK_ERROR'))).toBe(true);
  });

  it('returns false for other errors', () => {
    expect(isRetryableError(new Error('INSUFFICIENT_FUNDS'))).toBe(false);
    expect(isRetryableError(new Error('DAILY_LIMIT_EXCEEDED'))).toBe(false);
  });
});
