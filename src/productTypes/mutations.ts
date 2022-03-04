import { gql } from "@apollo/client";
import {
  productAttributeAssignErrorFragment,
  productAttributeAssignmentUpdateErrorFragment,
  productAttributeUnassignErrorFragment,
  productTypeBulkDeleteErrorFragment,
  productTypeBulkUpdateErrorFragment,
  productTypeCreateErrorFragment,
  productTypeDeleteErrorFragment,
  productTypeReorderAttributesErrorFragment
} from "@saleor/fragments/errors";
import { productTypeDetailsFragment } from "@saleor/fragments/productTypes";
import makeMutation from "@saleor/hooks/makeMutation";

import { TypedMutation } from "../mutations";
import {
  AssignProductAttribute,
  AssignProductAttributeVariables
} from "./types/AssignProductAttribute";
import {
  ProductAttributeAssignmentUpdate,
  ProductAttributeAssignmentUpdateVariables
} from "./types/ProductAttributeAssignmentUpdate";
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
  UnassignProductAttribute,
  UnassignProductAttributeVariables
} from "./types/UnassignProductAttribute";

export const productTypeDeleteMutation = gql`
  ${productTypeDeleteErrorFragment}
  mutation ProductTypeDelete($id: ID!) {
    productTypeDelete(id: $id) {
      errors {
        ...ProductTypeDeleteErrorFragment
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
  ${productTypeBulkDeleteErrorFragment}
  mutation ProductTypeBulkDelete($ids: [ID]!) {
    productTypeBulkDelete(ids: $ids) {
      errors {
        ...ProductTypeBulkDeleteErrorFragment
      }
    }
  }
`;
export const TypedProductTypeBulkDeleteMutation = TypedMutation<
  ProductTypeBulkDelete,
  ProductTypeBulkDeleteVariables
>(productTypeBulkDeleteMutation);

export const productTypeUpdateMutation = gql`
  ${productTypeDetailsFragment}
  ${productTypeBulkUpdateErrorFragment}
  mutation ProductTypeUpdate($id: ID!, $input: ProductTypeInput!) {
    productTypeUpdate(id: $id, input: $input) {
      errors {
        ...ProductTypeBulkUpdateErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const useProductTypeUpdateMutation = makeMutation<
  ProductTypeUpdate,
  ProductTypeUpdateVariables
>(productTypeUpdateMutation);

export const assignProductAttributeMutation = gql`
  ${productAttributeAssignErrorFragment}
  ${productTypeDetailsFragment}
  mutation AssignProductAttribute(
    $id: ID!
    $operations: [ProductAttributeAssignInput!]!
  ) {
    productAttributeAssign(productTypeId: $id, operations: $operations) {
      errors {
        ...ProductAttributeAssignErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const TypedAssignProductAttributeMutation = TypedMutation<
  AssignProductAttribute,
  AssignProductAttributeVariables
>(assignProductAttributeMutation);

export const unassignProductAttributeMutation = gql`
  ${productTypeDetailsFragment}
  ${productAttributeUnassignErrorFragment}
  mutation UnassignProductAttribute($id: ID!, $ids: [ID]!) {
    productAttributeUnassign(productTypeId: $id, attributeIds: $ids) {
      errors {
        ...ProductAttributeUnassignErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;
export const TypedUnassignProductAttributeMutation = TypedMutation<
  UnassignProductAttribute,
  UnassignProductAttributeVariables
>(unassignProductAttributeMutation);

export const productTypeCreateMutation = gql`
  ${productTypeDetailsFragment}
  ${productTypeCreateErrorFragment}
  mutation ProductTypeCreate($input: ProductTypeInput!) {
    productTypeCreate(input: $input) {
      errors {
        ...ProductTypeCreateErrorFragment
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
  ${productTypeDetailsFragment}
  ${productTypeReorderAttributesErrorFragment}
  mutation ProductTypeAttributeReorder(
    $move: ReorderInput!
    $productTypeId: ID!
    $type: ProductAttributeType!
  ) {
    productTypeReorderAttributes(
      moves: [$move]
      productTypeId: $productTypeId
      type: $type
    ) {
      errors {
        ...ProductTypeReorderAttributesErrorFragment
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

export const productAttributeAssignmentUpdate = gql`
  ${productTypeDetailsFragment}
  ${productAttributeAssignmentUpdateErrorFragment}
  mutation ProductAttributeAssignmentUpdate(
    $operations: [ProductAttributeAssignmentUpdateInput]!
    $productTypeId: ID!
  ) {
    productAttributeAssignmentUpdate(
      operations: $operations
      productTypeId: $productTypeId
    ) {
      errors {
        ...ProductAttributeAssignmentUpdateErrorFragment
      }
      productType {
        ...ProductTypeDetailsFragment
      }
    }
  }
`;

export const useProductAttributeAssignmentUpdateMutation = makeMutation<
  ProductAttributeAssignmentUpdate,
  ProductAttributeAssignmentUpdateVariables
>(productAttributeAssignmentUpdate);
