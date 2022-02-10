import { gql } from "@apollo/client";

export const categoryDeleteMutation = gql`
  mutation CategoryDelete($id: ID!) {
    categoryDelete(id: $id) {
      errors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const categoryCreateMutation = gql`
  mutation CategoryCreate($parent: ID, $input: CategoryInput!) {
    categoryCreate(parent: $parent, input: $input) {
      category {
        ...CategoryDetailsFragment
      }
      errors {
        ...ProductErrorFragment
      }
    }
  }
`;

export const categoryUpdateMutation = gql`
  mutation CategoryUpdate($id: ID!, $input: CategoryInput!) {
    categoryUpdate(id: $id, input: $input) {
      category {
        ...CategoryDetailsFragment
      }
      errors {
        ...ProductErrorFragment
      }
    }
  }
`;

export const categoryBulkDeleteMutation = gql`
  mutation CategoryBulkDelete($ids: [ID]!) {
    categoryBulkDelete(ids: $ids) {
      errors {
        ...ProductErrorFragment
      }
    }
  }
`;
