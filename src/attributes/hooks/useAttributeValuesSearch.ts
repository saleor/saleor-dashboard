import useDebounce from "@dashboard/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

interface UseAttributeValuesSearchProps {
  onResetPagination: () => void;
}

interface UseAttributeValuesSearchResult {
  /** Current search input value (updates immediately) */
  searchQuery: string;
  /** Debounced search value (for API queries) */
  debouncedSearchQuery: string;
  /** Handler for search input changes */
  handleSearchChange: (query: string) => void;
}

/**
 * Hook for managing attribute values search with debouncing.
 * Handles the search input state, debouncing, and pagination reset on search change.
 */
export function useAttributeValuesSearch({
  onResetPagination,
}: UseAttributeValuesSearchProps): UseAttributeValuesSearchResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const previousSearchRef = useRef("");

  // Debounce the search query update
  const updateDebouncedQuery = useDebounce((query: string) => {
    setDebouncedSearchQuery(query);
  }, SEARCH_DEBOUNCE_MS);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateDebouncedQuery(query);
  };

  // Reset pagination when debounced search changes (but not on initial mount)
  useEffect(() => {
    const isInitialMount = previousSearchRef.current === "" && debouncedSearchQuery === "";

    if (!isInitialMount && previousSearchRef.current !== debouncedSearchQuery) {
      onResetPagination();
    }

    previousSearchRef.current = debouncedSearchQuery;
  }, [debouncedSearchQuery, onResetPagination]);

  return {
    searchQuery,
    debouncedSearchQuery,
    handleSearchChange,
  };
}
