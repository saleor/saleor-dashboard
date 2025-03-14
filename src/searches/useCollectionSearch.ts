// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchCollectionsDocument,
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables,
  SearchCollectionsWithTotalProductsDocument,
  SearchCollectionsWithTotalProductsQuery,
  SearchCollectionsWithTotalProductsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchCollections = gql`
  query SearchCollections($after: String, $first: Int!, $query: String!, $channel: String) {
    search: collections(
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

export const searchCollectionWithTotalProducts = gql`
  query SearchCollectionsWithTotalProducts(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
  ) {
    search: collections(
      after: $after
      first: $first
      filter: { search: $query }
      channel: $channel
    ) {
      edges {
        node {
          ...CollectionWithTotalProducts
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const useCollectionWithTotalProductsSearch = makeTopLevelSearch<
  SearchCollectionsWithTotalProductsQuery,
  SearchCollectionsWithTotalProductsQueryVariables
>(SearchCollectionsWithTotalProductsDocument);

export default makeTopLevelSearch<SearchCollectionsQuery, SearchCollectionsQueryVariables>(
  SearchCollectionsDocument,
);
