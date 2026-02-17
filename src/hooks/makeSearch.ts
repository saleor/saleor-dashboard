// @ts-strict-ignore
import { QueryResult } from "@apollo/client";
import { DocumentNode } from "graphql";
import { useState } from "react";

import makeQuery, { UseQueryResult } from "./makeQuery";
import useDebounce from "./useDebounce";

export interface BaseSearchVariables {
  after?: string | null;
  first: number;
}

export interface SearchVariables extends BaseSearchVariables {
  query: string;
}

export interface UseSearchResult<TData, TVariables extends BaseSearchVariables> {
  loadMore: () => void;
  result: QueryResult<TData, TVariables>;
  search: (query: string) => void;
  query: string;
}
type UseSearchOpts<TVariables extends BaseSearchVariables> = Partial<{
  skip: boolean;
  variables: TVariables;
}>;
export type UseSearchHook<TData, TVariables extends BaseSearchVariables> = (
  opts: UseSearchOpts<TVariables>,
) => UseSearchResult<TData, TVariables>;

interface MakeSearchOptions<TVariables extends BaseSearchVariables> {
  mapSearchToVariables?: (searchQuery: string, variables: TVariables) => TVariables;
}

const defaultMapSearchToVariables = <TVariables extends SearchVariables>(
  searchQuery: string,
  variables: TVariables,
): TVariables => ({
  ...variables,
  query: searchQuery,
});

function makeSearch<TData, TVariables extends BaseSearchVariables>(
  query: DocumentNode,
  loadMoreFn: (result: UseQueryResult<TData, TVariables>) => void,
  options?: MakeSearchOptions<TVariables>,
): UseSearchHook<TData, TVariables> {
  const useSearchQuery = makeQuery<TData, TVariables>(query);
  const mapSearchToVariables =
    options?.mapSearchToVariables ??
    (defaultMapSearchToVariables as (searchQuery: string, variables: TVariables) => TVariables);

  function useSearch(opts: UseSearchOpts<TVariables>): UseSearchResult<TData, TVariables> {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(setSearchQuery);
    const result = useSearchQuery({
      ...opts,
      displayLoader: true,
      variables: mapSearchToVariables(searchQuery, opts.variables as TVariables),
    });

    return {
      query: searchQuery,
      loadMore: () => loadMoreFn(result),
      result,
      search: debouncedSearch,
    };
  }

  return useSearch;
}

export default makeSearch;
