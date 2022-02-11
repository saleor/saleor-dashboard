import { gql } from "@apollo/client";

export const collectionList = gql`
  query CollectionList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: CollectionFilterInput
    $sort: CollectionSortingInput
    $channel: String
  ) {
    collections(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
      sortBy: $sort
      channel: $channel
    ) {
      edges {
        node {
          ...CollectionFragment
          products {
            totalCount
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const collectionDetails = gql`
  query CollectionDetails(
    $id: ID!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collection(id: $id) {
      ...CollectionDetailsFragment
      products(first: $first, after: $after, before: $before, last: $last) {
        edges {
          node {
            ...CollectionProductFragment
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;
