import { useEffect, useRef } from "react";

export type UseDebounceFn<T> = (...args: T[]) => void;
function useDebounce<T>(debounceFn: UseDebounceFn<T>, time = 200): UseDebounceFn<T> {
  const timer = useRef<number | null>(null);

  useEffect(() => () => window.clearTimeout(timer.current as number), []);

  return (...args: T[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => debounceFn(...args), time);
  };
}

export default useDebounce;
