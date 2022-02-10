import { gql } from "@apollo/client";

export const attributeBulkDelete = gql`
  mutation AttributeBulkDelete($ids: [ID!]!) {
    attributeBulkDelete(ids: $ids) {
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;

export const attributeDelete = gql`
  mutation AttributeDelete($id: ID!) {
    attributeDelete(id: $id) {
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;

export const attributeUpdateMutation = gql`
  mutation AttributeUpdate($id: ID!, $input: AttributeUpdateInput!) {
    attributeUpdate(id: $id, input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;

export const attributeValueDelete = gql`
  mutation AttributeValueDelete(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeValueDelete(id: $id) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueListFragment
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;

export const attributeValueUpdateMutation = gql`
  mutation AttributeValueUpdate(
    $id: ID!
    $input: AttributeValueUpdateInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeValueUpdate(id: $id, input: $input) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueListFragment
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;

export const attributeValueCreateMutation = gql`
  mutation AttributeValueCreate(
    $id: ID!
    $input: AttributeValueCreateInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeValueCreate(attribute: $id, input: $input) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueListFragment
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;

export const attributeCreateMutation = gql`
  mutation AttributeCreate($input: AttributeCreateInput!) {
    attributeCreate(input: $input) {
      attribute {
        id
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;

export const attributeValueReorderMutation = gql`
  mutation AttributeValueReorder(
    $id: ID!
    $move: ReorderInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeReorderValues(attributeId: $id, moves: [$move]) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          pageInfo {
            ...PageInfoFragment
          }
          edges {
            cursor
            node {
              id
            }
          }
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
