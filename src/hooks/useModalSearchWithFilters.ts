import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

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
   */
  onFetch?: (filterVariables: TFilterVariables, query: string) => void;
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
}

/**
 * Generic hook for managing modal search with filters.
 *
 * Behavior:
 * - Query changes are debounced (user is typing)
 * - Filter changes trigger immediate fetch (user saved filters)
 * - Both query and filters are combined in a single onFetch call
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
}: UseModalSearchWithFiltersOptions<TFilterVariables>): UseModalSearchWithFiltersResult {
  const [query, setQuery] = useState(initialQuery);

  // Serialize filterVariables to detect filter changes
  const filterVariablesKey = useMemo(() => JSON.stringify(filterVariables), [filterVariables]);

  // Store current values in ref for debounced function to read latest values
  const searchParamsRef = useRef({ filterVariables, query });

  searchParamsRef.current = { filterVariables, query };

  // Debounced search trigger - reads current values from ref
  const debouncedSearch = useDebounce(() => {
    const { filterVariables, query } = searchParamsRef.current;

    onFetch?.(filterVariables, query);
  }, debounceMs);

  // Trigger debounced search when query changes
  useEffect(() => {
    if (open) {
      debouncedSearch();
    }
  }, [query, open]);

  // Trigger immediate search when filter variables change (user saved filters)
  useEffect(() => {
    if (open) {
      onFetch?.(filterVariables, query);
    }
  }, [filterVariablesKey, open]);

  const onQueryChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setQuery(event.target.value);
  };

  const resetQuery = (): void => {
    setQuery(initialQuery);
  };

  return {
    query,
    onQueryChange,
    resetQuery,
  };
}
