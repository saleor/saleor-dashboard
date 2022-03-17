import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): [T | undefined, (value: T) => void] {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  const setValue = (value: T) => (ref.current = value);

  return [ref.current, setValue];
}
