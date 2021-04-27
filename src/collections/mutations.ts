import {
  CollectionChannelListingUpdate,
  CollectionChannelListingUpdateVariables
} from "@saleor/collections/types/CollectionChannelListingUpdate";
import {
  collectionDetailsFragment,
  collectionProductFragment
} from "@saleor/fragments/collections";
import {
  collectionChannelListingErrorFragment,
  collectionsErrorFragment
} from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  CollectionAssignProduct,
  CollectionAssignProductVariables
} from "./types/CollectionAssignProduct";
import {
  CollectionBulkDelete,
  CollectionBulkDeleteVariables
} from "./types/CollectionBulkDelete";
import {
  CollectionUpdate,
  CollectionUpdateVariables
} from "./types/CollectionUpdate";
import {
  CreateCollection,
  CreateCollectionVariables
} from "./types/CreateCollection";
import {
  RemoveCollection,
  RemoveCollectionVariables
} from "./types/RemoveCollection";
import {
  UnassignCollectionProduct,
  UnassignCollectionProductVariables
} from "./types/UnassignCollectionProduct";

const collectionUpdate = gql`
  ${collectionDetailsFragment}
  ${collectionsErrorFragment}
  mutation CollectionUpdate($id: ID!, $input: CollectionInput!) {
    collectionUpdate(id: $id, input: $input) {
      collection {
        ...CollectionDetailsFragment
      }
      errors {
        ...CollectionErrorFragment
      }
    }
  }
`;
export const useCollectionUpdateMutation = makeMutation<
  CollectionUpdate,
  CollectionUpdateVariables
>(collectionUpdate);

const assignCollectionProduct = gql`
  ${collectionProductFragment}
  ${collectionsErrorFragment}
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
      errors {
        ...CollectionErrorFragment
      }
    }
  }
`;
export const useCollectionAssignProductMutation = makeMutation<
  CollectionAssignProduct,
  CollectionAssignProductVariables
>(assignCollectionProduct);

const createCollection = gql`
  ${collectionDetailsFragment}
  ${collectionsErrorFragment}
  mutation CreateCollection($input: CollectionCreateInput!) {
    collectionCreate(input: $input) {
      collection {
        ...CollectionDetailsFragment
      }
      errors {
        ...CollectionErrorFragment
      }
    }
  }
`;
export const useCollectionCreateMutation = makeMutation<
  CreateCollection,
  CreateCollectionVariables
>(createCollection);

const removeCollection = gql`
  ${collectionsErrorFragment}
  mutation RemoveCollection($id: ID!) {
    collectionDelete(id: $id) {
      errors {
        ...CollectionErrorFragment
      }
    }
  }
`;
export const useCollectionRemoveMutation = makeMutation<
  RemoveCollection,
  RemoveCollectionVariables
>(removeCollection);

const unassignCollectionProduct = gql`
  ${collectionsErrorFragment}
  mutation UnassignCollectionProduct(
    $collectionId: ID!
    $productIds: [ID]!
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
        ...CollectionErrorFragment
      }
    }
  }
`;
export const useUnassignCollectionProductMutation = makeMutation<
  UnassignCollectionProduct,
  UnassignCollectionProductVariables
>(unassignCollectionProduct);

const collectionBulkDelete = gql`
  ${collectionsErrorFragment}
  mutation CollectionBulkDelete($ids: [ID]!) {
    collectionBulkDelete(ids: $ids) {
      errors {
        ...CollectionErrorFragment
      }
    }
  }
`;
export const useCollectionBulkDelete = makeMutation<
  CollectionBulkDelete,
  CollectionBulkDeleteVariables
>(collectionBulkDelete);

const collectionChannelListingUpdate = gql`
  ${collectionChannelListingErrorFragment}
  mutation CollectionChannelListingUpdate(
    $id: ID!
    $input: CollectionChannelListingUpdateInput!
  ) {
    collectionChannelListingUpdate(id: $id, input: $input) {
      errors {
        ...CollectionChannelListingErrorFragment
      }
    }
  }
`;
export const useCollectionChannelListingUpdate = makeMutation<
  CollectionChannelListingUpdate,
  CollectionChannelListingUpdateVariables
>(collectionChannelListingUpdate);
