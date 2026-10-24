import { useCallback, useEffect, useRef } from "react";

/** Keeps a callback identity stable while always calling the latest function. */
export function useStableCallback<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
): (...args: Args) => Result {
  const callbackRef = useRef(callback);

  useEffect(function syncStableCallback() {
    callbackRef.current = callback;
  });

  return useCallback((...args: Args) => callbackRef.current(...args), []);
}
