import gql from "graphql-tag";

import { productErrorFragment } from "@saleor/attributes/mutations";
import { TypedMutation } from "../mutations";
import { productTypeDetailsFragment } from "./queries";
import {
  AssignAttribute,
  AssignAttributeVariables
} from "./types/AssignAttribute";
import {
  ProductTypeAttributeReorder,
  ProductTypeAttributeReorderVariables
} from "./types/ProductTypeAttributeReorder";
import {
  ProductTypeBulkDelete,
  ProductTypeBulkDeleteVariables
} from "./types/ProductTypeBulkDelete";
import {
  ProductTypeCreate,
  ProductTypeCreateVariables
} from "./types/ProductTypeCreate";
import {
  ProductTypeDelete,
  ProductTypeDeleteVariables
} from "./types/ProductTypeDelete";
import {
  ProductTypeUpdate,
  ProductTypeUpdateVariables
} from "./types/ProductTypeUpdate";
import {
  UnassignAttribute,
  UnassignAttributeVariables
} from "./types/UnassignAttribute";

export const productTypeDeleteMutation = gql`
  ${productErrorFragment}
  mutation ProductTypeDelete($id: ID!) {
    productTypeDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productType {
        id
      }
    }
  }
`;
export const TypedProductTypeDeleteMutation = TypedMutation<
  ProductTypeDelete,
  ProductTypeDeleteVariables
>(productTypeDeleteMutation);

export const productTypeBulkDeleteMutation = gql`
  ${productErrorFragment}
  mutation ProductTypeBulkDelete($ids: [ID]!) {
    productTypeBulkDelete(ids: $ids) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const TypedProductTypeBulkDeleteMutation = TypedMutation<
  ProductTypeBulkDelete,
  ProductTypeBulkDeleteVariables
>(productTypeBulkDeleteMutation);

export const productTypeUpdateMutation = gql`
  ${productErrorFragment}
  ${productTypeDetailsFragment}
  mutation ProductTypeUpdate($id: ID!, $input: ProductTypeInput!) {
    productTypeUpdate(id: $id, input: $input) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const TypedProductTypeUpdateMutation = TypedMutation<
  ProductTypeUpdate,
  ProductTypeUpdateVariables
>(productTypeUpdateMutation);

export const assignAttributeMutation = gql`
  ${productErrorFragment}
  ${productTypeDetailsFragment}
  mutation AssignAttribute($id: ID!, $operations: [AttributeAssignInput!]!) {
    attributeAssign(productTypeId: $id, operations: $operations) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const TypedAssignAttributeMutation = TypedMutation<
  AssignAttribute,
  AssignAttributeVariables
>(assignAttributeMutation);

export const unassignAttributeMutation = gql`
  ${productErrorFragment}
  ${productTypeDetailsFragment}
  mutation UnassignAttribute($id: ID!, $ids: [ID]!) {
    attributeUnassign(productTypeId: $id, attributeIds: $ids) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const TypedUnassignAttributeMutation = TypedMutation<
  UnassignAttribute,
  UnassignAttributeVariables
>(unassignAttributeMutation);

export const productTypeCreateMutation = gql`
  ${productErrorFragment}
  ${productTypeDetailsFragment}
  mutation ProductTypeCreate($input: ProductTypeInput!) {
    productTypeCreate(input: $input) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const TypedProductTypeCreateMutation = TypedMutation<
  ProductTypeCreate,
  ProductTypeCreateVariables
>(productTypeCreateMutation);

const productTypeAttributeReorder = gql`
  ${productErrorFragment}
  ${productTypeDetailsFragment}
  mutation ProductTypeAttributeReorder(
    $move: ReorderInput!
    $productTypeId: ID!
    $type: AttributeTypeEnum!
  ) {
    productTypeReorderAttributes(
      moves: [$move]
      productTypeId: $productTypeId
      type: $type
    ) {
      errors: productErrors {
        ...ProductErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const ProductTypeAttributeReorderMutation = TypedMutation<
  ProductTypeAttributeReorder,
  ProductTypeAttributeReorderVariables
>(productTypeAttributeReorder);
