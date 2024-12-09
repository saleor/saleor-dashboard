import * as React from "react";

/**
 * Autofocuses DOM element when it's mounted.
 * @param condition condition on which autofocus should be triggered (defaults to true)
 * @param deps useEffect dependency array
 * @returns React ref to attach to focusable DOM element.
 */
export function useAutofocus(condition = true, deps: React.DependencyList) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current && condition) {
      ref.current.focus();
    }
  }, deps);

  return ref;
}
