// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchProductsDocument,
  SearchProductsQuery,
  SearchProductsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchProducts = gql`
  query SearchProducts(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
    $where: ProductWhereInput
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
