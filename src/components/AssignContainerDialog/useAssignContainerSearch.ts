import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { type ChangeEvent } from "react";

interface ExternalSearch {
  query: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  resetQuery: () => void;
}

interface UseAssignContainerSearchProps {
  onFetch: (value: string) => void;
  externalSearch?: ExternalSearch;
  onClose: () => void;
  onResetFilters?: () => void;
}

export function useAssignContainerSearch({
  onFetch,
  externalSearch,
  onClose,
  onResetFilters,
}: UseAssignContainerSearchProps) {
  const [internalQuery, internalOnQueryChange, internalResetQuery] = useSearchQuery(onFetch);

  const query = externalSearch?.query ?? internalQuery;
  const onQueryChange = externalSearch?.onQueryChange ?? internalOnQueryChange;
  const resetQuery = externalSearch?.resetQuery ?? internalResetQuery;

  const handleClose = () => {
    resetQuery();
    onResetFilters?.();
    onClose();
  };

  return { query, onQueryChange, handleClose };
}
