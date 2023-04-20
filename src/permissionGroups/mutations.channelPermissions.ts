import { gql } from "@apollo/client";

export const permissionGroupWithChannelsCreateMutation = gql`
  mutation permissionGroupWithChannelsCreate(
    $input: PermissionGroupCreateInput!
  ) {
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

export const permissionGroupWithGroupUpdateMutation = gql`
  mutation PermissionGroupWithGroupUpdate(
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
