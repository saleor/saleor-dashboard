import { DocumentNode } from "graphql";

import { PageInfoFragment } from "@saleor/types/PageInfoFragment";
import BaseSearch, { SearchQueryVariables } from "./BaseSearch";

export interface SearchQuery {
  search: {
    edges: Array<{
      node: any;
    }>;
    pageInfo: PageInfoFragment;
  };
}

function TopLevelSearch<
  TQuery extends SearchQuery,
  TQueryVariables extends SearchQueryVariables
>(query: DocumentNode) {
  return BaseSearch<TQuery, TQueryVariables>(query, result => {
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

export default TopLevelSearch;
