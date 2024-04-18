import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { FetchMoreProps } from "@dashboard/types";
import { useCallback, useRef } from "react";

export const useComboboxHandlers = ({
  fetchOptions,
  fetchMore,
  alwaysFetchOnFocus,
}: {
  fetchOptions: (data: string) => void;
  fetchMore?: FetchMoreProps;
  alwaysFetchOnFocus?: boolean;
}) => {
  const mounted = useRef(false);
  const debouncedFetchOptions = useCallback(
    useDebounce(async (value: string) => {
      fetchOptions(value);
    }, 500),
    [fetchOptions],
  );
  const handleFetchMore = () => {
    if (fetchMore?.hasMore) {
      fetchMore?.onFetchMore();
    }
  };
  const handleInputChange = (value: string) => {
    debouncedFetchOptions(value);
  };
  const handleFocus = () => {
    if (alwaysFetchOnFocus || !mounted.current) {
      mounted.current = true;
      fetchOptions(DEFAULT_INITIAL_SEARCH_DATA.query);
    }
  };

  return {
    handleFetchMore,
    handleInputChange,
    handleFocus,
  };
};
