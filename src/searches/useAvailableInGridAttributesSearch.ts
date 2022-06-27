import { gql } from "@apollo/client";
import {
  SearchAvailableInGridAttributesDocument,
  SearchAvailableInGridAttributesQuery,
  SearchAvailableInGridAttributesQueryVariables,
} from "@saleor/graphql";
import makeSearch from "@saleor/hooks/makeSearch";

export const availableInGridAttributes = gql`
  query SearchAvailableInGridAttributes(
    $first: Int!
    $after: String
    $query: String!
  ) {
    availableInGrid: attributes(
      first: $first
      after: $after
      filter: { isVariantOnly: false, type: PRODUCT_TYPE, search: $query }
    ) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
      totalCount
    }
  }
`;

export default makeSearch<
  SearchAvailableInGridAttributesQuery,
  SearchAvailableInGridAttributesQueryVariables
>(SearchAvailableInGridAttributesDocument, result => {
  if (result.data?.availableInGrid.pageInfo.hasNextPage) {
    result.loadMore(
      (prev, next) => {
        if (
          prev.availableInGrid.pageInfo.endCursor ===
          next.availableInGrid.pageInfo.endCursor
        ) {
          return prev;
        }

        return {
          ...prev,
          availableInGrid: {
            ...prev.availableInGrid,
            edges: [
              ...prev.availableInGrid.edges,
              ...next.availableInGrid.edges,
            ],
            pageInfo: next.availableInGrid.pageInfo,
          },
        } as SearchAvailableInGridAttributesQuery;
      },
      {
        ...result.variables,
        after: result.data.availableInGrid.pageInfo.endCursor,
      },
    );
  }
});
