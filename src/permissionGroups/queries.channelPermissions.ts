import { gql } from "@apollo/client";

export const PermissionGroupWithChannelsDetailsQuery = gql`
  query PermissionGroupWithChannelsDetails($id: ID!, $userId: ID!) {
    permissionGroup(id: $id) {
      ...PermissionGroupWithContextDetails
    }
    user(id: $userId) {
      editableGroups {
        id
      }
      userPermissions {
        code
        sourcePermissionGroups(userId: $userId) {
          id
        }
      }
    }
  }
`;
