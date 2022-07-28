import { useEffect, useRef } from "react";

export type UseDebounceFn<T> = (...args: T[]) => void;
function useDebounce<T>(
  debounceFn: UseDebounceFn<T>,
  time = 200,
): UseDebounceFn<T> {
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (...args: T[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => debounceFn(...args), time);
  };
}

export default useDebounce;
