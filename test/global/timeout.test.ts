import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from '../../lib/index.js';

describe('Timeout Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should sleep for specified duration', async () => {
    const promise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await promise;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should resolve after timeout with real timers', async () => {
    // Temporarily use real timers for this specific test
    vi.useRealTimers();

    // Simple test to ensure the promise resolves
    const promise = sleep(1);
    await expect(promise).resolves.toBeUndefined();

    // Restore fake timers for other tests
    vi.useFakeTimers();
  }, 100); // Set a short timeout for this test since we're only waiting 1ms

  it('should handle zero timeout', async () => {
    const promise = sleep(0);
    vi.advanceTimersByTime(0);
    await promise;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should handle negative timeout', async () => {
    const promise = sleep(-1);
    vi.advanceTimersByTime(0);
    await promise;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should properly set timeout duration', () => {
    const promise = sleep(500);
    const timers = vi.getTimerCount();
    expect(timers).toBe(1);

    // Advance time and clean up
    vi.advanceTimersByTime(500);
    return promise;
  });
});
