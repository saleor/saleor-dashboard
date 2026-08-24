import { gql } from "@apollo/client";

export const customerTypeCreateMutation = gql`
  mutation CustomerTypeCreate($input: CustomerTypeCreateInput!) {
    customerTypeCreate(input: $input) {
      errors {
        ...CustomerTypeCreateError
      }
      customerType {
        ...CustomerTypeDetails
      }
    }
  }
`;

export const customerTypeUpdateMutation = gql`
  mutation CustomerTypeUpdate($id: ID!, $input: CustomerTypeUpdateInput!) {
    customerTypeUpdate(id: $id, input: $input) {
      errors {
        ...CustomerTypeUpdateError
      }
      customerType {
        ...CustomerTypeDetails
      }
    }
  }
`;

export const customerTypeDeleteMutation = gql`
  mutation CustomerTypeDelete($id: ID!) {
    customerTypeDelete(id: $id) {
      errors {
        ...CustomerTypeDeleteError
      }
      customerType {
        id
      }
    }
  }
`;

export const customerTypeAssignAttributesMutation = gql`
  mutation CustomerTypeAssignAttributes($customerTypeId: ID!, $attributeIds: [ID!]!) {
    customerTypeAssignAttributes(customerTypeId: $customerTypeId, attributeIds: $attributeIds) {
      errors {
        ...CustomerTypeAssignAttributesError
      }
      customerType {
        ...CustomerTypeDetails
      }
    }
  }
`;

export const customerTypeUnassignAttributesMutation = gql`
  mutation CustomerTypeUnassignAttributes($customerTypeId: ID!, $attributeIds: [ID!]!) {
    customerTypeUnassignAttributes(customerTypeId: $customerTypeId, attributeIds: $attributeIds) {
      errors {
        ...CustomerTypeUnassignAttributesError
      }
      customerType {
        ...CustomerTypeDetails
      }
    }
  }
`;

export const customerTypeReorderAttributesMutation = gql`
  mutation CustomerTypeReorderAttributes($customerTypeId: ID!, $move: ReorderInput!) {
    customerTypeReorderAttributes(customerTypeId: $customerTypeId, moves: [$move]) {
      errors {
        ...CustomerTypeReorderAttributesError
      }
      customerType {
        ...CustomerTypeDetails
      }
    }
  }
`;
