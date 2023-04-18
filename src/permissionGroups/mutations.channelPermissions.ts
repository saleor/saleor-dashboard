import { gql } from "@apollo/client";

export const newPermissionGroupCreate = gql`
  mutation NewPermissionGroupCreate($input: PermissionGroupCreateInput!) {
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

export const newPermissionGroupUpdate = gql`
  mutation NewPermissionGroupUpdate(
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
