import { useEffect, useRef } from "react";

/**
 * https://usehooks.com/usePrevious/
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
