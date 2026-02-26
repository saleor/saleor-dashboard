// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchCollectionsDocument,
  type SearchCollectionsQuery,
  type SearchCollectionsQueryVariables,
  SearchCollectionsWithTotalProductsDocument,
  type SearchCollectionsWithTotalProductsQuery,
  type SearchCollectionsWithTotalProductsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchCollections = gql`
  query SearchCollections(
    $after: String
    $first: Int!
    $channel: String
    $filter: CollectionFilterInput
  ) {
    search: collections(after: $after, first: $first, filter: $filter, channel: $channel) {
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
    $filter: CollectionFilterInput
    $channel: String
  ) {
    search: collections(after: $after, first: $first, filter: $filter, channel: $channel) {
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
>(SearchCollectionsWithTotalProductsDocument, {
  mapSearchToVariables: (searchQuery, variables) => ({
    ...variables,
    filter: { ...variables.filter, search: searchQuery },
  }),
});

export default makeTopLevelSearch<SearchCollectionsQuery, SearchCollectionsQueryVariables>(
  SearchCollectionsDocument,
  {
    mapSearchToVariables: (searchQuery, variables) => ({
      ...variables,
      filter: { ...variables.filter, search: searchQuery },
    }),
  },
);
