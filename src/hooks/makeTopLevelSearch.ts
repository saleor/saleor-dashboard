import { PageInfoFragment } from "@saleor/fragments/types/PageInfoFragment";
import { DocumentNode } from "graphql";

import makeSearch, { SearchVariables, UseSearchHook } from "./makeSearch";

export interface SearchData {
  search: {
    edges: Array<{
      node: any;
    }>;
    pageInfo: PageInfoFragment;
  };
}

function makeTopLevelSearch<
  TData extends SearchData,
  TVariables extends SearchVariables
>(query: DocumentNode): UseSearchHook<TData, TVariables> {
  return makeSearch<TData, TVariables>(query, result => {
    if (result.data.search.pageInfo.hasNextPage) {
      result.loadMore(
        (prev, next) => {
          if (
            prev.search.pageInfo.endCursor === next.search.pageInfo.endCursor
          ) {
            return prev;
          }

          return {
            ...prev,
            search: {
              ...prev.search,
              edges: [...prev.search.edges, ...next.search.edges],
              pageInfo: next.search.pageInfo
            }
          };
        },
        {
          ...result.variables,
          after: result.data.search.pageInfo.endCursor
        }
      );
    }
  });
}

export default makeTopLevelSearch;
