import { gql } from "@apollo/client";

export const collectionUpdate = gql`
  mutation CollectionUpdate($id: ID!, $input: CollectionInput!) {
    collectionUpdate(id: $id, input: $input) {
      collection {
        ...CollectionDetails
      }
      errors {
        ...CollectionError
      }
    }
  }
`;

/*
  The mutation below has two simultaneous mutations:
  - collectionAddProducts, for adding products to the collection
  - collectionReorderProducts, for resetting its reorder position

  The collectionReorderProducts is used here as a workaround due to issues on the API.
  It does the reorder by moving product by 0, which sets the initial reorder position.

  Additionally, collectionAddProducts gets only the errors as requested field,
  while collectionReorderProducts takes the desired response (products and collection id) - this is
  intentional as we are interested only in the response from reorder mutation, and
  only that will invalidate the apollo cache (because of request collection id presence, required for cache key)
*/
export const assignCollectionProduct = gql`
  mutation CollectionAssignProduct(
    $collectionId: ID!
    $productIds: [ID!]!
    $moves: [MoveProductInput!]!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collectionAddProducts(collectionId: $collectionId, products: $productIds) {
      errors {
        ...CollectionError
      }
    }
    collectionReorderProducts(collectionId: $collectionId, moves: $moves) {
      collection {
        id
        products(
          first: $first
          after: $after
          before: $before
          last: $last
          sortBy: { field: COLLECTION, direction: ASC }
        ) {
          edges {
            node {
              ...CollectionProduct
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
      errors {
        message
      }
    }
  }
`;

export const createCollection = gql`
  mutation CreateCollection($input: CollectionCreateInput!) {
    collectionCreate(input: $input) {
      collection {
        ...CollectionDetails
      }
      errors {
        ...CollectionError
      }
    }
  }
`;

export const removeCollection = gql`
  mutation RemoveCollection($id: ID!) {
    collectionDelete(id: $id) {
      errors {
        ...CollectionError
      }
    }
  }
`;

export const unassignCollectionProduct = gql`
  mutation UnassignCollectionProduct(
    $collectionId: ID!
    $productIds: [ID!]!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collectionRemoveProducts(collectionId: $collectionId, products: $productIds) {
      collection {
        id
        products(
          first: $first
          after: $after
          before: $before
          last: $last
          sortBy: { field: COLLECTION, direction: ASC }
        ) {
          edges {
            node {
              ...CollectionProduct
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
      errors {
        ...CollectionError
      }
    }
  }
`;

export const collectionBulkDelete = gql`
  mutation CollectionBulkDelete($ids: [ID!]!) {
    collectionBulkDelete(ids: $ids) {
      errors {
        ...CollectionError
      }
    }
  }
`;

export const collectionChannelListingUpdate = gql`
  mutation CollectionChannelListingUpdate($id: ID!, $input: CollectionChannelListingUpdateInput!) {
    collectionChannelListingUpdate(id: $id, input: $input) {
      errors {
        ...CollectionChannelListingError
      }
    }
  }
`;

export const reorderProductsInCollection = gql`
  mutation ReorderProductsInCollection(
    $collectionId: ID!
    $moves: [MoveProductInput!]!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collectionReorderProducts(collectionId: $collectionId, moves: $moves) {
      collection {
        id
        products(
          first: $first
          after: $after
          before: $before
          last: $last
          sortBy: { field: COLLECTION, direction: ASC }
        ) {
          edges {
            node {
              ...CollectionProduct
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
      errors {
        message
      }
    }
  }
`;
