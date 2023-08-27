/**
 * A simple promise based setTimout.
 * @param timeout - Sleep duration in milliseconds.
 */
export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
