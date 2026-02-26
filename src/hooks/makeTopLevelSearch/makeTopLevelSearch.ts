// @ts-strict-ignore
import { type PageInfoFragment } from "@dashboard/graphql";
import { type DocumentNode } from "graphql";

import makeSearch, { type BaseSearchVariables, type UseSearchHook } from "../makeSearch";

export interface SearchData {
  search: {
    edges: Array<{
      node: any;
    }>;
    pageInfo: PageInfoFragment;
  };
}

export interface ResultSearchData {
  data: SearchData;
}

interface MakeTopLevelSearchOptions<TVariables extends BaseSearchVariables> {
  mapSearchToVariables?: (searchQuery: string, variables: TVariables) => TVariables;
}

function makeTopLevelSearch<TData extends SearchData, TVariables extends BaseSearchVariables>(
  query: DocumentNode,
  options?: MakeTopLevelSearchOptions<TVariables>,
): UseSearchHook<TData, TVariables> {
  return makeSearch<TData, TVariables>(
    query,
    result => {
      if (result?.data?.search?.pageInfo?.hasNextPage) {
        result.loadMore(
          (prev, next) => {
            if (prev.search?.pageInfo?.endCursor === next.search?.pageInfo?.endCursor) {
              return prev;
            }

            return {
              ...prev,
              search: {
                ...prev.search,
                edges: [...(prev.search?.edges ?? []), ...(next.search?.edges ?? [])],
                pageInfo: next.search.pageInfo,
              },
            };
          },
          {
            ...result.variables,
            after: result.data.search.pageInfo.endCursor,
          },
        );
      }
    },
    options,
  );
}

export default makeTopLevelSearch;
