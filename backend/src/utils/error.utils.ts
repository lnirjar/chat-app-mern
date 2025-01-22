/* eslint-disable @typescript-eslint/no-explicit-any */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error("Error:", (error as Error).message);
      return null;
    }
  };
}
