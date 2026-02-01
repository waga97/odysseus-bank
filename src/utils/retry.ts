/**
 * Odysseus Bank - Retry Utility
 * Exponential backoff for transient network failures
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  shouldRetry: (error: Error) => error.message === 'NETWORK_ERROR',
};

/**
 * Executes an async function with exponential backoff retry for transient failures.
 *
 * By default, only retries on NETWORK_ERROR. Other errors (like INSUFFICIENT_FUNDS)
 * are thrown immediately without retry since they won't resolve on their own.
 *
 * Delay calculation: baseDelayMs * 2^(attempt-1), capped at maxDelayMs
 * - Attempt 1: immediate
 * - Attempt 2: 1000ms delay (if failed)
 * - Attempt 3: 2000ms delay (if failed)
 *
 * @param fn - Async function to execute
 * @param options - Retry configuration
 * @param options.maxAttempts - Maximum retry attempts (default: 3)
 * @param options.baseDelayMs - Initial delay in milliseconds (default: 1000)
 * @param options.maxDelayMs - Maximum delay cap (default: 10000)
 * @param options.shouldRetry - Function to determine if error is retryable
 *
 * @returns Promise resolving to the function's result
 * @throws The last error if all attempts fail or error is not retryable
 *
 * @example
 * const result = await withRetry(
 *   () => api.executeTransfer(request),
 *   { maxAttempts: 3, baseDelayMs: 1000 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry this error
      if (!config.shouldRetry(lastError)) {
        throw lastError;
      }

      // Don't wait after final attempt
      if (attempt === config.maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelayMs * Math.pow(2, attempt - 1),
        config.maxDelayMs
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Checks if an error is retryable (transient network error).
 * Used by withRetry as the default shouldRetry function.
 *
 * @param error - The error to check
 * @returns true if the error is a transient network error that may resolve on retry
 */
export function isRetryableError(error: Error): boolean {
  return error.message === 'NETWORK_ERROR';
}
