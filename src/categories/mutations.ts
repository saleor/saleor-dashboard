import { gql } from "@apollo/client";

export const categoryDeleteMutation = gql`
  mutation CategoryDelete($id: ID!) {
    categoryDelete(id: $id) {
      errors {
        ...ProductError
      }
    }
  }
`;
export const categoryCreateMutation = gql`
  mutation CategoryCreate($parent: ID, $input: CategoryInput!) {
    categoryCreate(parent: $parent, input: $input) {
      category {
        ...CategoryDetails
      }
      errors {
        ...ProductError
      }
    }
  }
`;

export const categoryUpdateMutation = gql`
  mutation CategoryUpdate($id: ID!, $input: CategoryInput!) {
    categoryUpdate(id: $id, input: $input) {
      category {
        ...CategoryDetails
      }
      errors {
        ...ProductError
      }
    }
  }
`;

export const categoryBulkDeleteMutation = gql`
  mutation CategoryBulkDelete($ids: [ID!]!) {
    categoryBulkDelete(ids: $ids) {
      errors {
        ...ProductError
      }
    }
  }
`;
