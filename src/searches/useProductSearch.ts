// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchProductsDocument,
  type SearchProductsQuery,
  type SearchProductsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchProducts = gql`
  query SearchProducts(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
    $where: ProductWhereInput
    $includeVariants: Boolean! = false
  ) {
    search: products(
      after: $after
      first: $first
      search: $query
      channel: $channel
      where: $where
    ) {
      edges {
        node {
          ...SearchProduct
          productVariants(first: 20) @include(if: $includeVariants) {
            totalCount
            edges {
              node {
                ...SearchProductVariant
              }
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<SearchProductsQuery, SearchProductsQueryVariables>(
  SearchProductsDocument,
);
