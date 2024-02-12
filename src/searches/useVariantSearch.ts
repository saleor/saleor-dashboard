import { gql } from "@apollo/client";
import {
  SearchVariantsDocument,
  SearchVariantsQueryVariables,
  SearchVariantsWithProductDataDocument,
  SearchVariantsWithProductDataQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch, {
  SearchData,
} from "@dashboard/hooks/makeTopLevelSearch";

export const searchVariants = gql`
  query SearchVariants(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
  ) {
    search: productVariants(
      after: $after
      first: $first
      filter: { search: $query }
      channel: $channel
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
    }
  }
`;

export const searchVariantsWithProductData = gql`
  query SearchVariantsWithProductData(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
  ) {
    search: productVariants(
      after: $after
      first: $first
      filter: { search: $query }
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          product {
            name
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<SearchData, SearchVariantsQueryVariables>(
  SearchVariantsDocument,
);

export const useVariantWithProductDataSearch = makeTopLevelSearch<
  SearchData,
  SearchVariantsWithProductDataQueryVariables
>(SearchVariantsWithProductDataDocument);
