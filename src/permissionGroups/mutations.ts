import { gql } from "@apollo/client";

export const permissionGroupDelete = gql`
  mutation PermissionGroupDelete($id: ID!) {
    permissionGroupDelete(id: $id) {
      errors {
        ...PermissionGroupError
      }
    }
  }
`;

export const permissionGroupCreate = gql`
  mutation PermissionGroupCreate($input: PermissionGroupCreateInput!) {
    permissionGroupCreate(input: $input) {
      errors {
        ...PermissionGroupError
      }
      group {
        ...PermissionGroupDetails
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
        ...PermissionGroupError
      }
      group {
        ...PermissionGroupDetails
      }
    }
  }
`;
