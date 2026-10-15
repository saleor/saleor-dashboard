import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { type ChangeEvent } from "react";

interface ExternalSearch {
  query: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  resetQuery: () => void;
  isSearching?: boolean;
}

interface UseAssignContainerSearchProps {
  onFetch: (value: string) => void;
  externalSearch?: ExternalSearch;
  onClose: () => void;
  onResetFilters?: () => void;
  loading: boolean;
}

export function useAssignContainerSearch({
  onFetch,
  externalSearch,
  onClose,
  onResetFilters,
  loading,
}: UseAssignContainerSearchProps) {
  const [internalQuery, internalOnQueryChange, internalResetQuery] = useSearchQuery(onFetch);

  const query = externalSearch?.query ?? internalQuery;
  const onQueryChange = externalSearch?.onQueryChange ?? internalOnQueryChange;
  const resetQuery = externalSearch?.resetQuery ?? internalResetQuery;
  // `loading` misses searches that run as an Apollo `refetch`; the caller reports those itself.
  const isSearching = externalSearch?.isSearching ?? false;

  const handleClose = () => {
    resetQuery();
    onResetFilters?.();
    onClose();
  };

  return {
    query,
    onQueryChange,
    handleClose,
    isSearching,
    showSearchProgress: loading || isSearching,
  };
}
