import { DependencyList, useEffect, useRef } from "react";

/**
 * Autofocuses DOM element when it's mounted.
 * @param condition condition on which autofocus should be triggered (defaults to true)
 * @param deps useEffect dependency array
 * @returns React ref to attach to focusable DOM element.
 */
export function useAutofocus(condition = true, deps: DependencyList) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && condition) {
      ref.current.focus();
    }
  }, deps);

  return ref;
}
