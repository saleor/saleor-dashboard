import { useEffect, useRef } from "react";
import { useHistory } from "react-router";

const toComparablePathname = (pathname: string): string => {
  // History can hold `entityUrl(id)` with a trailing `?` in pathname, ids may be encoded, and the
  // same route can be written with or without a trailing slash.
  const path = pathname.split("?")[0].replace(/\/+$/, "") || "/";

  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
};

/**
 * Modal pickers keep their filters in the page's numeric URL keys, and every picker on the page
 * reads those keys. Clear them when the picker unmounts so the next picker doesn't parse filters
 * it doesn't support. When the picker unmounts because the user left the page, the keys belong to
 * the new page, so leave them alone.
 */
export const useClearModalFiltersOnUnmount = (clearFilters: () => void): void => {
  const history = useHistory();
  const clearFiltersRef = useRef(clearFilters);

  // Refs can't be written during render (React Compiler rule), so keep the latest in an effect.
  useEffect(
    function keepLatestClearFilters() {
      clearFiltersRef.current = clearFilters;
    },
    [clearFilters],
  );

  useEffect(
    function clearModalFiltersOnUnmount() {
      const mountedPathname = toComparablePathname(history.location.pathname);

      return (): void => {
        if (toComparablePathname(history.location.pathname) === mountedPathname) {
          clearFiltersRef.current();
        }
      };
    },
    [history],
  );
};
