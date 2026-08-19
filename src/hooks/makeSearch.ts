// @ts-strict-ignore
import { type QueryResult } from "@apollo/client";
import { type DocumentNode } from "graphql";
import { useState } from "react";

import makeQuery, { type UseQueryResult } from "./makeQuery";
import useDebounce from "./useDebounce";

export interface BaseSearchVariables {
  after?: string | null;
  first: number;
}

export interface SearchVariables extends BaseSearchVariables {
  query: string;
}

export interface UseSearchResult<TData, TVariables extends BaseSearchVariables> {
  /**
   * Loads the next page. Returns `false` when there is no next page to fetch
   * (so callers like picker backfill can stop waiting). Otherwise void/Promise.
   */
  loadMore: () => false | void | Promise<unknown>;
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
  // `search()` owns searchQuery. Assign pickers drive query through React variables /
  // onFilterChange instead — only overwrite when search() has a value, otherwise keep
  // variables.query so a parent-owned query is not reset to "" on every render.
  query: searchQuery || variables.query || "",
});

function makeSearch<TData, TVariables extends BaseSearchVariables>(
  query: DocumentNode,
  loadMoreFn: (result: UseQueryResult<TData, TVariables>) => false | void | Promise<unknown>,
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

    // Consumers and loadMore must see the same data. During skip toggles / variable
    // changes Apollo may clear `data` while `previousData` still has the last page —
    // if loadMore read raw `data` it would silently no-op while `hasMore` (from the
    // wrapped result) stayed true, which leaves assign-picker backfill spinning forever.
    const data = result.data ?? result.previousData;
    const resultWithData = {
      ...result,
      data,
    };

    return {
      query: searchQuery,
      loadMore: () => loadMoreFn(resultWithData),
      result: resultWithData,
      search: debouncedSearch,
    };
  }

  return useSearch;
}

export default makeSearch;
