import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import useDebounce from "./useDebounce";

export interface UseModalSearchWithFiltersOptions<TFilterVariables> {
  /**
   * Filter variables to combine with search query.
   * Changes trigger immediate fetch (no debounce).
   */
  filterVariables: TFilterVariables;
  /**
   * Whether the modal is open.
   * Search only triggers when modal is open.
   */
  open: boolean;
  /**
   * Callback triggered when search should be performed.
   * Receives current filter variables and query string.
   * Return the request's promise (e.g. Apollo `refetch`) to get `isSearching`.
   */
  onFetch?: (filterVariables: TFilterVariables, query: string) => void | PromiseLike<unknown>;
  /**
   * Debounce time in milliseconds for query changes.
   * @default 200
   */
  debounceMs?: number;
  /**
   * Initial query value.
   * @default ""
   */
  initialQuery?: string;
  /**
   * Skip the fetch triggered when the modal opens. Use when the parent view
   * already issued a constrained search for reference attributes.
   * @default false
   */
  skipFetchOnOpen?: boolean;
}

export interface UseModalSearchWithFiltersResult {
  /**
   * Current query string value.
   */
  query: string;
  /**
   * Handler for query input change events.
   */
  onQueryChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /**
   * Reset query to initial value (empty string by default).
   */
  resetQuery: () => void;
  /**
   * A search is pending: from the keystroke, through the debounce, until the latest request
   * settles. Stays false when `onFetch` returns no promise, as there is nothing to wait on.
   */
  isSearching: boolean;
}

/**
 * Generic hook for managing modal search with filters.
 *
 * Behavior:
 * - Query changes are debounced (user is typing)
 * - Filter changes trigger immediate fetch (user saved filters)
 * - Both query and filters are combined in a single onFetch call
 * - `isSearching` tracks the latest request when onFetch returns its promise
 *
 * @example
 * ```typescript
 * interface MyFilters {
 *   category?: string;
 *   status?: string;
 * }
 *
 * const { query, onQueryChange, resetQuery } = useModalSearchWithFilters<MyFilters>({
 *   filterVariables: { category: "shoes" },
 *   open: isDialogOpen,
 *   onFetch: (filters, query) => {
 *     refetch({ ...filters, search: query });
 *   },
 * });
 * ```
 */
export function useModalSearchWithFilters<TFilterVariables>({
  filterVariables,
  open,
  onFetch,
  debounceMs = 200,
  initialQuery = "",
  skipFetchOnOpen = false,
}: UseModalSearchWithFiltersOptions<TFilterVariables>): UseModalSearchWithFiltersResult {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Serialize filterVariables to detect filter changes
  const filterVariablesKey = useMemo(() => JSON.stringify(filterVariables), [filterVariables]);

  // Store current values in ref for debounced function to read latest values
  const searchParamsRef = useRef({ filterVariables, query, open });
  const skipOpenFetchesRemainingRef = useRef(0);
  // Only the newest request may clear `isSearching`: an older one settling late must not hide
  // the spinner while the results on screen still belong to an earlier query.
  const latestFetchIdRef = useRef(0);
  // Learned from the first fetch, so a caller whose onFetch returns nothing never gets a spinner
  // on keystroke that no request would clear.
  const fetchReturnsPromiseRef = useRef(false);

  searchParamsRef.current = { filterVariables, query, open };

  const runFetch = (filterVariables: TFilterVariables, query: string): void => {
    const fetchId = ++latestFetchIdRef.current;
    const request = onFetch?.(filterVariables, query);

    if (!isPromiseLike(request)) {
      // Nothing to wait on, and this fetch supersedes any request still pending, so whatever
      // the keystroke started is over.
      setIsSearching(false);

      return;
    }

    fetchReturnsPromiseRef.current = true;

    // A debounced fetch can still fire after the dialog closed. It may end a pending state
    // (one the closing keystroke left behind) but must not start one.
    if (searchParamsRef.current.open) {
      setIsSearching(true);
    }

    const settle = (): void => {
      if (fetchId === latestFetchIdRef.current) {
        setIsSearching(false);
      }
    };

    // Query errors are reported by the query hook itself; this only ends the pending state.
    request.then(settle, settle);
  };

  const consumeSkipOpenFetch = (): boolean => {
    if (skipOpenFetchesRemainingRef.current <= 0) {
      return false;
    }

    skipOpenFetchesRemainingRef.current -= 1;

    return true;
  };

  // Debounced search trigger - reads current values from ref
  const debouncedSearch = useDebounce(() => {
    const { filterVariables, query } = searchParamsRef.current;

    runFetch(filterVariables, query);
  }, debounceMs);

  useEffect(() => {
    if (!open) {
      skipOpenFetchesRemainingRef.current = 0;

      return;
    }

    if (skipFetchOnOpen) {
      // Both open effects (immediate filter fetch + debounced query fetch) are skipped once.
      skipOpenFetchesRemainingRef.current = 2;
    }
  }, [open, skipFetchOnOpen]);

  // Trigger debounced search when query changes
  useEffect(() => {
    if (!open) {
      return;
    }

    if (consumeSkipOpenFetch()) {
      return;
    }

    debouncedSearch();
  }, [query, open]);

  // Trigger immediate search when filter variables change (user saved filters)
  useEffect(() => {
    if (!open) {
      return;
    }

    if (consumeSkipOpenFetch()) {
      return;
    }

    runFetch(filterVariables, query);
  }, [filterVariablesKey, open]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setQuery(event.target.value);

    // Feedback starts with the keystroke, not when the debounced request goes out.
    if (fetchReturnsPromiseRef.current) {
      setIsSearching(true);
    }
  };

  const resetQuery = (): void => {
    setQuery(initialQuery);
  };

  return {
    query,
    onQueryChange,
    resetQuery,
    // A closed dialog has nothing to show progress on; a request still settling clears the state.
    isSearching: open && isSearching,
  };
}

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | undefined)?.then === "function";
