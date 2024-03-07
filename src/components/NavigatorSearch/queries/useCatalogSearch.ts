import {
  SearchCatalogQueryHookResult,
  useSearchCatalogQuery,
} from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { useState } from "react";

type UseSearchCatalog = [SearchCatalogQueryHookResult, (query: string) => void];
function useSearchCatalog(first: number): UseSearchCatalog {
  const [query, setQuery] = useState("");
  const setQueryDebounced = useDebounce(setQuery);
  const result = useSearchCatalogQuery({
    skip: query === "",
    variables: {
      first,
      query,
    },
  });

  return [result, setQueryDebounced];
}
export default useSearchCatalog;
