import {
  collectionDetailsFragment,
  collectionProductFragment
} from "@saleor/fragments/collections";
import {
  productErrorFragment,
  shopErrorFragment
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
export const useCollectionUpdateMutation = makeMutation<
  CollectionUpdate,
  CollectionUpdateVariables
>(collectionUpdate);

const collectionUpdateWithHomepage = gql`
  ${collectionDetailsFragment}
  ${productErrorFragment}
  ${shopErrorFragment}
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
export const useCollectionUpdateWithHomepageMutation = makeMutation<
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
export const useCollectionAssignProductMutation = makeMutation<
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
export const useCollectionCreateMutation = makeMutation<
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
export const useCollectionRemoveMutation = makeMutation<
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
export const useUnassignCollectionProductMutation = makeMutation<
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
export const useCollectionBulkDelete = makeMutation<
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
export const useCollectionBulkPublish = makeMutation<
  CollectionBulkPublish,
  CollectionBulkPublishVariables
>(collectionBulkPublish);
