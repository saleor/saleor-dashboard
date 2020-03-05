import gql from "graphql-tag";

import { productErrorFragment } from "@saleor/attributes/mutations";
import { TypedMutation } from "../mutations";
import {
  collectionDetailsFragment,
  collectionProductFragment
} from "./queries";
import {
  CollectionAssignProduct,
  CollectionAssignProductVariables
} from "./types/CollectionAssignProduct";
import {
  CollectionBulkDelete,
  CollectionBulkDeleteVariables
} from "./types/CollectionBulkDelete";
import {
  CollectionBulkPublish,
  CollectionBulkPublishVariables
} from "./types/CollectionBulkPublish";
import {
  CollectionUpdate,
  CollectionUpdateVariables
} from "./types/CollectionUpdate";
import {
  CollectionUpdateWithHomepage,
  CollectionUpdateWithHomepageVariables
} from "./types/CollectionUpdateWithHomepage";
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

export const ShopErrorFragment = gql`
  fragment ShopErrorFragment on ShopError {
    code
    field
  }
`;

const collectionUpdate = gql`
  ${collectionDetailsFragment}
  ${productErrorFragment}
  mutation CollectionUpdate($id: ID!, $input: CollectionInput!) {
    collectionUpdate(id: $id, input: $input) {
      collection {
        ...CollectionDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedCollectionUpdateMutation = TypedMutation<
  CollectionUpdate,
  CollectionUpdateVariables
>(collectionUpdate);

const collectionUpdateWithHomepage = gql`
  ${collectionDetailsFragment}
  ${productErrorFragment}
  ${ShopErrorFragment}
  mutation CollectionUpdateWithHomepage(
    $id: ID!
    $input: CollectionInput!
    $homepageId: ID
  ) {
    homepageCollectionUpdate(collection: $homepageId) {
      errors: shopErrors {
        ...ShopErrorFragment
      }
      shop {
        homepageCollection {
          id
        }
      }
    }
    collectionUpdate(id: $id, input: $input) {
      collection {
        ...CollectionDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedCollectionUpdateWithHomepageMutation = TypedMutation<
  CollectionUpdateWithHomepage,
  CollectionUpdateWithHomepageVariables
>(collectionUpdateWithHomepage);

const assignCollectionProduct = gql`
  ${collectionProductFragment}
  ${productErrorFragment}
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
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedCollectionAssignProductMutation = TypedMutation<
  CollectionAssignProduct,
  CollectionAssignProductVariables
>(assignCollectionProduct);

const createCollection = gql`
  ${collectionDetailsFragment}
  ${productErrorFragment}
  mutation CreateCollection($input: CollectionCreateInput!) {
    collectionCreate(input: $input) {
      collection {
        ...CollectionDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedCollectionCreateMutation = TypedMutation<
  CreateCollection,
  CreateCollectionVariables
>(createCollection);

const removeCollection = gql`
  ${productErrorFragment}
  mutation RemoveCollection($id: ID!) {
    collectionDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedCollectionRemoveMutation = TypedMutation<
  RemoveCollection,
  RemoveCollectionVariables
>(removeCollection);

const unassignCollectionProduct = gql`
  ${productErrorFragment}
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
              isPublished
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
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedUnassignCollectionProductMutation = TypedMutation<
  UnassignCollectionProduct,
  UnassignCollectionProductVariables
>(unassignCollectionProduct);

const collectionBulkDelete = gql`
  ${productErrorFragment}
  mutation CollectionBulkDelete($ids: [ID]!) {
    collectionBulkDelete(ids: $ids) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedCollectionBulkDelete = TypedMutation<
  CollectionBulkDelete,
  CollectionBulkDeleteVariables
>(collectionBulkDelete);

const collectionBulkPublish = gql`
  ${productErrorFragment}
  mutation CollectionBulkPublish($ids: [ID]!, $isPublished: Boolean!) {
    collectionBulkPublish(ids: $ids, isPublished: $isPublished) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedCollectionBulkPublish = TypedMutation<
  CollectionBulkPublish,
  CollectionBulkPublishVariables
>(collectionBulkPublish);
