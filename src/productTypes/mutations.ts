import { gql } from "@apollo/client";

export const productTypeDeleteMutation = gql`
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

export const productTypeBulkDeleteMutation = gql`
  mutation ProductTypeBulkDelete($ids: [ID!]!) {
    productTypeBulkDelete(ids: $ids) {
      errors {
        ...ProductTypeBulkDeleteErrorFragment
      }
    }
  }
`;

export const productTypeUpdateMutation = gql`
  mutation ProductTypeUpdate($id: ID!, $input: ProductTypeInput!) {
    productTypeUpdate(id: $id, input: $input) {
      errors {
        ...ProductTypeBulkUpdateErrorFragment
      }
      productType {
        ...ProductTypeDetails
      }
    }
  }
`;

export const assignProductAttributeMutation = gql`
  mutation AssignProductAttribute(
    $id: ID!
    $operations: [ProductAttributeAssignInput!]!
  ) {
    productAttributeAssign(productTypeId: $id, operations: $operations) {
      errors {
        ...ProductAttributeAssignErrorFragment
      }
      productType {
        ...ProductTypeDetails
      }
    }
  }
`;

export const unassignProductAttributeMutation = gql`
  mutation UnassignProductAttribute($id: ID!, $ids: [ID!]!) {
    productAttributeUnassign(productTypeId: $id, attributeIds: $ids) {
      errors {
        ...ProductAttributeUnassignErrorFragment
      }
      productType {
        ...ProductTypeDetails
      }
    }
  }
`;

export const productTypeCreateMutation = gql`
  mutation ProductTypeCreate($input: ProductTypeInput!) {
    productTypeCreate(input: $input) {
      errors {
        ...ProductTypeCreateErrorFragment
      }
      productType {
        ...ProductTypeDetails
      }
    }
  }
`;

export const productTypeAttributeReorder = gql`
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
        ...ProductTypeDetails
      }
    }
  }
`;

export const productAttributeAssignmentUpdate = gql`
  mutation ProductAttributeAssignmentUpdate(
    $operations: [ProductAttributeAssignmentUpdateInput!]!
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
        ...ProductTypeDetails
      }
    }
  }
`;
