import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Only use it for a function that returns a Promise
export const debounceAsync = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => Promise<any>,
>(
  func: T,
  delay: number,
) => {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>): ReturnType<T> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    }) as ReturnType<T>;
  };
};

type CacheKey = string | number | boolean;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cacheLastResult<T extends (...args: any[]) => any>(fn: T): T {
  let lastArgs: CacheKey[] | null = null;
  let lastResult: ReturnType<T> | null = null;

  return function (...args: Parameters<T>): ReturnType<T> {
    // Check if the arguments are the same as the last call
    if (lastArgs && args.every((arg, index) => arg === lastArgs![index])) {
      return lastResult as ReturnType<T>;
    }

    // If not, call the function and cache the result
    lastResult = fn(...args);
    lastArgs = args as CacheKey[];

    return lastResult!;
  } as T;
}
