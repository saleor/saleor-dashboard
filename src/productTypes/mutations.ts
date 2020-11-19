import { productTypeDetailsFragment } from "@saleor/fragments/productTypes";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import {
  AssignProductAttribute,
  AssignProductAttributeVariables
} from "./types/AssignProductAttribute";
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
  mutation ProductTypeDelete($id: ID!) {
    productTypeDelete(id: $id) {
      errors {
        field
        message
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
  mutation ProductTypeBulkDelete($ids: [ID]!) {
    productTypeBulkDelete(ids: $ids) {
      errors {
        field
        message
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
  mutation ProductTypeUpdate($id: ID!, $input: ProductTypeInput!) {
    productTypeUpdate(id: $id, input: $input) {
      errors {
        field
        message
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
  ${productTypeDetailsFragment}
  mutation AssignProductAttribute(
    $id: ID!
    $operations: [ProductAttributeAssignInput!]!
  ) {
    productAttributeAssign(productTypeId: $id, operations: $operations) {
      errors: productErrors {
        field
        message
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
  mutation UnassignProductAttribute($id: ID!, $ids: [ID]!) {
    productAttributeUnassign(productTypeId: $id, attributeIds: $ids) {
      errors: productErrors {
        field
        message
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
  mutation ProductTypeCreate($input: ProductTypeInput!) {
    productTypeCreate(input: $input) {
      errors {
        field
        message
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
        field
        message
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
