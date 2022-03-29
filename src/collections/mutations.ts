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

export const assignCollectionProduct = gql`
  mutation CollectionAssignProduct(
    $collectionId: ID!
    $productIds: [ID!]!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    collectionAddProducts(collectionId: $collectionId, products: $productIds) {
      collection {
        id
        products(first: $first, after: $after, before: $before, last: $last) {
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
    collectionRemoveProducts(
      collectionId: $collectionId
      products: $productIds
    ) {
      collection {
        id
        products(first: $first, after: $after, before: $before, last: $last) {
          edges {
            node {
              id
              name
              productType {
                id
                name
              }
              thumbnail {
                url
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
  mutation CollectionChannelListingUpdate(
    $id: ID!
    $input: CollectionChannelListingUpdateInput!
  ) {
    collectionChannelListingUpdate(id: $id, input: $input) {
      errors {
        ...CollectionChannelListingError
      }
    }
  }
`;
