import { gql } from "@apollo/client";

export const permissionGroupDelete = gql`
  mutation PermissionGroupDelete($id: ID!) {
    permissionGroupDelete(id: $id) {
      errors {
        ...PermissionGroupErrorFragment
      }
    }
  }
`;

export const permissionGroupCreate = gql`
  mutation PermissionGroupCreate($input: PermissionGroupCreateInput!) {
    permissionGroupCreate(input: $input) {
      errors {
        ...PermissionGroupErrorFragment
      }
      group {
        ...PermissionGroupDetailsFragment
      }
    }
  }
`;

export const permissionGroupUpdate = gql`
  mutation PermissionGroupUpdate(
    $id: ID!
    $input: PermissionGroupUpdateInput!
  ) {
    permissionGroupUpdate(id: $id, input: $input) {
      errors {
        ...PermissionGroupErrorFragment
      }
      group {
        ...PermissionGroupDetailsFragment
      }
    }
  }
`;
