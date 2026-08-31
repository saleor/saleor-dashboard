// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchProductsDocument,
  type SearchProductsQuery,
  type SearchProductsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

/**
 * Variants page size when includeVariants is true. Keep in sync with
 * SEARCH_PRODUCT_VARIANTS_PAGE_SIZE (not load-more page size — see fragments).
 */
export const searchProducts = gql`
  query SearchProducts(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
    $where: ProductWhereInput
    $includeVariants: Boolean = false
    # makeQuery injects the caller's real permissions; the default only keeps this variable out
    # of the hook's caller-facing types (makeSearch does not strip PERMISSION_* like makeQuery)
    # and fails safe by omitting the gated field.
    $PERMISSION_MANAGE_PRODUCTS: Boolean = false
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
            pageInfo {
              hasNextPage
              endCursor
            }
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
