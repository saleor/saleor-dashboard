import { useCallback, useSyncExternalStore } from "react";

const canMatchMedia = (): boolean => typeof window.matchMedia === "function";

/**
 * Whether the viewport matches a CSS media query, updated as the viewport changes.
 * Reports `false` where media queries are unavailable (jsdom).
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      if (!canMatchMedia()) {
        return () => {};
      }

      const mediaQueryList = window.matchMedia(query);

      mediaQueryList.addEventListener("change", onChange);

      return (): void => mediaQueryList.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(subscribe, () => canMatchMedia() && window.matchMedia(query).matches);
};
