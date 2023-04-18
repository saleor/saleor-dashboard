import { gql } from "@apollo/client";

export const newPermissionGroupDetailsQuery = gql`
  query NewPermissionGroupDetails($id: ID!, $userId: ID!) {
    permissionGroup(id: $id) {
      ...NewPermissionGroupDetails
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
